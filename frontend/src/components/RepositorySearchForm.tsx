"use client";

import { useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import SearchIcon from "@mui/icons-material/Search";

import { isValidGitHubRepositoryUrl } from "@/utils/githubUrl";

type Props = {
  repositoryUrl: string;
  setRepositoryUrl: (value: string) => void;
  loading: boolean;
  onAnalyze: () => void;
};

export default function RepositorySearchForm({
  repositoryUrl,
  setRepositoryUrl,
  loading,
  onAnalyze,
}: Props) {
  const trimmedUrl = repositoryUrl.trim();

  const { hasValue, isValidUrl } = useMemo(
    () => ({
      hasValue: trimmedUrl.length > 0,
      isValidUrl: trimmedUrl.length === 0 || isValidGitHubRepositoryUrl(trimmedUrl),
    }),
    [trimmedUrl],
  );

  const canAnalyze = hasValue && isValidUrl && !loading;

  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();

        if (canAnalyze) {
          onAnalyze();
        }
      }}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "flex-start" },
        gap: 2,
        p: { xs: 1.5, md: 2 },
        border: "1px solid",
        borderColor: isValidUrl ? "divider" : "error.light",
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
        transition: "border-color 180ms ease, box-shadow 180ms ease",
        "&:focus-within": {
          borderColor: isValidUrl ? "primary.main" : "error.main",
          boxShadow: "0 18px 48px rgba(37, 99, 235, 0.14)",
        },
      }}
    >
      <TextField
        fullWidth
        label="GitHub repository URL"
        placeholder="https://github.com/vercel/next.js"
        value={repositoryUrl}
        onChange={(event) => setRepositoryUrl(event.target.value)}
        error={!isValidUrl}
        disabled={loading}
        helperText={
          isValidUrl
            ? "Paste a public GitHub repository URL, then press Enter or Analyze."
            : "Use a valid GitHub repository URL, for example https://github.com/vercel/next.js"
        }
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <GitHubIcon color={isValidUrl ? "action" : "error"} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ minWidth: { xs: "100%", md: 180 } }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          startIcon={!loading ? <SearchIcon /> : undefined}
          disabled={!canAnalyze}
          sx={{
            minHeight: 56,
            borderRadius: 2,
            fontWeight: 800,
            textTransform: "none",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze"}
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: "none", md: "block" }, mt: 0.75, textAlign: "center" }}
        >
          Press Enter to start
        </Typography>
      </Box>
    </Box>
  );
}