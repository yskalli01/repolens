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
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import InsightsIcon from "@mui/icons-material/Insights";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import ConfirmDialog from "@/components/ConfirmDialog";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import EmptyState from "@/components/EmptyState";
import PageLoadingSkeleton from "@/components/PageLoadingSkeleton";
import ProtectedRoute from "@/components/ProtectedRoute";
import RepositoryTrendCard from "@/components/RepositoryTrendCard";
import SectionHeader from "@/components/SectionHeader";
import {
  deleteSavedRepositoryReport,
  downloadSavedRepositoryReportPdf,
  getSavedRepositoryReports,
  getSavedRepositoryReportTrend,
  refreshSavedRepositoryReportShareLink,
} from "@/services/repositoryService";
import type { RepositoryReportTrendPoint, SavedRepositoryReport } from "@/types/repository";

function downloadMarkdown(report: SavedRepositoryReport) {
  const blob = new Blob([report.markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${report.repositoryFullName.replace("/", "-")}-saved-report.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildShareUrl(shareId: string) {
  return `${window.location.origin}/reports/shared/${shareId}`;
}

async function downloadPdf(report: SavedRepositoryReport) {
  const blob = await downloadSavedRepositoryReportPdf(report.id);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${report.repositoryFullName.replace("/", "-")}-saved-report.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function scoreColor(score: number) {
  if (score >= 80) return "success" as const;
  if (score >= 55) return "warning" as const;
  return "error" as const;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<SavedRepositoryReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingReportId, setWorkingReportId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [trendRepository, setTrendRepository] = useState("");
  const [trendPoints, setTrendPoints] = useState<RepositoryReportTrendPoint[]>([]);
  const [deleteCandidate, setDeleteCandidate] = useState<SavedRepositoryReport | null>(null);

  const averageScore = useMemo(() => {
    if (reports.length === 0) return 0;
    return Math.round(reports.reduce((sum, report) => sum + report.score, 0) / reports.length);
  }, [reports]);

  const shareableReports = useMemo(
    () => reports.filter((report) => Boolean(report.shareId)).length,
    [reports]
  );

  async function loadReports() {
    try {
      setLoading(true);
      setErrorMessage("");
      const data = await getSavedRepositoryReports();
      setReports(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load saved reports.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(reportId: number) {
    try {
      setWorkingReportId(reportId);
      setErrorMessage("");
      setSuccessMessage("");
      await deleteSavedRepositoryReport(reportId);
      setReports((currentReports) => currentReports.filter((report) => report.id !== reportId));
      setSuccessMessage("Saved report deleted.");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete saved report.");
    } finally {
      setWorkingReportId(null);
      setDeleteCandidate(null);
    }
  }

  async function handleDownloadPdf(report: SavedRepositoryReport) {
    try {
      setWorkingReportId(report.id);
      setErrorMessage("");
      setSuccessMessage("");
      await downloadPdf(report);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to download saved PDF report.");
    } finally {
      setWorkingReportId(null);
    }
  }

  async function handleLoadTrend(repositoryFullName: string) {
    try {
      setWorkingReportId(null);
      setErrorMessage("");
      setSuccessMessage("");
      setTrendRepository(repositoryFullName);
      const data = await getSavedRepositoryReportTrend(repositoryFullName);
      setTrendPoints(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load report trend.");
    }
  }

  async function handleCopyShareLink(report: SavedRepositoryReport) {
    try {
      setWorkingReportId(report.id);
      setErrorMessage("");
      setSuccessMessage("");

      const reportWithShareId = report.shareId
        ? report
        : await refreshSavedRepositoryReportShareLink(report.id);

      if (!reportWithShareId.shareId) {
        throw new Error("The report share link was not returned by the server.");
      }

      setReports((currentReports) =>
        currentReports.map((item) =>
          item.id === report.id ? { ...item, shareId: reportWithShareId.shareId } : item
        )
      );

      await navigator.clipboard.writeText(buildShareUrl(reportWithShareId.shareId));
      setSuccessMessage("Share link copied to clipboard.");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to create share link.");
    } finally {
      setWorkingReportId(null);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardPageLayout
        title="Saved reports"
        subtitle="Manage recruiter-ready repository snapshots with clearer actions, trends, and export options."
        maxWidth="lg"
      >
        <Stack spacing={3}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Saved reports</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 950 }}>{reports.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Average score</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 950 }}>{averageScore}/100</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Share links</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 950 }}>{shareableReports}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {trendPoints.length > 0 && (
            <RepositoryTrendCard title={`${trendRepository} score trend`} points={trendPoints} />
          )}

          <SectionHeader
            title="Report library"
            description="Download reports, copy share links, open trends, or clean up old snapshots."
          />

          {loading ? (
            <PageLoadingSkeleton items={3} />
          ) : reports.length === 0 ? (
            <EmptyState
              title="No saved reports yet"
              description="Analyze a repository from the dashboard and save a report to build a portfolio-ready analysis history."
              actionLabel="Analyze a repository"
              actionHref="/dashboard"
            />
          ) : (
            <Grid container spacing={2.5}>
              {reports.map((report) => (
                <Grid key={report.id} size={{ xs: 12, md: 6 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 22px 55px rgba(15, 23, 42, 0.10)",
                        borderColor: "primary.light",
                      },
                    }}
                  >
                    {workingReportId === report.id && <LinearProgress />}
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Stack spacing={2.25}>
                        <Box>
                          <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="h6" sx={{ fontWeight: 950 }} noWrap>
                                {report.repositoryFullName}
                              </Typography>
                              <Typography color="text.secondary" variant="body2" noWrap>
                                {report.repositoryUrl}
                              </Typography>
                            </Box>
                            <Chip
                              label={report.grade}
                              color={scoreColor(report.score)}
                              sx={{ fontWeight: 900 }}
                            />
                          </Stack>
                        </Box>

                        <Box>
                          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.75 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>Score</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 900 }}>{report.score}/100</Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(Math.max(report.score, 0), 100)}
                            color={scoreColor(report.score)}
                            sx={{ height: 9, borderRadius: 999 }}
                          />
                        </Box>

                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                          <Chip label={formatDate(report.generatedAt)} variant="outlined" size="small" />
                          {typeof report.scoreDeltaFromPrevious === "number" && (
                            <Chip
                              label={`${report.scoreDeltaFromPrevious >= 0 ? "+" : ""}${report.scoreDeltaFromPrevious} since previous`}
                              color={report.scoreDeltaFromPrevious >= 0 ? "success" : "warning"}
                              variant="outlined"
                              size="small"
                            />
                          )}
                          {report.shareId && <Chip label="Shareable" color="success" size="small" />}
                        </Stack>

                        <Divider />

                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                          <Button
                            startIcon={<DownloadIcon />}
                            variant="contained"
                            onClick={() => downloadMarkdown(report)}
                          >
                            Markdown
                          </Button>
                          <Button
                            startIcon={<PictureAsPdfIcon />}
                            variant="outlined"
                            onClick={() => handleDownloadPdf(report)}
                            disabled={workingReportId === report.id}
                          >
                            PDF
                          </Button>
                          <Button
                            startIcon={<InsightsIcon />}
                            variant="outlined"
                            onClick={() => handleLoadTrend(report.repositoryFullName)}
                          >
                            Trend
                          </Button>
                          <Tooltip title="Copy share link">
                            <span>
                              <IconButton
                                color="primary"
                                onClick={() => handleCopyShareLink(report)}
                                disabled={workingReportId === report.id}
                              >
                                <LinkIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Open on GitHub">
                            <IconButton component="a" href={report.repositoryUrl} target="_blank" rel="noreferrer">
                              <OpenInNewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete report">
                            <span>
                              <IconButton
                                color="error"
                                onClick={() => setDeleteCandidate(report)}
                                disabled={workingReportId === report.id}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
        <ConfirmDialog
          open={Boolean(deleteCandidate)}
          title="Delete saved report?"
          message={`This will permanently remove the saved report for ${deleteCandidate?.repositoryFullName ?? "this repository"}. You can still analyze the repository again later.`}
          confirmText="Delete report"
          loading={workingReportId === deleteCandidate?.id}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={() => deleteCandidate && handleDelete(deleteCandidate.id)}
        />
      </DashboardPageLayout>
    </ProtectedRoute>
  );
}
