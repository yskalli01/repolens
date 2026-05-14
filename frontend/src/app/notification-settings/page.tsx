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
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import DashboardPageLayout from "@/components/DashboardPageLayout";
import PageLoadingSkeleton from "@/components/PageLoadingSkeleton";
import ProtectedRoute from "@/components/ProtectedRoute";
import SectionHeader from "@/components/SectionHeader";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/services/repositoryService";
import type { NotificationSettings } from "@/types/repository";

function thresholdLabel(value: number) {
  if (value <= 5) return "Very sensitive";
  if (value <= 15) return "Balanced";
  if (value <= 30) return "Important drops only";
  return "Critical drops only";
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [scoreDropNotificationThreshold, setScoreDropNotificationThreshold] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasChanges = useMemo(() => {
    if (!settings) return false;
    return (
      Boolean(settings.emailNotificationsEnabled) !== emailNotificationsEnabled ||
      (settings.scoreDropNotificationThreshold ?? 10) !== scoreDropNotificationThreshold
    );
  }, [emailNotificationsEnabled, scoreDropNotificationThreshold, settings]);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError("");

    try {
      const data = await getNotificationSettings();
      setSettings(data);
      setEmailNotificationsEnabled(Boolean(data.emailNotificationsEnabled));
      setScoreDropNotificationThreshold(data.scoreDropNotificationThreshold ?? 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notification settings");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    if (scoreDropNotificationThreshold < 1 || scoreDropNotificationThreshold > 100) {
      setError("Score drop threshold must be between 1 and 100.");
      setSaving(false);
      return;
    }

    try {
      const updated = await updateNotificationSettings({
        emailNotificationsEnabled,
        scoreDropNotificationThreshold,
      });
      setSettings(updated);
      setSuccess("Notification settings saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save notification settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <DashboardPageLayout
        title="Notification settings"
        subtitle="Control when scheduled repository checks should alert you about quality regressions."
        maxWidth="lg"
      >
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          {loading ? (
            <PageLoadingSkeleton items={3} />
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <NotificationsActiveRoundedIcon color="primary" />
                        <Typography color="text.secondary" variant="body2">Email alerts</Typography>
                        <Chip
                          label={emailNotificationsEnabled ? "Enabled" : "Disabled"}
                          color={emailNotificationsEnabled ? "success" : "default"}
                          sx={{ alignSelf: "flex-start" }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <TuneRoundedIcon color="primary" />
                        <Typography color="text.secondary" variant="body2">Drop threshold</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 950 }}>
                          {scoreDropNotificationThreshold} pts
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <EmailRoundedIcon color="primary" />
                        <Typography color="text.secondary" variant="body2">Recipient</Typography>
                        <Typography sx={{ fontWeight: 900 }} noWrap>
                          {settings?.recipientEmail ?? "Your account email"}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card variant="outlined">
                {saving && <LinearProgress />}
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <Stack spacing={3}>
                    <SectionHeader
                      title="Score-drop email alerts"
                      description="Choose how sensitive the application should be when scheduled analyses detect a lower repository score."
                    />

                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 4,
                        bgcolor: emailNotificationsEnabled ? "primary.50" : "action.hover",
                        border: "1px solid",
                        borderColor: emailNotificationsEnabled ? "primary.light" : "divider",
                      }}
                    >
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
                        <Box>
                          <Typography sx={{ fontWeight: 900 }}>Send score-drop emails</Typography>
                          <Typography color="text.secondary" variant="body2">
                            Recommended for portfolio repositories you want to keep CV-ready.
                          </Typography>
                        </Box>
                        <Switch
                          checked={emailNotificationsEnabled}
                          onChange={(event) => setEmailNotificationsEnabled(event.target.checked)}
                        />
                      </Stack>
                    </Box>

                    <Box>
                      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography sx={{ fontWeight: 900 }}>Alert threshold</Typography>
                        <Chip label={thresholdLabel(scoreDropNotificationThreshold)} color="primary" variant="outlined" />
                      </Stack>
                      <Slider
                        value={scoreDropNotificationThreshold}
                        onChange={(_, value) => setScoreDropNotificationThreshold(value as number)}
                        min={1}
                        max={50}
                        valueLabelDisplay="auto"
                        disabled={!emailNotificationsEnabled}
                      />
                      <Typography color="text.secondary" variant="body2">
                        Example: {scoreDropNotificationThreshold} means an email is sent only when a repository score drops by {scoreDropNotificationThreshold} points or more.
                      </Typography>
                    </Box>

                    <Divider />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}>
                      <Typography color="text.secondary" variant="body2">
                        {hasChanges ? "You have unsaved changes." : "Your notification preferences are up to date."}
                      </Typography>
                      <Button variant="contained" onClick={handleSave} disabled={saving || !hasChanges}>
                        {saving ? "Saving..." : "Save settings"}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </>
          )}
        </Stack>
      </DashboardPageLayout>
    </ProtectedRoute>
  );
}
