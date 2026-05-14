"use client";

import {
  Box,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import RadarIcon from "@mui/icons-material/Radar";
import type {
  LanguageStat,
  ProjectScore,
  ReadmeAnalysis,
  RepositoryAnalysis,
  RepositoryComplexity,
  RepositoryQualitySignals,
} from "@/types/repository";

type RepositoryAnalyticsVisualsProps = {
  repository?: RepositoryAnalysis;
  score?: number | ProjectScore | null;
  languages?: LanguageStat[] | Record<string, number> | null;
  readme?: ReadmeAnalysis | null;
  qualitySignals?: RepositoryQualitySignals | Record<string, boolean> | null;
  complexity?:
    | RepositoryComplexity
    | Record<string, number | string | boolean | string[] | null | undefined>
    | null;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function normalizeScore(score?: number | ProjectScore | null) {
  if (typeof score === "number") {
    return score;
  }

  return score?.score ?? 0;
}

function normalizeLanguageEntries(
  languages?: LanguageStat[] | Record<string, number> | null,
) {
  if (!languages) {
    return [];
  }

  if (Array.isArray(languages)) {
    return languages
      .map((language) => ({
        name: language.language,
        value: language.bytes,
        percentage: Math.round(language.percentage),
      }))
      .filter((language) => language.name && language.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }

  const total = Object.values(languages).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );

  if (!total) {
    return [];
  }

  return Object.entries(languages)
    .map(([name, value]) => ({
      name,
      value: Number(value || 0),
      percentage: Math.round((Number(value || 0) / total) * 100),
    }))
    .filter((language) => language.name && language.percentage > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function getBooleanValues(
  qualitySignals?: RepositoryQualitySignals | Record<string, boolean> | null,
) {
  if (!qualitySignals) {
    return [];
  }

  return Object.entries(qualitySignals)
    .filter(([, value]) => typeof value === "boolean")
    .map(([, value]) => value as boolean);
}

function getSignalScore(
  qualitySignals?: RepositoryQualitySignals | Record<string, boolean> | null,
) {
  const values = getBooleanValues(qualitySignals);

  if (!values.length) {
    return 0;
  }

  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

function hasQualitySignal(
  qualitySignals: RepositoryAnalyticsVisualsProps["qualitySignals"],
  keys: string[],
) {
  return keys.some((key) =>
    Boolean(qualitySignals?.[key as keyof typeof qualitySignals]),
  );
}

function getComplexityValue(
  complexity: RepositoryAnalyticsVisualsProps["complexity"],
  keys: string[],
) {
  if (!complexity) {
    return 0;
  }

  for (const key of keys) {
    const value = complexity[key as keyof typeof complexity];

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);

      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

function getComplexityScore(
  complexity?: RepositoryAnalyticsVisualsProps["complexity"],
) {
  if (!complexity) {
    return 65;
  }

  const fileCount = getComplexityValue(complexity, [
    "scannedFiles",
    "fileCount",
    "files",
  ]);
  const directoryCount = getComplexityValue(complexity, [
    "scannedDirectories",
    "directoryCount",
    "directories",
  ]);
  const testFiles = getComplexityValue(complexity, ["testFiles"]);
  const documentationFiles = getComplexityValue(complexity, [
    "documentationFiles",
  ]);
  const configurationFiles = getComplexityValue(complexity, [
    "configurationFiles",
  ]);

  const sizeScore = fileCount ? clamp(100 - fileCount / 8) : 70;
  const structureScore = directoryCount ? clamp(55 + directoryCount * 3) : 55;
  const maintainabilityScore = fileCount
    ? clamp(
        ((testFiles + documentationFiles + configurationFiles) / fileCount) *
          500,
      )
    : 65;

  return Math.round((sizeScore + structureScore + maintainabilityScore) / 3);
}

function buildRadarPoints(values: number[]) {
  const center = 74;
  const radius = 54;
  const angleStep = (Math.PI * 2) / values.length;

  return values
    .map((value, index) => {
      const angle = -Math.PI / 2 + index * angleStep;
      const distance = (clamp(value) / 100) * radius;

      return `${center + Math.cos(angle) * distance},${
        center + Math.sin(angle) * distance
      }`;
    })
    .join(" ");
}

function buildGridPolygon(scale: number, count: number) {
  const center = 74;
  const radius = 54 * scale;
  const angleStep = (Math.PI * 2) / count;

  return Array.from({ length: count })
    .map((_, index) => {
      const angle = -Math.PI / 2 + index * angleStep;

      return `${center + Math.cos(angle) * radius},${
        center + Math.sin(angle) * radius
      }`;
    })
    .join(" ");
}

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  return (
    <Typography
      variant="h4"
      sx={{
        fontWeight: 900,
        animation: "counterPop 420ms ease",
        "@keyframes counterPop": {
          "0%": {
            transform: "scale(0.96)",
            opacity: 0.55,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
      }}
    >
      {Math.round(value)}
      {suffix}
    </Typography>
  );
}

export default function RepositoryAnalyticsVisuals({
  repository,
  score = 0,
  languages,
  readme,
  qualitySignals,
  complexity,
}: RepositoryAnalyticsVisualsProps) {
  const theme = useTheme();
  const normalizedScore = normalizeScore(score);
  const languageEntries = normalizeLanguageEntries(languages);

  const qualityScore = getSignalScore(qualitySignals);
  const complexityScore = getComplexityScore(complexity);
  const documentationScore = readme?.exists
    ? 90
    : hasQualitySignal(qualitySignals, ["hasReadme", "hasLicenseFile"])
      ? 65
      : 45;
  const automationScore = hasQualitySignal(qualitySignals, [
    "hasCi",
    "hasCiConfig",
  ])
    ? 88
    : hasQualitySignal(qualitySignals, ["hasDocker", "hasDockerSupport"])
      ? 70
      : 40;

  const radarValues = [
    clamp(normalizedScore),
    qualityScore,
    complexityScore,
    documentationScore,
    automationScore,
  ];

  const radarLabels = ["Score", "Quality", "Structure", "Docs", "CI/CD"];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "1.1fr 0.9fr",
          
        },
        gap: 2.5,
        mt:3,
      }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", mb: 2 }}
          >
            <RadarIcon color="primary" />

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Repository health radar
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {repository?.fullName
                  ? `Visual summary for ${repository.fullName}.`
                  : "Visual summary of quality, structure, docs, and automation."}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "170px 1fr",
              },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                mx: "auto",
                width: "100%",
                maxWidth: 188,
                aspectRatio: "1 / 1",
              }}
            >
              <svg
                viewBox="0 0 148 148"
                width="100%"
                height="100%"
                role="img"
                aria-label="Repository health radar chart"
              >
                {[0.33, 0.66, 1].map((scale) => (
                  <polygon
                    key={scale}
                    points={buildGridPolygon(scale, radarValues.length)}
                    fill="none"
                    stroke={theme.palette.divider}
                    strokeWidth="1"
                  />
                ))}

                {radarValues.map((_, index) => {
                  const angle =
                    -Math.PI / 2 + index * ((Math.PI * 2) / radarValues.length);

                  return (
                    <line
                      key={radarLabels[index]}
                      x1="74"
                      y1="74"
                      x2={74 + Math.cos(angle) * 54}
                      y2={74 + Math.sin(angle) * 54}
                      stroke={theme.palette.divider}
                      strokeWidth="1"
                    />
                  );
                })}

                <polygon
                  points={buildRadarPoints(radarValues)}
                  fill={theme.palette.primary.main}
                  fillOpacity="0.2"
                  stroke={theme.palette.primary.main}
                  strokeWidth="3"
                />
              </svg>
            </Box>

            <Stack spacing={1.5}>
              {radarLabels.map((label, index) => (
                <Box key={label}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", mb: 0.5 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {label}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {Math.round(radarValues[index])}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={clamp(radarValues[index])}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      bgcolor: "action.hover",
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", mb: 2 }}
          >
            <DonutLargeIcon color="secondary" />

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Language distribution
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Main technologies detected in the repository.
              </Typography>
            </Box>
          </Stack>

          {languageEntries.length ? (
            <Stack spacing={1.5} sx={{ minWidth: 0 }}>
              {languageEntries.map((language) => (
                <Box key={language.name}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", mb: 0.5 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {language.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {language.percentage}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={language.percentage}
                    sx={{
                      height: 9,
                      borderRadius: 999,
                      bgcolor: "action.hover",
                    }}
                  />
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary" variant="body2">
              Analyze a repository to display language distribution.
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              minWidth: 0,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Overall score
              </Typography>

              <AnimatedCounter value={normalizedScore} suffix="/100" />
            </Box>

            <AutoGraphIcon
              color="primary"
              sx={{
                fontSize: 44,
                opacity: 0.8,
                animation: "floatIcon 2.8s ease-in-out infinite",
                "@keyframes floatIcon": {
                  "0%, 100%": {
                    transform: "translateY(0)",
                  },
                  "50%": {
                    transform: "translateY(-5px)",
                  },
                },
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
