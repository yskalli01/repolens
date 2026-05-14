export type RepositoryAnalysis = {
    name: string;
    fullName: string;
    description: string;
    stars: number;
    forks: number;
    mainLanguage: string;
    defaultBranch: string;
    url: string;
};

export type LanguageStat = {
    language: string;
    bytes: number;
    percentage: number;
};

export type RepositoryAnalysisHistory = {
    id: number;
    repositoryUrl: string;
    fullName: string;
    description: string;
    stars: number;
    forks: number;
    mainLanguage: string;
    url: string;
    analyzedAt: string;
};

export type Contributor = {
    username: string;
    avatarUrl: string;
    profileUrl: string;
    contributions: number;
};

export type Branch = {
    name: string;
    commitSha: string;
    isProtected: boolean;
};

export type ReadmeAnalysis = {
    exists: boolean;
    content: string;
    characterCount: number;
    wordCount: number;
    hasInstallationSection: boolean;
    hasUsageSection: boolean;
    hasLicenseSection: boolean;
};

export type TechDetection = {
    packageManagers: string[];
    frameworks: string[];
    buildTools: string[];
    detectedFiles: string[];
    dependencies: string[];
};

export type ProjectScore = {
    score: number;
    grade: string;
    strengths: string[];
    recommendations: string[];
};
export type RepositoryQualitySignals = {
    hasCiConfig: boolean;
    hasDockerSupport: boolean;
    hasEnvExample: boolean;
    hasTests: boolean;
    hasLicenseFile: boolean;
    hasIgnoreFile: boolean;
    detectedFiles: string[];
};

export type FullRepositoryAnalysis = {
    repository: RepositoryAnalysis;
    languages: LanguageStat[];
    contributors: Contributor[];
    branches: Branch[];
    readme: ReadmeAnalysis;
    technologies: TechDetection;
    qualitySignals: RepositoryQualitySignals;
    score: ProjectScore;
};

export type RepositoryComparisonItem = {
    fullName: string;
    url: string;
    stars: number;
    forks: number;
    mainLanguage: string;
    score: number;
    grade: string;
    strengths: string[];
    recommendations: string[];
};

export type RepositoryComparison = {
    repositories: RepositoryComparisonItem[];
    winnerFullName: string;
    winnerScore: number;
    summary: string[];
};

export type RepositoryComplexity = {
    scannedFiles: number;
    scannedDirectories: number;
    estimatedSourceBytes: number;
    testFiles: number;
    documentationFiles: number;
    configurationFiles: number;
    largestFiles: string[];
    sourceScanStrategy: string;
    notes: string[];
};

export type RepositoryReport = {
    repositoryFullName: string;
    repositoryUrl: string;
    generatedAt: string;
    score: number;
    grade: string;
    strengths: string[];
    recommendations: string[];
    cvHighlights: string[];
    complexity: RepositoryComplexity;
    markdown: string;
    shareId?: string;
    scoreDeltaFromPrevious?: number | null;
};


export type SavedRepositoryReport = {
    id: number;
    repositoryFullName: string;
    repositoryUrl: string;
    score: number;
    grade: string;
    generatedAt: string;
    markdown: string;
    shareId?: string;
    scoreDeltaFromPrevious?: number | null;
};


export type RepositoryReportTrendPoint = {
    id: number;
    repositoryFullName: string;
    score: number;
    grade: string;
    generatedAt: string;
};

export type RepositoryComparisonHistory = {
    id: number;
    winnerFullName: string;
    winnerScore: number;
    comparedAt: string;
    comparedRepositories: string;
    summary: string;
};


export type ScheduledRepositoryAnalysis = {
    id: number;
    repositoryFullName: string;
    repositoryUrl: string;
    enabled: boolean;
    createdAt: string;
    lastRunAt?: string | null;
    lastScore?: number | null;
    previousScore?: number | null;
    scoreDelta?: number | null;
    lastGrade?: string | null;
    scoreDropThreshold?: number | null;
    alertTriggered?: boolean;
    emailNotificationSent?: boolean;
    emailNotificationSentAt?: string | null;
    notificationMessage?: string | null;
    lastError?: string | null;
};


export type NotificationSettings = {
    emailNotificationsEnabled: boolean;
    scoreDropNotificationThreshold: number;
    recipientEmail: string;
};

export type NotificationSettingsUpdate = {
    emailNotificationsEnabled: boolean;
    scoreDropNotificationThreshold: number;
};
