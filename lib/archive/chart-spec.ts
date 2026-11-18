import {
  chartSpec as sharedChartSpec,
  type ChartSeries,
  type ChartSpec,
} from "@seed-archive/ui/chart-spec";

import { CHART_COLORS } from "@/lib/archive/chart-colors";

export type { ChartSeries, ChartSpec };

// The shared chart spec in the site's colours: one colour for one thing.
export function chartSpec(input: Parameters<typeof sharedChartSpec>[0]) {
  return sharedChartSpec(input, CHART_COLORS);
}
