"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export type RecentRepository = {
  url: string;
  name?: string;
  fullName?: string;
  score?: number | null;
  grade?: string | null;
  analyzedAt?: string;
};

type RecentRepositoriesProps = {
  repositories: RecentRepository[];
  onSelect?: (repositoryUrl: string) => void;
};

function formatRepositoryName(repository: RecentRepository) {
  if (repository.name) {
    return repository.name;
  }

  if (repository.fullName) {
    return repository.fullName;
  }

  try {
    const url = new URL(repository.url);
    const segments = url.pathname.split("/").filter(Boolean);

    if (segments.length >= 2) {
      return `${segments[0]}/${segments[1].replace(/\.git$/, "")}`;
    }
  } catch {
    return repository.url;
  }

  return repository.url;
}

function formatDate(value?: string) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function RecentRepositories({
  repositories,
  onSelect,
}: RecentRepositoriesProps) {
  if (!repositories?.length) {
    return null;
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        mt : 3
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
          <HistoryIcon color="primary" />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Recent repositories
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Quickly re-run analysis for recently checked repositories.
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridAutoFlow: { xs: "column", md: "row" },
            gridAutoColumns: { xs: "82%", sm: "48%", md: "unset" },
            gridTemplateColumns: { md: "repeat(3, minmax(0, 1fr))" },
            gap: 2,
            overflowX: { xs: "auto", md: "visible" },
            pb: { xs: 1, md: 0 },
            scrollSnapType: { xs: "x mandatory", md: "none" },
            "& > *": {
              scrollSnapAlign: "start",
            },
          }}
        >
          {repositories.slice(0, 6).map((repository) => {
            const repositoryName = formatRepositoryName(repository);

            return (
              <Card
                key={`${repository.url}-${repository.analyzedAt ?? ""}`}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  bgcolor: "action.hover",
                  transition: "transform 160ms ease, border-color 160ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography
                      noWrap
                      title={repositoryName}
                      sx={{ fontWeight: 800 }}
                    >
                      {repositoryName}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {formatDate(repository.analyzedAt)}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      {typeof repository.score === "number" ? (
                        <Chip
                          size="small"
                          label={`${repository.score}/100`}
                          color={
                            repository.score >= 75
                              ? "success"
                              : repository.score >= 50
                                ? "warning"
                                : "error"
                          }
                        />
                      ) : null}

                      <Button
                        size="small"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                        onClick={() => onSelect?.(repository.url)}
                      >
                        Use
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
