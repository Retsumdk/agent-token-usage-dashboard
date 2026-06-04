/**
 * Core type definitions for agent-token-usage-dashboard
 */

export interface TokenUsageRecord {
  timestamp: string;
  agentId: string;
  agentName: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costEstimate?: number;
  metadata?: Record<string, any>;
}

export interface UsageSummary {
  period: {
    start: string;
    end: string;
  };
  totals: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
  byAgent: Record<string, AgentSummary>;
  byModel: Record<string, ModelSummary>;
}

export interface AgentSummary {
  name: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  recordsCount: number;
}

export interface ModelSummary {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  recordsCount: number;
}

export interface DashboardOptions {
  title: string;
  theme: 'light' | 'dark';
  width: number;
  height: number;
}
