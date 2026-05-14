"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import ConfirmDialog from "@/components/ConfirmDialog";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import EmptyState from "@/components/EmptyState";
import PageLoadingSkeleton from "@/components/PageLoadingSkeleton";
import ProtectedRoute from "@/components/ProtectedRoute";
import SectionHeader from "@/components/SectionHeader";
import {
  deleteScheduledRepositoryAnalysis,
  getScheduledRepositoryAnalyses,
  runScheduledRepositoryAnalysis,
  scheduleRepositoryAnalysis,
} from "@/services/repositoryService";
import type { ScheduledRepositoryAnalysis } from "@/types/repository";
import { validateGitHubRepositoryUrl } from "@/utils/githubUrl";

function formatDate(value?: string | null) {
  if (!value) return "Not run yet";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function scoreColor(score?: number | null) {
  if (score === null || score === undefined) return "primary" as const;
  if (score >= 80) return "success" as const;
  if (score >= 55) return "warning" as const;
  return "error" as const;
}

export default function ScheduledAnalysesPage() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [scheduledAnalyses, setScheduledAnalyses] = useState<ScheduledRepositoryAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState<ScheduledRepositoryAnalysis | null>(null);

  const alertCount = useMemo(
    () => scheduledAnalyses.filter((item) => item.alertTriggered).length,
    [scheduledAnalyses]
  );

  const averageScore = useMemo(() => {
    const scored = scheduledAnalyses.filter((item) => typeof item.lastScore === "number");
    if (scored.length === 0) return 0;
    return Math.round(scored.reduce((sum, item) => sum + (item.lastScore ?? 0), 0) / scored.length);
  }, [scheduledAnalyses]);

  async function loadScheduledAnalyses() {
    try {
      setLoading(true);
      setErrorMessage("");
      const data = await getScheduledRepositoryAnalyses();
      setScheduledAnalyses(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load scheduled analyses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScheduledAnalyses();
  }, []);

  async function handleSchedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateGitHubRepositoryUrl(repositoryUrl);

    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");
      const scheduled = await scheduleRepositoryAnalysis(repositoryUrl.trim());
      setScheduledAnalyses((current) => [
        scheduled,
        ...current.filter((item) => item.id !== scheduled.id),
      ]);
      setRepositoryUrl("");
      setSuccessMessage("Repository added to scheduled analyses.");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to schedule repository analysis.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRun(id: number) {
    try {
      setWorkingId(id);
      setErrorMessage("");
      setSuccessMessage("");
      const updated = await runScheduledRepositoryAnalysis(id);
      setScheduledAnalyses((current) => current.map((item) => (item.id === id ? updated : item)));
      setSuccessMessage("Scheduled analysis ran and saved a new report snapshot.");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to run scheduled analysis.");
    } finally {
      setWorkingId(null);
    }
  }

  async function handleDelete(id: number) {
    try {
      setWorkingId(id);
      setErrorMessage("");
      setSuccessMessage("");
      await deleteScheduledRepositoryAnalysis(id);
      setScheduledAnalyses((current) => current.filter((item) => item.id !== id));
      setSuccessMessage("Scheduled analysis deleted.");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete scheduled analysis.");
    } finally {
      setWorkingId(null);
      setDeleteCandidate(null);
    }
  }

  return (
    <ProtectedRoute>
      <DashboardPageLayout
        title="Scheduled re-analysis"
        subtitle="Track repository quality over time with a cleaner monitoring dashboard and clear score-drop alerts."
        maxWidth="lg"
      >
        <Stack spacing={3}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Tracked repositories</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 950 }}>{scheduledAnalyses.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Average latest score</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 950 }}>{averageScore}/100</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Active alerts</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 950 }}>{alertCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card variant="outlined" sx={{ bgcolor: "rgba(37, 99, 235, 0.04)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 950 }}>
                    Add a repository monitor
                  </Typography>
                  <Typography color="text.secondary">
                    Paste a GitHub URL once, then run it manually or let the backend update it automatically.
                  </Typography>
                </Box>
                <Box component="form" onSubmit={handleSchedule}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="GitHub repository URL"
                      placeholder="https://github.com/vercel/next.js"
                      value={repositoryUrl}
                      onChange={(event) => setRepositoryUrl(event.target.value)}
                      helperText="Supports public GitHub repository URLs."
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{ minWidth: { md: 160 } }}
                    >
                      {submitting ? "Saving..." : "Schedule"}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <SectionHeader
            title="Monitored repositories"
            description="Run checks, review alerts, and remove repositories you no longer want to track."
          />

          {loading ? (
            <PageLoadingSkeleton items={3} />
          ) : scheduledAnalyses.length === 0 ? (
            <EmptyState
              title="No scheduled analyses yet"
              description="Add a repository above to start building trend data and score-drop alerts for your portfolio projects."
            />
          ) : (
            <Grid container spacing={2.5}>
              {scheduledAnalyses.map((item) => {
                const scoreValue = item.lastScore ?? 0;
                const hasScore = item.lastScore !== null && item.lastScore !== undefined;
                const scoreDelta = item.scoreDelta;
                const deltaIsPositive = (scoreDelta ?? 0) >= 0;

                return (
                  <Grid key={item.id} size={{ xs: 12, md: 6 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        borderColor: item.alertTriggered ? "warning.light" : "divider",
                        transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 22px 55px rgba(15, 23, 42, 0.10)",
                          borderColor: item.alertTriggered ? "warning.main" : "primary.light",
                        },
                      }}
                    >
                      {workingId === item.id && <LinearProgress />}
                      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Stack spacing={2.25}>
                          <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="h6" sx={{ fontWeight: 950 }} noWrap>
                                {item.repositoryFullName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {item.repositoryUrl}
                              </Typography>
                            </Box>
                            <Chip
                              label={item.enabled ? "Active" : "Paused"}
                              color={item.enabled ? "success" : "default"}
                              size="small"
                              sx={{ fontWeight: 800 }}
                            />
                          </Stack>

                          <Box>
                            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.75 }}>
                              <Typography variant="body2" sx={{ fontWeight: 800 }}>Latest score</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 900 }}>
                                {hasScore ? `${item.lastScore}/100` : "No run yet"}
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={hasScore ? Math.min(Math.max(scoreValue, 0), 100) : 0}
                              color={scoreColor(item.lastScore)}
                              sx={{ height: 9, borderRadius: 999 }}
                            />
                          </Box>

                          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                            <Chip
                              icon={<ScheduleIcon />}
                              label={`Last run: ${formatDate(item.lastRunAt)}`}
                              variant="outlined"
                              size="small"
                            />
                            {item.lastGrade && <Chip label={`Grade ${item.lastGrade}`} variant="outlined" size="small" />}
                            {scoreDelta !== null && scoreDelta !== undefined && (
                              <Chip
                                icon={deltaIsPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                label={`${deltaIsPositive ? "+" : ""}${scoreDelta} change`}
                                color={deltaIsPositive ? "success" : "warning"}
                                variant="outlined"
                                size="small"
                              />
                            )}
                            {item.emailNotificationSentAt && (
                              <Chip
                                icon={<NotificationsActiveIcon />}
                                label={`Email sent ${formatDate(item.emailNotificationSentAt)}`}
                                color="info"
                                variant="outlined"
                                size="small"
                              />
                            )}
                          </Stack>

                          {item.alertTriggered && item.notificationMessage && (
                            <Alert severity="warning">
                              {item.notificationMessage}
                            </Alert>
                          )}
                          {item.lastError && <Alert severity="warning">Last error: {item.lastError}</Alert>}

                          <Divider />

                          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <Button
                              variant="contained"
                              startIcon={<PlayArrowIcon />}
                              onClick={() => handleRun(item.id)}
                              disabled={workingId === item.id}
                            >
                              Run now
                            </Button>
                            <Button
                              color="error"
                              variant="outlined"
                              startIcon={<DeleteOutlineIcon />}
                              onClick={() => setDeleteCandidate(item)}
                              disabled={workingId === item.id}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
        <ConfirmDialog
          open={Boolean(deleteCandidate)}
          title="Delete scheduled analysis?"
          message={`This will stop monitoring ${deleteCandidate?.repositoryFullName ?? "this repository"}. Existing saved reports will remain available.`}
          confirmText="Delete monitor"
          loading={workingId === deleteCandidate?.id}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={() => deleteCandidate && handleDelete(deleteCandidate.id)}
        />
      </DashboardPageLayout>
    </ProtectedRoute>
  );
}
