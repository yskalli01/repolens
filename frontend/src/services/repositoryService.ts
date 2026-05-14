import type { FullRepositoryAnalysis } from "@/types/repository";

import { getToken } from "./tokenService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function authHeaders(): Record<string, string> {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function parseError(response: Response, fallbackMessage: string) {
  try {
    const data = await response.json();
    return data?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export async function analyzeRepository(repositoryUrl: string) {
  const response = await fetch(`${API_URL}/api/repositories/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ repositoryUrl }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to analyze repository"));
  }

  return response.json();
}


export async function analyzeRepositoryFull(repositoryUrl: string): Promise<FullRepositoryAnalysis> {
  const response = await fetch(`${API_URL}/api/repositories/analyze/full`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ repositoryUrl }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to analyze repository"));
  }

  return response.json();
}

export async function getRepositoryLanguages(owner: string, repo: string) {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/languages`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repository languages");
  }

  return response.json();
}

export async function getRepositoryHistory() {
  const response = await fetch(`${API_URL}/api/repositories/history`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch repository history");
  }

  return response.json();
}


export async function deleteRepositoryHistoryItem(id: number) {
  const response = await fetch(
    `${API_URL}/api/repositories/history/${id}`,
    {
      method: "DELETE",
      headers: {
        ...authHeaders(),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete history item");
  }
}

export async function getRepositoryContributors(owner: string, repo: string) {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/contributors`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repository contributors");
  }

  return response.json();
}

export async function getRepositoryBranches(owner: string, repo: string) {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/branches`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repository branches");
  }

  return response.json();
}

export async function getRepositoryReadme(owner: string, repo: string) {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/readme`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repository README");
  }

  return response.json();
}

export async function getRepositoryTechnologies(owner: string, repo: string) {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/technologies`
  );

  if (!response.ok) {
    throw new Error("Failed to detect technologies");
  }

  return response.json();
}

export async function getRepositoryScore(owner: string, repo: string) {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/score`
  );

  if (!response.ok) {
    throw new Error("Failed to calculate project score");
  }

  return response.json();
}
export async function compareRepositories(repositoryUrls: string[]) {
  const response = await fetch(`${API_URL}/api/repositories/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ repositoryUrls }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to compare repositories"));
  }

  return response.json();
}

export async function getRepositoryComplexity(owner: string, repo: string) {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/complexity`,
    {
      headers: {
        ...authHeaders(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to calculate repository complexity"));
  }

  return response.json();
}

export async function getRepositoryReport(owner: string, repo: string) {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/report`,
    {
      headers: {
        ...authHeaders(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to generate repository report"));
  }

  return response.json();
}


export async function downloadRepositoryPdfReport(owner: string, repo: string): Promise<Blob> {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/report.pdf`,
    {
      headers: {
        ...authHeaders(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to generate PDF report"));
  }

  return response.blob();
}

export async function saveRepositoryReport(owner: string, repo: string) {
  const response = await fetch(
    `${API_URL}/api/repositories/${owner}/${repo}/report/save`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to save repository report"));
  }

  return response.json();
}

export async function getSavedRepositoryReports() {
  const response = await fetch(`${API_URL}/api/repositories/reports/saved`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to load saved reports"));
  }

  return response.json();
}

export async function deleteSavedRepositoryReport(id: number) {
  const response = await fetch(`${API_URL}/api/repositories/reports/saved/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to delete saved report"));
  }
}

export async function refreshSavedRepositoryReportShareLink(id: number) {
  const response = await fetch(`${API_URL}/api/repositories/reports/saved/${id}/share`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to create report share link"));
  }

  return response.json();
}

export async function getSharedRepositoryReport(shareId: string) {
  const response = await fetch(`${API_URL}/api/repositories/reports/shared/${shareId}`);

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to load shared report"));
  }

  return response.json();
}


export async function downloadSavedRepositoryReportPdf(id: number): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/repositories/reports/saved/${id}/report.pdf`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to download saved PDF report"));
  }

  return response.blob();
}

export async function downloadSharedRepositoryReportPdf(shareId: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/repositories/reports/shared/${shareId}/report.pdf`);

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to download shared PDF report"));
  }

  return response.blob();
}

export async function getSavedRepositoryReportTrend(repositoryFullName: string) {
  const params = new URLSearchParams({ repositoryFullName });
  const response = await fetch(`${API_URL}/api/repositories/reports/saved/trends?${params.toString()}`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to load report trend"));
  }

  return response.json();
}

export async function getRepositoryComparisonHistory() {
  const response = await fetch(`${API_URL}/api/repositories/compare/history`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to load comparison history"));
  }

  return response.json();
}


export async function scheduleRepositoryAnalysis(repositoryUrl: string) {
  const response = await fetch(`${API_URL}/api/repositories/scheduled`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ repositoryUrl }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to schedule repository analysis"));
  }

  return response.json();
}

export async function getScheduledRepositoryAnalyses() {
  const response = await fetch(`${API_URL}/api/repositories/scheduled`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to load scheduled analyses"));
  }

  return response.json();
}

export async function runScheduledRepositoryAnalysis(id: number) {
  const response = await fetch(`${API_URL}/api/repositories/scheduled/${id}/run`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to run scheduled analysis"));
  }

  return response.json();
}

export async function deleteScheduledRepositoryAnalysis(id: number) {
  const response = await fetch(`${API_URL}/api/repositories/scheduled/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to delete scheduled analysis"));
  }
}


export async function getNotificationSettings() {
  const response = await fetch(`${API_URL}/api/repositories/notification-settings`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to load notification settings"));
  }

  return response.json();
}

export async function updateNotificationSettings(settings: {
  emailNotificationsEnabled: boolean;
  scoreDropNotificationThreshold: number;
}) {
  const response = await fetch(`${API_URL}/api/repositories/notification-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to update notification settings"));
  }

  return response.json();
}
