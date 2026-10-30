import React from 'react';
import { Cpu, CheckCircle2, ChevronRight, Database, Zap } from 'lucide-react';
import type { AgentReasoningStep } from '../types';

interface AgentReasoningPanelProps {
  steps: AgentReasoningStep[];
  isExecuting: boolean;
  totalLatencyMs?: number;
}

export const AgentReasoningPanel: React.FC<AgentReasoningPanelProps> = ({
  steps,
  isExecuting,
  totalLatencyMs,
}) => {
  return (
    <div className="h-full flex flex-col bg-[#fcfbf9] border-l border-[#e6e4dc]">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#e6e4dc] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-stone-800" />
            <h2 className="editorial-title text-base font-bold text-[#1a1917] tracking-tight">
              Agentic Reasoning Stream
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-600/30 text-emerald-800 bg-emerald-50">
            5/5 AGENTS COMMITTEE
          </span>
        </div>
        <p className="text-xs text-[#68665f] mt-1">
          Traceable decision audit trail with anti-hallucination source attribution.
        </p>
      </div>

      {/* Steps Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isExecuting && steps.length === 0 && (
          <div className="p-6 text-center text-xs text-[#68665f] space-y-2">
            <Zap className="w-5 h-5 mx-auto text-amber-600 animate-bounce" />
            <p className="font-mono">Swarm state machine executing across live APIs...</p>
          </div>
        )}

        {steps.map((step) => {
          return (
            <div
              key={step.step_number}
              className="bg-white border border-[#e6e4dc] p-3.5 shadow-2xs relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#f0eee6] pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-none bg-[#1a1917] text-white text-[10px] font-mono flex items-center justify-center font-bold">
                    {step.step_number}
                  </span>
                  <span className="font-semibold text-xs text-[#1a1917]">
                    {step.agent}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#68665f]">
                  <span>{step.execution_duration_ms} ms</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1 border border-emerald-200">
                    {(step.confidence * 100).toFixed(0)}% conf
                  </span>
                </div>
              </div>

              {/* Action */}
              <p className="text-xs text-[#33312e] leading-relaxed">
                {step.action_taken}
              </p>

              {/* Tool Invocation */}
              <div className="mt-2.5 bg-[#f7f6f2] p-2 border border-[#e6e4dc] text-[11px] font-mono text-[#4a4843]">
                <div className="text-[10px] text-[#858279] uppercase tracking-wider mb-0.5">
                  Tool Executed:
                </div>
                <div className="text-[#1a1917] font-semibold flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-stone-500" />
                  {step.tool_invoked}
                </div>
                <div className="mt-1 text-[#5c5952] text-[10.5px]">
                  {step.output_summary}
                </div>
              </div>

              {/* Source Attribution Tag */}
              <div className="mt-2.5 pt-2 border-t border-[#f0eee6] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#68665f] flex items-center gap-1">
                  <Database className="w-3 h-3 text-stone-500" />
                  Source: {step.source_attribution}
                </span>
                <span className="text-emerald-700 flex items-center gap-0.5 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Grounded
                </span>
              </div>
            </div>
          );
        })}

        {totalLatencyMs && (
          <div className="p-3 bg-[#f7f6f2] border border-[#e6e4dc] text-center text-xs font-mono text-[#68665f]">
            Autonomous Swarm Convergence in <strong className="text-[#1a1917]">{totalLatencyMs} ms</strong>
          </div>
        )}
      </div>
    </div>
  );
};
