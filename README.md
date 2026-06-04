# Agent Token Usage Dashboard

Visual dashboard data generator for tracking token consumption across multiple agents and models.

## Features

- **Multi-Agent Tracking**: Aggregate token usage across different agent identities.
- **Model Breakdown**: Compare consumption across various LLM models (GPT-4o, Claude 3.5, etc.).
- **Cost Estimation**: Track estimated operational costs based on token counts.
- **Visual Reports**:
  - Interactive HTML Dashboard (Tailwind-powered)
  - SVG Charts for quick visualization
  - JSON summaries for machine consumption
  - CSV exports for spreadsheets

## Installation

```bash
bun install
```

## Usage

Generate a dashboard from your token usage records:

```bash
bun run src/index.ts usage-records.json -o reports
```

### Options

- `-o, --output <dir>`: Output directory (default: `dist`)
- `-t, --title <title>`: Custom dashboard title
- `--theme <theme>`: UI theme (`light` or `dark`)
- `-v, --verbose`: Enable detailed logging

## Data Format

Input JSON should be an array of records:

```json
[
  {
    "timestamp": "2026-06-01T10:00:00Z",
    "agentId": "researcher-1",
    "agentName": "Research Agent",
    "model": "gpt-4o",
    "promptTokens": 500,
    "completionTokens": 200,
    "totalTokens": 700,
    "costEstimate": 0.0105
  }
]
```

## Architecture

- **Aggregator**: Processes raw event streams into structured summaries.
- **Visualizer**: Generates cross-platform visual assets.
- **Exporter**: Handles multi-format data persistence.

Built by Retsumdk.
