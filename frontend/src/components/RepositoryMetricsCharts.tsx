import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";

import type {
  LanguageStat,
  ProjectScore,
  RepositoryComplexity,
} from "@/types/repository";

type Props = {
  score: ProjectScore | null;
  languages: LanguageStat[];
  complexity: RepositoryComplexity | null;
};

function percent(value: number, max: number) {
  if (!Number.isFinite(value) || max <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((value / max) * 100)));
}

export default function RepositoryMetricsCharts({
  score,
  languages,
  complexity,
}: Props) {
  const topLanguages = [...languages]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  const complexityMetrics = complexity
    ? [
        { label: "Source size", value: complexity.estimatedSourceBytes, suffix: " bytes" },
        { label: "Scanned files", value: complexity.scannedFiles, suffix: " files" },
        { label: "Test files", value: complexity.testFiles, suffix: " files" },
        { label: "Docs files", value: complexity.documentationFiles, suffix: " files" },
        { label: "Config files", value: complexity.configurationFiles, suffix: " files" },
      ]
    : [];

  const maxComplexityValue = Math.max(
    1,
    ...complexityMetrics.map((metric) => metric.value)
  );

  if (!score && topLanguages.length === 0 && !complexity) {
    return null;
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Visual metrics
        </Typography>

        {score && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Project score
              </Typography>
              <Typography variant="body2">
                {score.score}/100 · Grade {score.grade}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, score.score))}
              sx={{ height: 10, borderRadius: 999 }}
            />
          </Box>
        )}

        {topLanguages.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Top languages
            </Typography>
            {topLanguages.map((language) => (
              <Box key={language.language} sx={{ mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">{language.language}</Typography>
                  <Typography variant="body2">
                    {language.percentage.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, language.percentage))}
                  sx={{ height: 8, borderRadius: 999 }}
                />
              </Box>
            ))}
          </Box>
        )}

        {complexityMetrics.length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Complexity overview
            </Typography>
            {complexityMetrics.map((metric) => (
              <Box key={metric.label} sx={{ mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">{metric.label}</Typography>
                  <Typography variant="body2">
                    {metric.value.toLocaleString()}{metric.suffix}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percent(metric.value, maxComplexityValue)}
                  sx={{ height: 8, borderRadius: 999 }}
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
