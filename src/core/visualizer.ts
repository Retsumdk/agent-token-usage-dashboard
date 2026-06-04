import { UsageSummary, DashboardOptions } from "./types";

/**
 * Visualizer class for generating dashboard assets
 */
export class TokenUsageVisualizer {
  private summary: UsageSummary;
  private options: DashboardOptions;

  constructor(summary: UsageSummary, options: Partial<DashboardOptions> = {}) {
    this.summary = summary;
    this.options = {
      title: options.title || "Agent Token Usage Dashboard",
      theme: options.theme || "dark",
      width: options.width || 800,
      height: options.height || 600,
    };
  }

  public generateHTML(): string {
    const themeColors = this.getThemeColors();
    const agentRows = Object.entries(this.summary.byAgent)
      .map(([id, data]) => `
        <tr class="border-b border-gray-700">
          <td class="py-2 px-4">${data.name}</td>
          <td class="py-2 px-4 text-right">${data.totalTokens.toLocaleString()}</td>
          <td class="py-2 px-4 text-right">$${data.estimatedCost.toFixed(4)}</td>
          <td class="py-2 px-4 text-right">${data.recordsCount}</td>
        </tr>
      `).join("");

    const modelRows = Object.entries(this.summary.byModel)
      .map(([name, data]) => `
        <tr class="border-b border-gray-700">
          <td class="py-2 px-4">${name}</td>
          <td class="py-2 px-4 text-right">${data.totalTokens.toLocaleString()}</td>
          <td class="py-2 px-4 text-right">$${data.estimatedCost.toFixed(4)}</td>
          <td class="py-2 px-4 text-right">${data.recordsCount}</td>
        </tr>
      `).join("");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.options.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: ${themeColors.bg}; color: ${themeColors.text}; }
        .card { background-color: ${themeColors.card}; border: 1px solid ${themeColors.border}; }
    </style>
</head>
<body class="p-8 font-sans">
    <div class="max-w-6xl mx-auto">
        <header class="mb-8 flex justify-between items-end">
            <div>
                <h1 class="text-3xl font-bold mb-2">${this.options.title}</h1>
                <p class="text-gray-400">Period: ${new Date(this.summary.period.start).toLocaleDateString()} - ${new Date(this.summary.period.end).toLocaleDateString()}</p>
            </div>
            <div class="text-right">
                <div class="text-4xl font-mono text-blue-400">$${this.summary.totals.estimatedCost.toFixed(2)}</div>
                <div class="text-gray-500 uppercase text-xs tracking-widest font-bold">Total Estimated Cost</div>
            </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="card p-6 rounded-lg shadow-xl">
                <div class="text-gray-500 text-sm mb-1">Total Tokens</div>
                <div class="text-2xl font-bold">${this.summary.totals.totalTokens.toLocaleString()}</div>
            </div>
            <div class="card p-6 rounded-lg shadow-xl">
                <div class="text-gray-500 text-sm mb-1">Prompt Tokens</div>
                <div class="text-2xl font-bold">${this.summary.totals.promptTokens.toLocaleString()}</div>
            </div>
            <div class="card p-6 rounded-lg shadow-xl">
                <div class="text-gray-500 text-sm mb-1">Completion Tokens</div>
                <div class="text-2xl font-bold">${this.summary.totals.completionTokens.toLocaleString()}</div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
                <h2 class="text-xl font-bold mb-4 flex items-center">
                    <span class="w-2 h-6 bg-blue-500 mr-3"></span> Usage by Agent
                </h2>
                <div class="card rounded-lg overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-800 text-gray-400 text-xs uppercase">
                            <tr>
                                <th class="py-3 px-4">Agent</th>
                                <th class="py-3 px-4 text-right">Tokens</th>
                                <th class="py-3 px-4 text-right">Cost</th>
                                <th class="py-3 px-4 text-right">Calls</th>
                            </tr>
                        </thead>
                        <tbody>${agentRows}</tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 class="text-xl font-bold mb-4 flex items-center">
                    <span class="w-2 h-6 bg-purple-500 mr-3"></span> Usage by Model
                </h2>
                <div class="card rounded-lg overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-800 text-gray-400 text-xs uppercase">
                            <tr>
                                <th class="py-3 px-4">Model</th>
                                <th class="py-3 px-4 text-right">Tokens</th>
                                <th class="py-3 px-4 text-right">Cost</th>
                                <th class="py-3 px-4 text-right">Calls</th>
                            </tr>
                        </thead>
                        <tbody>${modelRows}</tbody>
                    </table>
                </div>
            </section>
        </div>

        <footer class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-600 text-sm">
            Generated by Agent Token Usage Dashboard &bull; Retsumdk
        </footer>
    </div>
</body>
</html>
    `;
  }

  private getThemeColors() {
    return this.options.theme === "dark" 
      ? { bg: "#0f172a", text: "#f8fafc", card: "#1e293b", border: "#334155" }
      : { bg: "#f8fafc", text: "#0f172a", card: "#ffffff", border: "#e2e8f0" };
  }

  public generateSVGChart(): string {
    const data = Object.entries(this.summary.byAgent).map(([_, d]) => ({ name: d.name, value: d.totalTokens }));
    const max = Math.max(...data.map(d => d.value));
    const barWidth = 40;
    const spacing = 20;
    const chartHeight = 200;
    
    let bars = "";
    data.forEach((d, i) => {
      const h = (d.value / max) * chartHeight;
      const x = i * (barWidth + spacing) + 50;
      const y = chartHeight - h + 50;
      bars += `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="#3b82f6" rx="4" />
        <text x="${x + barWidth/2}" y="${chartHeight + 70}" font-size="10" fill="#94a3b8" text-anchor="middle" transform="rotate(45, ${x + barWidth/2}, ${chartHeight + 70})">${d.name}</text>
      `;
    });

    return `
      <svg width="${this.options.width}" height="${this.options.height}" viewBox="0 0 ${this.options.width} ${this.options.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1e293b" rx="8" />
        <text x="20" y="30" font-family="sans-serif" font-size="16" font-weight="bold" fill="#f8fafc">${this.options.title}</text>
        ${bars}
      </svg>
    `;
  }
}
