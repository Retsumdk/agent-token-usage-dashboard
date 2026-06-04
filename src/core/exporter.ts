import { writeFileSync } from "fs";
import { UsageSummary } from "./types";

/**
 * Exporter class for saving summaries in different formats
 */
export class TokenUsageExporter {
  private summary: UsageSummary;

  constructor(summary: UsageSummary) {
    this.summary = summary;
  }

  public exportJSON(path: string): void {
    writeFileSync(path, JSON.stringify(this.summary, null, 2));
  }

  public exportCSV(path: string): void {
    let csv = "Category,ID/Name,Prompt Tokens,Completion Tokens,Total Tokens,Cost,Calls\n";
    
    // Totals row
    csv += `TOTAL,All,${this.summary.totals.promptTokens},${this.summary.totals.completionTokens},${this.summary.totals.totalTokens},${this.summary.totals.estimatedCost.toFixed(6)},-\n`;
    
    // Agent rows
    for (const [id, data] of Object.entries(this.summary.byAgent)) {
      csv += `Agent,${data.name} (${id}),${data.promptTokens},${data.completionTokens},${data.totalTokens},${data.estimatedCost.toFixed(6)},${data.recordsCount}\n`;
    }
    
    // Model rows
    for (const [name, data] of Object.entries(this.summary.byModel)) {
      csv += `Model,${name},${data.promptTokens},${data.completionTokens},${data.totalTokens},${data.estimatedCost.toFixed(6)},${data.recordsCount}\n`;
    }

    writeFileSync(path, csv);
  }
}
