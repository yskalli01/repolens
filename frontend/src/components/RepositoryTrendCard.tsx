import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import type { RepositoryReportTrendPoint } from "@/types/repository";

type Props = {
  title?: string;
  points: RepositoryReportTrendPoint[];
};

function buildPolyline(points: RepositoryReportTrendPoint[]) {
  if (points.length === 0) {
    return "";
  }

  const scores = points.map((point) => point.score);
  const minScore = Math.min(...scores, 0);
  const maxScore = Math.max(...scores, 100);
  const scoreRange = Math.max(1, maxScore - minScore);
  const xStep = points.length === 1 ? 0 : 280 / (points.length - 1);

  return points
    .map((point, index) => {
      const x = 10 + index * xStep;
      const y = 90 - ((point.score - minScore) / scoreRange) * 80;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function RepositoryTrendCard({
  title = "Score trend",
  points,
}: Props) {
  if (points.length === 0) {
    return null;
  }

  const first = points[0];
  const latest = points[points.length - 1];
  const delta = latest.score - first.score;
  const polyline = buildPolyline(points);

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", gap: 1, mb: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {title}
            </Typography>
            <Typography color="text.secondary">
              {points.length} saved snapshot{points.length === 1 ? "" : "s"}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip label={`Latest ${latest.score}/100`} color="primary" />
            <Chip
              label={`${delta >= 0 ? "+" : ""}${delta} overall`}
              color={delta >= 0 ? "success" : "warning"}
              variant="outlined"
            />
          </Stack>
        </Stack>

        <Box
          component="svg"
          viewBox="0 0 300 100"
          role="img"
          aria-label={`${title} chart`}
          sx={{ width: "100%", height: 160, overflow: "visible" }}
        >
          <line x1="10" y1="90" x2="290" y2="90" stroke="currentColor" strokeOpacity="0.2" />
          <line x1="10" y1="10" x2="10" y2="90" stroke="currentColor" strokeOpacity="0.2" />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polyline}
          />
          {points.map((point, index) => {
            const coords = polyline.split(" ")[index]?.split(",") ?? ["10", "90"];
            return (
              <circle
                key={point.id}
                cx={coords[0]}
                cy={coords[1]}
                r="4"
                fill="currentColor"
              />
            );
          })}
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
          {points.slice(-5).map((point) => (
            <Chip
              key={point.id}
              size="small"
              label={`${new Date(point.generatedAt).toLocaleDateString()} · ${point.score}/100`}
              variant="outlined"
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
