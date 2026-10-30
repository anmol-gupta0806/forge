import time
import ipaddress
import urllib.parse
from typing import Dict, Tuple
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response, JSONResponse

# Allowlisted upstream external hostnames (SSRF Defense)
ALLOWED_EXTERNAL_HOSTS = {
    "api.open-meteo.com",
    "router.project-osrm.org",
    "www.gdacs.org",
    "gdacs.org",
    "nominatim.openstreetmap.org",
    "tile.openstreetmap.org",
    "mausam.imd.gov.in",
    "cwc.gov.in",
    "generativelanguage.googleapis.com"
}

def is_safe_external_url(url_str: str) -> bool:
    """
    Validates that a URL strictly targets allowlisted humanitarian & meteorological hostnames.
    Prevents Server-Side Request Forgery (SSRF) to internal/loopback IPs.
    """
    try:
        parsed = urllib.parse.urlparse(url_str)
        if parsed.scheme not in ("http", "https"):
            return False
        
        hostname = (parsed.hostname or "").lower()
        if hostname not in ALLOWED_EXTERNAL_HOSTS:
            return False
            
        # Check if hostname is an IP literal
        try:
            ip = ipaddress.ip_address(hostname)
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                return False
        except ValueError:
            # Not an IP literal, valid domain
            pass

        return True
    except Exception:
        return False


class RateLimiter:
    """
    In-memory sliding window rate limiter.
    Protects compute-heavy swarm execution from DoS and API exhaustion.
    """
    def __init__(self, max_requests: int = 30, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.clients: Dict[str, list] = {}

    def is_allowed(self, client_ip: str) -> Tuple[bool, int]:
        now = time.time()
        timestamps = self.clients.get(client_ip, [])
        
        # Filter out timestamps outside window
        cutoff = now - self.window_seconds
        valid_timestamps = [t for t in timestamps if t > cutoff]
        
        if len(valid_timestamps) >= self.max_requests:
            retry_after = int(self.window_seconds - (now - valid_timestamps[0]))
            self.clients[client_ip] = valid_timestamps
            return False, max(1, retry_after)
            
        valid_timestamps.append(now)
        self.clients[client_ip] = valid_timestamps
        return True, 0


swarm_rate_limiter = RateLimiter(max_requests=25, window_seconds=60)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Enforces OWASP recommended security headers across all responses.
    """
    async def dispatch(self, request: Request, call_next):
        # Enforce rate limit specifically for swarm execution
        if request.url.path == "/api/v1/swarm/execute" and request.method == "POST":
            client_ip = request.client.host if request.client else "unknown"
            allowed, retry_after = swarm_rate_limiter.is_allowed(client_ip)
            if not allowed:
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "error": "Rate limit exceeded",
                        "message": f"Too many swarm execution requests. Please wait {retry_after} seconds.",
                        "retry_after": retry_after
                    },
                    headers={"Retry-After": str(retry_after)}
                )

        response: Response = await call_next(request)
        
        # Add Security Headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(self), microphone=(), camera=()"
        return response
