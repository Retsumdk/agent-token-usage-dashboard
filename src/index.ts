#!/usr/bin/env bun
/**
 * agent-token-usage-dashboard - Visual dashboard data generator for tracking token consumption across multiple agents and models
 * Built by Retsumdk
 */

import { Command } from "commander";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { TokenUsageAggregator } from "./core/aggregator";
import { TokenUsageVisualizer } from "./core/visualizer";
import { TokenUsageExporter } from "./core/exporter";
import { Logger, LogLevel } from "./utils/logger";
import { TokenUsageRecord } from "./core/types";

async function main() {
  const program = new Command();
  const logger = new Logger(LogLevel.INFO);

  program
    .name("agent-token-usage-dashboard")
    .description("Visual dashboard data generator for tracking token consumption across multiple agents and models")
    .version("1.0.0")
    .argument("<input>", "Input JSON file containing token usage records")
    .option("-o, --output <dir>", "Output directory for generated reports", "dist")
    .option("-t, --title <title>", "Dashboard title", "Agent Token Usage Dashboard")
    .option("--theme <theme>", "Theme (light/dark)", "dark")
    .option("-v, --verbose", "Enable verbose logging")
    .action(async (input, options) => {
      if (options.verbose) {
        (logger as any).level = LogLevel.DEBUG;
      }

      logger.info(`Starting dashboard generation for: ${input}`);

      if (!existsSync(input)) {
        logger.error(`Input file not found: ${input}`);
        process.exit(1);
      }

      try {
        const rawData = readFileSync(input, "utf-8");
        const records: TokenUsageRecord[] = JSON.parse(rawData);
        
        logger.debug(`Loaded ${records.length} records.`);

        const aggregator = new TokenUsageAggregator(records);
        const summary = aggregator.aggregate();
        
        logger.info(`Summary generated. Total tokens: ${summary.totals.totalTokens.toLocaleString()}`);

        const visualizer = new TokenUsageVisualizer(summary, {
          title: options.title,
          theme: options.theme as any,
        });

        const exporter = new TokenUsageExporter(summary);

        const outDir = options.output;
        if (!existsSync(outDir)) {
          const { mkdirSync } = require("fs");
          mkdirSync(outDir, { recursive: true });
        }

        // Generate reports
        const htmlPath = join(outDir, "dashboard.html");
        writeFileSync(htmlPath, visualizer.generateHTML());
        logger.info(`HTML Dashboard: ${htmlPath}`);

        const svgPath = join(outDir, "chart.svg");
        writeFileSync(svgPath, visualizer.generateSVGChart());
        logger.info(`SVG Chart: ${svgPath}`);

        const jsonPath = join(outDir, "summary.json");
        exporter.exportJSON(jsonPath);
        logger.info(`JSON Summary: ${jsonPath}`);

        const csvPath = join(outDir, "usage.csv");
        exporter.exportCSV(csvPath);
        logger.info(`CSV Export: ${csvPath}`);

        logger.info("Generation complete.");
      } catch (err) {
        logger.error("Failed to generate dashboard", err);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

main().catch(err => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
