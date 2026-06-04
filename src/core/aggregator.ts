import { TokenUsageRecord, UsageSummary, AgentSummary, ModelSummary } from "./types";

/**
 * Logic for aggregating raw token usage records into summaries
 */
export class TokenUsageAggregator {
  private records: TokenUsageRecord[] = [];

  constructor(records: TokenUsageRecord[] = []) {
    this.records = records;
  }

  public addRecord(record: TokenUsageRecord): void {
    this.records.push(record);
  }

  public aggregate(): UsageSummary {
    if (this.records.length === 0) {
      return this.getEmptySummary();
    }

    const sorted = [...this.records].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const summary: UsageSummary = {
      period: {
        start: sorted[0].timestamp,
        end: sorted[sorted.length - 1].timestamp,
      },
      totals: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        estimatedCost: 0,
      },
      byAgent: {},
      byModel: {},
    };

    for (const record of this.records) {
      // Update global totals
      summary.totals.promptTokens += record.promptTokens;
      summary.totals.completionTokens += record.completionTokens;
      summary.totals.totalTokens += record.totalTokens;
      summary.totals.estimatedCost += record.costEstimate || 0;

      // Update byAgent
      if (!summary.byAgent[record.agentId]) {
        summary.byAgent[record.agentId] = this.getEmptyAgentSummary(record.agentName);
      }
      const agent = summary.byAgent[record.agentId];
      agent.promptTokens += record.promptTokens;
      agent.completionTokens += record.completionTokens;
      agent.totalTokens += record.totalTokens;
      agent.estimatedCost += record.costEstimate || 0;
      agent.recordsCount++;

      // Update byModel
      if (!summary.byModel[record.model]) {
        summary.byModel[record.model] = this.getEmptyModelSummary();
      }
      const model = summary.byModel[record.model];
      model.promptTokens += record.promptTokens;
      model.completionTokens += record.completionTokens;
      model.totalTokens += record.totalTokens;
      model.estimatedCost += record.costEstimate || 0;
      model.recordsCount++;
    }

    return summary;
  }

  private getEmptySummary(): UsageSummary {
    const now = new Date().toISOString();
    return {
      period: { start: now, end: now },
      totals: { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 },
      byAgent: {},
      byModel: {},
    };
  }

  private getEmptyAgentSummary(name: string): AgentSummary {
    return {
      name,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      estimatedCost: 0,
      recordsCount: 0,
    };
  }

  private getEmptyModelSummary(): ModelSummary {
    return {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      estimatedCost: 0,
      recordsCount: 0,
    };
  }
}
