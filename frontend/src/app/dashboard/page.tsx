"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Snackbar,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  CircularProgress,
  Slide,
} from "@mui/material";

import {
  analyzeRepositoryFull,
  compareRepositories,
  downloadRepositoryPdfReport,
  getRepositoryComparisonHistory,
  getRepositoryComplexity,
  getRepositoryReport,
  saveRepositoryReport,
} from "@/services/repositoryService";

import {
  Branch,
  Contributor,
  LanguageStat,
  ProjectScore,
  ReadmeAnalysis,
  RepositoryAnalysis,
  RepositoryQualitySignals,
  TechDetection,
  RepositoryComparison,
  RepositoryComparisonHistory,
  RepositoryComplexity,
} from "@/types/repository";

import RepositorySearchForm from "@/components/RepositorySearchForm";
import RepositorySummaryCard from "@/components/RepositorySummaryCard";
import RepositoryLanguagesCard from "@/components/RepositoryLanguagesCard";
import RepositoryAnalysisSkeleton from "@/components/RepositoryAnalysisSkeleton";
import RepositoryContributorsCard from "@/components/RepositoryContributorsCard";
import RepositoryBranchesCard from "@/components/RepositoryBranchesCard";
import RepositoryReadmeCard from "@/components/RepositoryReadmeCard";
import RepositoryTechnologiesCard from "@/components/RepositoryTechnologiesCard";
import RepositoryScoreCard from "@/components/RepositoryScoreCard";
import RepositoryQualitySignalsCard from "@/components/RepositoryQualitySignalsCard";
import RepositoryComparisonCard from "@/components/RepositoryComparisonCard";
import RepositoryComparisonHistoryCard from "@/components/RepositoryComparisonHistoryCard";
import RepositoryComplexityCard from "@/components/RepositoryComplexityCard";
import RepositoryMetricsCharts from "@/components/RepositoryMetricsCharts";
import RepositoryAnalyticsVisuals from "@/components/RepositoryAnalyticsVisuals";
import CommandPalette from "@/components/CommandPalette";
import RecentRepositories, {
  type RecentRepository,
} from "@/components/RecentRepositories";
import AnimatedContainer from "@/components/AnimatedContainer";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import EmptyState from "@/components/EmptyState";
import SectionHeader from "@/components/SectionHeader";
import { isValidGitHubRepositoryUrl } from "@/utils/githubUrl";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [readme, setReadme] = useState<ReadmeAnalysis | null>(null);
  const [technologies, setTechnologies] = useState<TechDetection | null>(null);
  const [projectScore, setProjectScore] = useState<ProjectScore | null>(null);
  const [qualitySignals, setQualitySignals] =
    useState<RepositoryQualitySignals | null>(null);
  const [comparisonUrls, setComparisonUrls] = useState(["", ""]);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparison, setComparison] = useState<RepositoryComparison | null>(
    null,
  );
  const [comparisonHistory, setComparisonHistory] = useState<
    RepositoryComparisonHistory[]
  >([]);
  const [complexity, setComplexity] = useState<RepositoryComplexity | null>(
    null,
  );
  const [reportLoading, setReportLoading] = useState(false);
  const [pdfReportLoading, setPdfReportLoading] = useState(false);
  const [saveReportLoading, setSaveReportLoading] = useState(false);
  const [recentRepositories, setRecentRepositories] = useState<
    RecentRepository[]
  >([]);

  const [activeTab, setActiveTab] = useState(0);
  const filledComparisonUrls = comparisonUrls
    .map((url) => url.trim())
    .filter(Boolean);
  const comparisonUrlsAreValid = filledComparisonUrls.every(
    isValidGitHubRepositoryUrl,
  );

  const [repository, setRepository] = useState<RepositoryAnalysis | null>(null);

  const [languages, setLanguages] = useState<LanguageStat[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        "github-analyzer-recent-repositories",
      );
      if (saved) {
        setRecentRepositories(JSON.parse(saved));
      }
    } catch {
      setRecentRepositories([]);
    }
  }, []);

  const commandActions = useMemo(
    () => [
      {
        label: "Analyze repository",
        description: "Run a full analysis for the URL in the input.",
        shortcut: "Enter",
        disabled: loading || !isValidGitHubRepositoryUrl(repositoryUrl),
        action: handleAnalyze,
      },
      {
        label: "Compare repositories",
        description: "Compare the two repository URLs currently entered.",
        shortcut: "C",
        disabled:
          comparisonLoading ||
          filledComparisonUrls.length < 2 ||
          !comparisonUrlsAreValid,
        action: handleCompare,
      },
      {
        label: "Download Markdown report",
        description: "Export the current analysis as a Markdown report.",
        disabled: !repository || reportLoading,
        action: handleDownloadReport,
      },
      {
        label: "Download PDF report",
        description: "Export the current analysis as a PDF report.",
        disabled: !repository || pdfReportLoading,
        action: handleDownloadPdfReport,
      },
      {
        label: "Save report",
        description: "Save this analysis to your reports history.",
        disabled: !repository || saveReportLoading,
        action: handleSaveReport,
      },
      {
        label: "Open reports",
        description: "Go to saved reports.",
        action: () => window.location.assign("/reports"),
      },
      {
        label: "Open scheduled analyses",
        description: "Go to scheduled repository analysis jobs.",
        action: () => window.location.assign("/scheduled"),
      },
    ],
    [
      comparisonLoading,
      comparisonUrlsAreValid,
      filledComparisonUrls.length,
      loading,
      pdfReportLoading,
      reportLoading,
      repository,
      repositoryUrl,
      saveReportLoading,
    ],
  );

  function rememberRepository(
    data: RepositoryAnalysis,
    score: ProjectScore | null,
  ) {
    const nextRepository: RecentRepository = {
      fullName: data.fullName,
      url: data.url,
      score: score?.score ?? null,
      grade: score?.grade ?? null,
      analyzedAt: new Date().toISOString(),
    };

    setRecentRepositories((current) => {
      const next = [
        nextRepository,
        ...current.filter((item) => item.url !== data.url),
      ].slice(0, 8);
      window.localStorage.setItem(
        "github-analyzer-recent-repositories",
        JSON.stringify(next),
      );
      return next;
    });
  }

  function handleRecentRepositorySelect(url: string) {
    setRepositoryUrl(url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleCompare() {
    try {
      setComparisonLoading(true);
      setComparison(null);
      setErrorMessage("");
      setSuccessMessage("");

      const urls = comparisonUrls.map((url) => url.trim()).filter(Boolean);

      if (urls.length < 2 || !urls.every(isValidGitHubRepositoryUrl)) {
        setErrorMessage(
          "Add at least two valid GitHub repository URLs before comparing.",
        );
        return;
      }

      const data = await compareRepositories(urls);

      setComparison(data);
      const history = await getRepositoryComparisonHistory();
      setComparisonHistory(history);
      setSuccessMessage("Repositories compared successfully.");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to compare repositories. Please check the URLs and try again.",
      );
    } finally {
      setComparisonLoading(false);
    }
  }

  async function handleAnalyze() {
    try {
      setLoading(true);
      setRepository(null);
      setLanguages([]);
      setContributors([]);
      setBranches([]);
      setReadme(null);
      setTechnologies(null);
      setProjectScore(null);
      setQualitySignals(null);
      setComplexity(null);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await analyzeRepositoryFull(repositoryUrl);

      setRepository(data.repository);
      setLanguages(data.languages);
      setContributors(data.contributors);
      setBranches(data.branches);
      setReadme(data.readme);
      setTechnologies(data.technologies);
      setQualitySignals(data.qualitySignals);
      setProjectScore(data.score);
      rememberRepository(data.repository, data.score);

      const repoPath = getOwnerAndRepo(data.repository.url);
      if (repoPath) {
        const complexityData = await getRepositoryComplexity(
          repoPath.owner,
          repoPath.repo,
        );
        setComplexity(complexityData);
      }

      setSuccessMessage("Repository analyzed successfully.");
      setActiveTab(0);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to analyze repository. Please check the URL and try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  function getOwnerAndRepo(url: string) {
    try {
      const parsed = new URL(url);
      const [owner, repo] = parsed.pathname.replace(/^\//, "").split("/");

      if (!owner || !repo) {
        return null;
      }

      return { owner, repo };
    } catch {
      return null;
    }
  }

  async function handleDownloadReport() {
    if (!repository) {
      return;
    }

    const repoPath = getOwnerAndRepo(repository.url);

    if (!repoPath) {
      setErrorMessage("Could not generate report for this repository URL.");
      return;
    }

    try {
      setReportLoading(true);
      const report = await getRepositoryReport(repoPath.owner, repoPath.repo);
      const blob = new Blob([report.markdown], { type: "text/markdown" });
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `${repoPath.owner}-${repoPath.repo}-analysis-report.md`;
      anchor.click();
      URL.revokeObjectURL(downloadUrl);
      setSuccessMessage("Markdown report generated successfully.");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to generate repository report.",
      );
    } finally {
      setReportLoading(false);
    }
  }

  async function handleDownloadPdfReport() {
    if (!repository) {
      return;
    }

    const repoPath = getOwnerAndRepo(repository.url);

    if (!repoPath) {
      setErrorMessage("Could not generate PDF report for this repository URL.");
      return;
    }

    try {
      setPdfReportLoading(true);
      const blob = await downloadRepositoryPdfReport(
        repoPath.owner,
        repoPath.repo,
      );
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `${repoPath.owner}-${repoPath.repo}-analysis-report.pdf`;
      anchor.click();
      URL.revokeObjectURL(downloadUrl);
      setSuccessMessage("PDF report generated successfully.");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to generate PDF repository report.",
      );
    } finally {
      setPdfReportLoading(false);
    }
  }

  async function handleSaveReport() {
    if (!repository) {
      return;
    }

    const repoPath = getOwnerAndRepo(repository.url);

    if (!repoPath) {
      setErrorMessage("Could not save report for this repository URL.");
      return;
    }

    try {
      setSaveReportLoading(true);
      await saveRepositoryReport(repoPath.owner, repoPath.repo);
      setSuccessMessage("Report saved to your account history.");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save repository report.",
      );
    } finally {
      setSaveReportLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <CommandPalette actions={commandActions} />
      <DashboardPageLayout
        title="RepoLens"
        eyebrow="Repository intelligence"
        subtitle="Analyze quality, compare repositories, and export recruiter-ready reports from one clean workspace."
        maxWidth="lg"
      >
        <AnimatedContainer>
          <RepositorySearchForm
            repositoryUrl={repositoryUrl}
            setRepositoryUrl={setRepositoryUrl}
            loading={loading}
            onAnalyze={handleAnalyze}
          />
        </AnimatedContainer>

        <AnimatedContainer delay={60}>
          <RecentRepositories
            repositories={recentRepositories}
            onSelect={handleRecentRepositorySelect}
          />
        </AnimatedContainer>

        {repository && (
          <AnimatedContainer delay={80}>
            <Card
              variant="outlined"
              sx={{ mt: 3, bgcolor: "rgba(37, 99, 235, 0.035)" }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: 900, mr: { xs: 0, md: "auto" } }}>
                  Export or save this analysis
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleDownloadReport}
                  disabled={reportLoading}
                >
                  {reportLoading ? "Generating Markdown..." : "Markdown"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleDownloadPdfReport}
                  disabled={pdfReportLoading}
                >
                  {pdfReportLoading ? "Generating PDF..." : "PDF"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSaveReport}
                  disabled={saveReportLoading}
                >
                  {saveReportLoading ? "Saving..." : "Save Report"}
                </Button>
                <Button variant="text" href="/reports">
                  Saved Reports
                </Button>
              </CardContent>
            </Card>
          </AnimatedContainer>
        )}

        <AnimatedContainer delay={120}>
          <Card variant="outlined" sx={{ mt: 4 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <SectionHeader
                title="Compare repositories"
                description="Paste two public GitHub repositories to rank them side by side."
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr auto" },
                  gap: 2,
                }}
              >
                {comparisonUrls.map((value, index) => {
                  const hasValue = value.trim().length > 0;
                  const isValid =
                    !hasValue || isValidGitHubRepositoryUrl(value);

                  return (
                    <TextField
                      key={index}
                      fullWidth
                      label={`Repository ${index + 1}`}
                      placeholder="https://github.com/owner/repo"
                      value={value}
                      error={!isValid}
                      helperText={
                        isValid ? " " : "Enter a valid GitHub repository URL."
                      }
                      onChange={(event) => {
                        const nextUrls = [...comparisonUrls];
                        nextUrls[index] = event.target.value;
                        setComparisonUrls(nextUrls);
                      }}
                    />
                  );
                })}

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleCompare}
                  disabled={
                    comparisonLoading ||
                    filledComparisonUrls.length < 2 ||
                    !comparisonUrlsAreValid
                  }
                  sx={{ minWidth: 160, height: 56 }}
                >
                  {comparisonLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Compare"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </AnimatedContainer>

        {comparison && (
          <AnimatedContainer delay={160}>
            <RepositoryComparisonCard comparison={comparison} />
          </AnimatedContainer>
        )}
        <RepositoryComparisonHistoryCard history={comparisonHistory} />

        {!loading && !repository && !comparison && (
          <EmptyState
            title="Start with a repository URL"
            description="Analyze a project to see score, technologies, README quality, contributors, complexity, and export actions."
          />
        )}

        {repository && (
          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              allowScrollButtonsMobile
            >
              <Tab label="Overview" />
              <Tab label="Technical details" />
            </Tabs>
          </Box>
        )}

        {loading && <RepositoryAnalysisSkeleton />}

        {repository && activeTab === 0 && (
          <>
            <AnimatedContainer delay={60}>
              <RepositorySummaryCard repository={repository} />
            </AnimatedContainer>

            {projectScore && (
              <AnimatedContainer delay={100}>
                <RepositoryScoreCard score={projectScore} />
              </AnimatedContainer>
            )}

            <AnimatedContainer delay={140}>
              <RepositoryMetricsCharts
                score={projectScore}
                languages={languages}
                complexity={complexity}
              />
            </AnimatedContainer>

            <AnimatedContainer delay={165}>
              <RepositoryAnalyticsVisuals
                repository={repository}
                score={projectScore}
                languages={languages}
                readme={readme}
                qualitySignals={qualitySignals}
                complexity={complexity}
              />
            </AnimatedContainer>

            {languages.length > 0 && (
              <AnimatedContainer delay={180}>
                <RepositoryLanguagesCard languages={languages} />
              </AnimatedContainer>
            )}
          </>
        )}

        {repository && activeTab === 1 && (
          <>
            {technologies && (
              <RepositoryTechnologiesCard technologies={technologies} />
            )}

            {qualitySignals && (
              <RepositoryQualitySignalsCard qualitySignals={qualitySignals} />
            )}

            {complexity && <RepositoryComplexityCard complexity={complexity} />}

            {contributors.length > 0 && (
              <RepositoryContributorsCard contributors={contributors} />
            )}

            {branches.length > 0 && (
              <RepositoryBranchesCard branches={branches} />
            )}

            {readme && <RepositoryReadmeCard readme={readme} />}
          </>
        )}

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={5000}
          onClose={() => setErrorMessage("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          slots={{ transition: Slide }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setErrorMessage("")}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          slots={{ transition: Slide }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setSuccessMessage("")}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </DashboardPageLayout>
    </ProtectedRoute>
  );
}
