"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Snackbar,
  Typography,
} from "@mui/material";

import ConfirmDialog from "@/components/ConfirmDialog";

import ProtectedRoute from "@/components/ProtectedRoute";
import RepositoryHistoryCard from "@/components/RepositoryHistoryCard";

import {
  deleteRepositoryHistoryItem,
  getRepositoryHistory,
} from "@/services/repositoryService";

import { RepositoryAnalysisHistory } from "@/types/repository";

import DashboardPageLayout from "@/components/DashboardPageLayout";


export default function HistoryPage() {
  const [history, setHistory] = useState<RepositoryAnalysisHistory[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  async function loadHistory() {
    try {
      const data = await getRepositoryHistory();
      setHistory(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load history.");
    }
  }

  async function handleDeleteHistoryItem(id: number) {
    try {
      await deleteRepositoryHistoryItem(id);
      await loadHistory();
      setSuccessMessage("History item deleted.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete history item.");
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardPageLayout
            title="Analysis History"
            subtitle="View your latest repository analyses."
        >
            <RepositoryHistoryCard
            history={history}
            onDelete={(id) => setSelectedHistoryId(id)}
            />

            <ConfirmDialog
            open={selectedHistoryId !== null}
            title="Delete history item?"
            message="This action will remove this repository analysis from your history."
            confirmText="Delete"
            onClose={() => setSelectedHistoryId(null)}
            onConfirm={async () => {
                if (!selectedHistoryId) return;

                await handleDeleteHistoryItem(selectedHistoryId);
                setSelectedHistoryId(null);
            }}
            />
        </DashboardPageLayout>

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={4000}
          onClose={() => setErrorMessage("")}
        >
          <Alert severity="error" variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert severity="success" variant="filled">
            {successMessage}
          </Alert>
        </Snackbar>
    </ProtectedRoute>
  );
}