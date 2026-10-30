from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "SENTINEL — Autonomous Disaster Intelligence & Logistics Swarm"
    APP_VERSION: str = "2.0.0"
    ENVIRONMENT: str = "production"
    
    # Gemini LLM Key (optional: will use fallback algorithmic reasoning if key is not configured)
    GEMINI_API_KEY: Optional[str] = None
    
    # OpenWeatherMap Key (optional: Open-Meteo free live API is used as default reliable source)
    OPENWEATHER_API_KEY: Optional[str] = None
    
    # OSRM Public Routing URL
    OSRM_API_URL: str = "https://router.project-osrm.org"
    
    # GDACS Global Disaster Alert Feed
    GDACS_RSS_URL: str = "https://www.gdacs.org/xml/rss.xml"
    
    # Open-Meteo Base URL (100% Free, No API key needed, strictly live data)
    OPEN_METEO_URL: str = "https://api.open-meteo.com/v1"
    
    # Nominatim OpenStreetMap Geocoding
    NOMINATIM_URL: str = "https://nominatim.openstreetmap.org"
    
    # Polling & Monitoring interval (seconds)
    MONITOR_INTERVAL_SECONDS: int = 45

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

