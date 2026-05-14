package com.githubanalyzer.backend.service;

import com.githubanalyzer.backend.dto.RepositoryAnalysisResponse;
import com.githubanalyzer.backend.dto.TechDetectionResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.githubanalyzer.backend.dto.BranchResponse;
import com.githubanalyzer.backend.dto.ContributorResponse;
import com.githubanalyzer.backend.dto.LanguageStatResponse;
import com.githubanalyzer.backend.dto.ProjectScoreResponse;
import com.githubanalyzer.backend.dto.ReadmeAnalysisResponse;
import com.githubanalyzer.backend.dto.FullRepositoryAnalysisResponse;
import com.githubanalyzer.backend.dto.RepositoryQualitySignalsResponse;
import com.githubanalyzer.backend.dto.RepositoryComparisonItemResponse;
import com.githubanalyzer.backend.dto.RepositoryComparisonResponse;
import com.githubanalyzer.backend.dto.RepositoryComparisonHistoryResponse;
import com.githubanalyzer.backend.dto.RepositoryRecommendationResponse;
import com.githubanalyzer.backend.dto.RepositoryComplexityResponse;
import com.githubanalyzer.backend.dto.RepositoryReportResponse;
import com.githubanalyzer.backend.dto.SavedRepositoryReportResponse;
import com.githubanalyzer.backend.dto.RepositoryReportTrendPointResponse;
import com.githubanalyzer.backend.dto.ScheduledRepositoryAnalysisResponse;
import com.githubanalyzer.backend.dto.NotificationSettingsRequest;
import com.githubanalyzer.backend.dto.NotificationSettingsResponse;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import com.githubanalyzer.backend.entity.RepositoryAnalysis;
import com.githubanalyzer.backend.entity.RepositoryReportSnapshot;
import com.githubanalyzer.backend.entity.RepositoryComparisonSnapshot;
import com.githubanalyzer.backend.entity.ScheduledRepositoryAnalysis;
import com.githubanalyzer.backend.entity.User;
import com.githubanalyzer.backend.repository.RepositoryAnalysisRepository;
import com.githubanalyzer.backend.repository.RepositoryReportSnapshotRepository;
import com.githubanalyzer.backend.repository.RepositoryComparisonSnapshotRepository;
import com.githubanalyzer.backend.repository.ScheduledRepositoryAnalysisRepository;
import com.githubanalyzer.backend.repository.UserRepository;
import com.githubanalyzer.backend.dto.RepositoryAnalysisHistoryResponse;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Comparator;

import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.NoSuchElementException;
import java.util.UUID;

import com.githubanalyzer.backend.exception.GitHubApiException;
import com.githubanalyzer.backend.util.GitHubRepositoryUrlParser;

@Service
public class RepositoryAnalysisService {

    @Value("${github.token}")
    private String githubToken;
    
    private static final Set<String> SOURCE_FILE_EXTENSIONS = Set.of(
            ".java", ".kt", ".js", ".jsx", ".ts", ".tsx", ".py", ".go", ".rs", ".php", ".rb", ".cs", ".cpp", ".c"
    );
    private static final int MAX_COMPLEXITY_FILES = 1000;

    private final RepositoryAnalysisRepository analysisRepository;
    private final RepositoryReportSnapshotRepository reportSnapshotRepository;
    private final RepositoryComparisonSnapshotRepository comparisonSnapshotRepository;
    private final ScheduledRepositoryAnalysisRepository scheduledRepositoryAnalysisRepository;
    private final GitHubApiCache gitHubApiCache;
    private final EmailNotificationService emailNotificationService;
    private final UserRepository userRepository;
    private final RestClient restClient = RestClient.create();


    public RepositoryAnalysisService(
            RepositoryAnalysisRepository analysisRepository,
            RepositoryReportSnapshotRepository reportSnapshotRepository,
            RepositoryComparisonSnapshotRepository comparisonSnapshotRepository,
            ScheduledRepositoryAnalysisRepository scheduledRepositoryAnalysisRepository,
            GitHubApiCache gitHubApiCache,
            EmailNotificationService emailNotificationService,
            UserRepository userRepository
    ) {
        this.analysisRepository = analysisRepository;
        this.reportSnapshotRepository = reportSnapshotRepository;
        this.comparisonSnapshotRepository = comparisonSnapshotRepository;
        this.scheduledRepositoryAnalysisRepository = scheduledRepositoryAnalysisRepository;
        this.gitHubApiCache = gitHubApiCache;
        this.emailNotificationService = emailNotificationService;
        this.userRepository = userRepository;
    }

    // public RepositoryAnalysisResponse analyze(String repositoryUrl) {
    //     GitHubRepoInfo repoInfo = extractOwnerAndRepo(repositoryUrl);

    //     String apiUrl = "https://api.github.com/repos/"
    //             + repoInfo.owner()
    //             + "/"
    //             + repoInfo.repo();

    //     Map response = githubGet(apiUrl)
    //     .retrieve()
    //     .body(Map.class);

    //     RepositoryAnalysisResponse result = RepositoryAnalysisResponse.builder()
    //     .name((String) response.get("name"))
    //     .fullName((String) response.get("full_name"))
    //     .description((String) response.get("description"))
    //     .stars((Integer) response.get("stargazers_count"))
    //     .forks((Integer) response.get("forks_count"))
    //     .mainLanguage((String) response.get("language"))
    //     .defaultBranch((String) response.get("default_branch"))
    //     .url((String) response.get("html_url"))
    //     .build();

    //     analysisRepository.save(
    //             RepositoryAnalysis.builder()
    //                     .repositoryUrl(repositoryUrl)
    //                     .name(result.getName())
    //                     .fullName(result.getFullName())
    //                     .description(result.getDescription())
    //                     .stars(result.getStars())
    //                     .forks(result.getForks())
    //                     .mainLanguage(result.getMainLanguage())
    //                     .defaultBranch(result.getDefaultBranch())
    //                     .url(result.getUrl())
    //                     .analyzedAt(LocalDateTime.now())
    //                     .build()
    //     );

    //     return result;
    // }
    
    public RepositoryAnalysisResponse analyze(String repositoryUrl, User user) {
        RepositoryAnalysisResponse result = fetchRepositoryInfo(repositoryUrl);

        analysisRepository.save(
                RepositoryAnalysis.builder()
                        .repositoryUrl(repositoryUrl)
                        .name(result.getName())
                        .fullName(result.getFullName())
                        .description(result.getDescription())
                        .stars(result.getStars())
                        .forks(result.getForks())
                        .mainLanguage(result.getMainLanguage())
                        .defaultBranch(result.getDefaultBranch())
                        .url(result.getUrl())
                        .analyzedAt(LocalDateTime.now())
                        .user(user)
                        .build()
        );

        return result;
    }

    public FullRepositoryAnalysisResponse analyzeFull(String repositoryUrl, User user) {
        RepositoryAnalysisResponse repository = analyze(repositoryUrl, user);
        GitHubRepoInfo repoInfo = extractOwnerAndRepo(repository.getUrl());

        List<LanguageStatResponse> languages = getLanguages(repoInfo.owner(), repoInfo.repo());
        List<ContributorResponse> contributors = getContributors(repoInfo.owner(), repoInfo.repo());
        List<BranchResponse> branches = getBranches(repoInfo.owner(), repoInfo.repo());
        ReadmeAnalysisResponse readme = getReadmeAnalysis(repoInfo.owner(), repoInfo.repo());
        TechDetectionResponse technologies = detectTechnologies(repoInfo.owner(), repoInfo.repo());
        RepositoryQualitySignalsResponse qualitySignals = getQualitySignals(repoInfo.owner(), repoInfo.repo());
        ProjectScoreResponse score = calculateProjectScore(repository, readme, technologies, branches, qualitySignals);

        return new FullRepositoryAnalysisResponse(
                repository,
                languages,
                contributors,
                branches,
                readme,
                technologies,
                qualitySignals,
                score
        );
    }
    
    private RepositoryAnalysisResponse fetchRepositoryInfo(String repositoryUrl) {
        GitHubRepoInfo repoInfo = extractOwnerAndRepo(repositoryUrl);
    
        String apiUrl = "https://api.github.com/repos/"
                + repoInfo.owner()
                + "/"
                + repoInfo.repo();
    
        Map response;

        try {
            response = githubGetMap(apiUrl);
        } catch (RestClientResponseException exception) {
            throw toGitHubApiException(exception, "GitHub repository could not be read right now.");
        }

        if (response == null) {
            throw new GitHubApiException(
                    "GitHub repository was not found or could not be read",
                    org.springframework.http.HttpStatus.NOT_FOUND
            );
        }

        return RepositoryAnalysisResponse.builder()
                .name((String) response.get("name"))
                .fullName((String) response.get("full_name"))
                .description((String) response.get("description"))
                .stars((Integer) response.get("stargazers_count"))
                .forks((Integer) response.get("forks_count"))
                .mainLanguage((String) response.get("language"))
                .defaultBranch((String) response.get("default_branch"))
                .url((String) response.get("html_url"))
                .build();
    }


    public List<LanguageStatResponse> getLanguages(String owner, String repo) {
        String apiUrl = "https://api.github.com/repos/"
                + owner
                + "/"
                + repo
                + "/languages";
    
        Map<String, Object> response;

        try {
            response = githubGetMap(apiUrl);
        } catch (RestClientResponseException exception) {
            throw toGitHubApiException(exception, "Repository languages could not be read right now.");
        }
    
        if (response == null || response.isEmpty()) {
            return List.of();
        }
    
        long totalBytes = response.values()
                .stream()
                .filter(Number.class::isInstance)
                .map(Number.class::cast)
                .mapToLong(Number::longValue)
                .sum();
    
        return response.entrySet()
                .stream()
                .map(entry -> {
                    String language = entry.getKey();
                    Object rawBytes = entry.getValue();
                    long bytes = rawBytes instanceof Number number ? number.longValue() : 0L;
                    double percentage = totalBytes == 0 ? 0.0 : (bytes * 100.0) / totalBytes;
    
                    return new LanguageStatResponse(
                            language,
                            bytes,
                            Math.round(percentage * 100.0) / 100.0
                    );
                })
                .toList();
    }

    public List<RepositoryAnalysisHistoryResponse> getHistory(User user) {
        return analysisRepository.findTop10ByUserOrderByAnalyzedAtDesc(user)
                .stream()
                .map(item -> RepositoryAnalysisHistoryResponse.builder()
                        .id(item.getId())
                        .repositoryUrl(item.getRepositoryUrl())
                        .fullName(item.getFullName())
                        .description(item.getDescription())
                        .stars(item.getStars())
                        .forks(item.getForks())
                        .mainLanguage(item.getMainLanguage())
                        .url(item.getUrl())
                        .analyzedAt(item.getAnalyzedAt())
                        .build())
                .toList();
    }

    public void deleteHistoryItem(Long id, User user) {
        RepositoryAnalysis analysis = analysisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("History item not found"));
    
        if (!analysis.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to delete this item");
        }
    
        analysisRepository.delete(analysis);
    }

    public List<ContributorResponse> getContributors(String owner, String repo) {
        String apiUrl = "https://api.github.com/repos/"
                + owner
                + "/"
                + repo
                + "/contributors";

        List<Map<String, Object>> response;

        try {
            response = githubGetList(apiUrl);
        } catch (RestClientResponseException exception) {
            throw toGitHubApiException(exception, "Repository contributors could not be read right now.");
        }

        if (response == null || response.isEmpty()) {
            return List.of();
        }

        return response.stream()
                .limit(10)
                .map(item -> new ContributorResponse(
                        (String) item.get("login"),
                        (String) item.get("avatar_url"),
                        (String) item.get("html_url"),
                        (Integer) item.get("contributions")
                ))
                .toList();
    }

    public List<BranchResponse> getBranches(String owner, String repo) {
        String apiUrl = "https://api.github.com/repos/"
                + owner
                + "/"
                + repo
                + "/branches";

        List<Map<String, Object>> response;

        try {
            response = githubGetList(apiUrl);
        } catch (RestClientResponseException exception) {
            throw toGitHubApiException(exception, "Repository branches could not be read right now.");
        }

        if (response == null || response.isEmpty()) {
            return List.of();
        }

        return response.stream()
                .map(item -> {
                    Map<String, Object> commit =
                            (Map<String, Object>) item.get("commit");

                    return new BranchResponse(
                            (String) item.get("name"),
                            (String) commit.get("sha"),
                            (Boolean) item.get("protected")
                    );
                })
                .toList();
    }

    public ReadmeAnalysisResponse getReadmeAnalysis(String owner, String repo) {
        String apiUrl = "https://api.github.com/repos/"
                + owner
                + "/"
                + repo
                + "/readme";

        try {
            Map<String, Object> response = githubGetMap(apiUrl);

            if (response == null || response.get("content") == null) {
                return new ReadmeAnalysisResponse(
                        false,
                        "",
                        0,
                        0,
                        false,
                        false,
                        false
                );
            }

            String encodedContent = ((String) response.get("content"))
                    .replace("\n", "");

            String content = new String(
                    Base64.getDecoder().decode(encodedContent),
                    StandardCharsets.UTF_8
            );

            String lowerContent = content.toLowerCase();

            int characterCount = content.length();

            int wordCount = content.isBlank()
                    ? 0
                    : content.trim().split("\\s+").length;

            boolean hasInstallationSection =
                    lowerContent.contains("installation")
                            || lowerContent.contains("install");

            boolean hasUsageSection =
                    lowerContent.contains("usage")
                            || lowerContent.contains("getting started")
                            || lowerContent.contains("quick start");

            boolean hasLicenseSection =
                    lowerContent.contains("license");

            return new ReadmeAnalysisResponse(
                    true,
                    content,
                    characterCount,
                    wordCount,
                    hasInstallationSection,
                    hasUsageSection,
                    hasLicenseSection
            );
        } catch (Exception exception) {
            return new ReadmeAnalysisResponse(
                    false,
                    "",
                    0,
                    0,
                    false,
                    false,
                    false
            );
        }
    }

    public TechDetectionResponse detectTechnologies(String owner, String repo) {
        String apiUrl = "https://api.github.com/repos/"
                + owner
                + "/"
                + repo
                + "/contents";
    
        List<Map<String, Object>> files = getRepositoryContents(owner, repo, "");
    
        if (files == null || files.isEmpty()) {
            return new TechDetectionResponse(
                    List.of(),
                    List.of(),
                    List.of(),
                    List.of(),
                    List.of()
            );
        }
    
        List<String> packageManagers = new ArrayList<>();
        List<String> frameworks = new ArrayList<>();
        List<String> buildTools = new ArrayList<>();
        List<String> detectedFiles = new ArrayList<>();
        List<String> dependencies = new ArrayList<>();
    
        for (Map<String, Object> file : files) {
            String fileName = (String) file.get("name");
    
            if (fileName == null) continue;
    
            switch (fileName) {
                case "package.json" -> {
                    packageManagers.add("npm / yarn / pnpm");
                    frameworks.add("JavaScript / TypeScript project");
                    detectedFiles.add("package.json");
    
                    String content = getFileContent(owner, repo, "package.json");
    
                    if (content.contains("\"next\"")) {
                        frameworks.add("Next.js");
                        dependencies.add("next");
                    }
    
                    if (content.contains("\"react\"")) {
                        frameworks.add("React");
                        dependencies.add("react");
                    }
    
                    if (content.contains("\"@mui/material\"")) {
                        frameworks.add("MUI");
                        dependencies.add("@mui/material");
                    }
    
                    if (content.contains("\"express\"")) {
                        frameworks.add("Express.js");
                        dependencies.add("express");
                    }
    
                    if (content.contains("\"nestjs\"") || content.contains("\"@nestjs/core\"")) {
                        frameworks.add("NestJS");
                        dependencies.add("@nestjs/core");
                    }
    
                    if (content.contains("\"vite\"")) {
                        buildTools.add("Vite");
                        dependencies.add("vite");
                    }
                }
    
                case "package-lock.json" -> {
                    packageManagers.add("npm");
                    detectedFiles.add("package-lock.json");
                }
    
                case "yarn.lock" -> {
                    packageManagers.add("Yarn");
                    detectedFiles.add("yarn.lock");
                }
    
                case "pnpm-lock.yaml" -> {
                    packageManagers.add("pnpm");
                    detectedFiles.add("pnpm-lock.yaml");
                }
    
                case "next.config.js", "next.config.ts", "next.config.mjs" -> {
                    frameworks.add("Next.js");
                    detectedFiles.add(fileName);
                }
    
                case "pom.xml" -> {
                    packageManagers.add("Maven");
                    buildTools.add("Maven");
                    frameworks.add("Java project");
                    detectedFiles.add("pom.xml");
    
                    String content = getFileContent(owner, repo, "pom.xml");
    
                    if (content.contains("spring-boot-starter")) {
                        frameworks.add("Spring Boot");
                        dependencies.add("spring-boot-starter");
                    }
    
                    if (content.contains("spring-boot-starter-web")) {
                        dependencies.add("spring-boot-starter-web");
                    }
    
                    if (content.contains("spring-boot-starter-data-jpa")) {
                        dependencies.add("spring-boot-starter-data-jpa");
                    }
    
                    if (content.contains("postgresql")) {
                        dependencies.add("PostgreSQL driver");
                    }
    
                    if (content.contains("mysql-connector") || content.contains("mysql")) {
                        dependencies.add("MySQL driver");
                    }
                }
    
                case "build.gradle", "build.gradle.kts" -> {
                    packageManagers.add("Gradle");
                    buildTools.add("Gradle");
                    frameworks.add("Java / Kotlin project");
                    detectedFiles.add(fileName);
    
                    String content = getFileContent(owner, repo, fileName);
    
                    if (content.contains("org.springframework.boot")) {
                        frameworks.add("Spring Boot");
                        dependencies.add("org.springframework.boot");
                    }
                }
    
                case "requirements.txt" -> {
                    packageManagers.add("pip");
                    frameworks.add("Python project");
                    detectedFiles.add("requirements.txt");
    
                    String content = getFileContent(owner, repo, "requirements.txt").toLowerCase();
    
                    if (content.contains("django")) {
                        frameworks.add("Django");
                        dependencies.add("django");
                    }
    
                    if (content.contains("flask")) {
                        frameworks.add("Flask");
                        dependencies.add("flask");
                    }
    
                    if (content.contains("fastapi")) {
                        frameworks.add("FastAPI");
                        dependencies.add("fastapi");
                    }
                }
    
                case "pyproject.toml" -> {
                    packageManagers.add("Poetry / pip");
                    frameworks.add("Python project");
                    detectedFiles.add("pyproject.toml");
                }
    
                case "composer.json" -> {
                    packageManagers.add("Composer");
                    frameworks.add("PHP project");
                    detectedFiles.add("composer.json");
    
                    String content = getFileContent(owner, repo, "composer.json");
    
                    if (content.contains("laravel/framework")) {
                        frameworks.add("Laravel");
                        dependencies.add("laravel/framework");
                    }
    
                    if (content.contains("symfony/")) {
                        frameworks.add("Symfony");
                        dependencies.add("symfony");
                    }
                }
    
                case "Gemfile" -> {
                    packageManagers.add("Bundler");
                    frameworks.add("Ruby project");
                    detectedFiles.add("Gemfile");
    
                    String content = getFileContent(owner, repo, "Gemfile");
    
                    if (content.contains("rails")) {
                        frameworks.add("Ruby on Rails");
                        dependencies.add("rails");
                    }
                }
    
                case "go.mod" -> {
                    packageManagers.add("Go Modules");
                    frameworks.add("Go project");
                    detectedFiles.add("go.mod");
    
                    String content = getFileContent(owner, repo, "go.mod");
    
                    if (content.contains("gin-gonic/gin")) {
                        frameworks.add("Gin");
                        dependencies.add("gin-gonic/gin");
                    }
                }
    
                case "Cargo.toml" -> {
                    packageManagers.add("Cargo");
                    frameworks.add("Rust project");
                    detectedFiles.add("Cargo.toml");
                }
    
                case "Dockerfile" -> {
                    buildTools.add("Docker");
                    detectedFiles.add("Dockerfile");
                }
    
                case "docker-compose.yml", "docker-compose.yaml" -> {
                    buildTools.add("Docker Compose");
                    detectedFiles.add(fileName);
                }
            }
        }
    
        return new TechDetectionResponse(
                packageManagers.stream().distinct().toList(),
                frameworks.stream().distinct().toList(),
                buildTools.stream().distinct().toList(),
                detectedFiles.stream().distinct().toList(),
                dependencies.stream().distinct().toList()
        );
    }

    public RepositoryQualitySignalsResponse getQualitySignals(String owner, String repo) {
        List<Map<String, Object>> rootFiles = getRepositoryContents(owner, repo, "");
        List<Map<String, Object>> workflowFiles = getRepositoryContents(owner, repo, ".github/workflows");

        Set<String> rootFileNames = rootFiles.stream()
                .map(file -> ((String) file.getOrDefault("name", "")).toLowerCase(Locale.ROOT))
                .collect(java.util.stream.Collectors.toSet());

        List<String> detectedFiles = new ArrayList<>();

        boolean hasCiConfig = !workflowFiles.isEmpty()
                || rootFileNames.contains(".gitlab-ci.yml")
                || rootFileNames.contains("jenkinsfile");
        boolean hasDockerSupport = rootFileNames.contains("dockerfile")
                || rootFileNames.contains("docker-compose.yml")
                || rootFileNames.contains("docker-compose.yaml");
        boolean hasEnvExample = rootFileNames.contains(".env.example")
                || rootFileNames.contains("env.example")
                || rootFileNames.contains(".env.sample");
        boolean hasTests = rootFileNames.stream().anyMatch(name -> name.contains("test"))
                || rootFileNames.contains("jest.config.js")
                || rootFileNames.contains("vitest.config.ts")
                || rootFileNames.contains("pytest.ini");
        boolean hasLicenseFile = rootFileNames.stream().anyMatch(name -> name.startsWith("license"));
        boolean hasIgnoreFile = rootFileNames.contains(".gitignore");

        if (hasCiConfig) detectedFiles.add("CI configuration");
        if (hasDockerSupport) detectedFiles.add("Docker configuration");
        if (hasEnvExample) detectedFiles.add("Environment example");
        if (hasTests) detectedFiles.add("Test-related files");
        if (hasLicenseFile) detectedFiles.add("License file");
        if (hasIgnoreFile) detectedFiles.add(".gitignore");

        return new RepositoryQualitySignalsResponse(
                hasCiConfig,
                hasDockerSupport,
                hasEnvExample,
                hasTests,
                hasLicenseFile,
                hasIgnoreFile,
                detectedFiles
        );
    }


    public RepositoryComparisonResponse compareRepositories(List<String> repositoryUrls, User user) {
        List<RepositoryComparisonItemResponse> repositories = repositoryUrls.stream()
                .map(this::buildComparisonItem)
                .sorted((left, right) -> Integer.compare(right.getScore(), left.getScore()))
                .toList();

        RepositoryComparisonItemResponse winner = repositories.get(0);
        List<String> summary = new ArrayList<>();
        summary.add(winner.getFullName() + " currently has the strongest score.");

        if (repositories.size() > 1) {
            RepositoryComparisonItemResponse runnerUp = repositories.get(1);
            summary.add("Score gap versus " + runnerUp.getFullName() + ": "
                    + (winner.getScore() - runnerUp.getScore()) + " points.");
        }

        repositories.stream()
                .filter(item -> item.getRecommendations() != null && !item.getRecommendations().isEmpty())
                .findFirst()
                .ifPresent(item -> summary.add("Highest-priority improvement: "
                        + item.getFullName() + " should "
                        + item.getRecommendations().get(0).replaceFirst("\\.$", "").toLowerCase(Locale.ROOT) + "."));

        RepositoryComparisonResponse response = RepositoryComparisonResponse.builder()
                .repositories(repositories)
                .winnerFullName(winner.getFullName())
                .winnerScore(winner.getScore())
                .summary(summary)
                .build();

        saveComparisonSnapshot(response, user);

        return response;
    }


    public List<RepositoryComparisonHistoryResponse> getComparisonHistory(User user) {
        return comparisonSnapshotRepository.findTop10ByUserOrderByComparedAtDesc(user)
                .stream()
                .map(snapshot -> RepositoryComparisonHistoryResponse.builder()
                        .id(snapshot.getId())
                        .winnerFullName(snapshot.getWinnerFullName())
                        .winnerScore(snapshot.getWinnerScore())
                        .comparedAt(snapshot.getComparedAt())
                        .comparedRepositories(snapshot.getComparedRepositories())
                        .summary(snapshot.getSummary())
                        .build())
                .toList();
    }

    private void saveComparisonSnapshot(RepositoryComparisonResponse response, User user) {
        String comparedRepositories = response.getRepositories().stream()
                .map(item -> item.getFullName() + " (" + item.getScore() + "/100)")
                .collect(java.util.stream.Collectors.joining(", "));
        String summary = String.join(" | ", response.getSummary());

        comparisonSnapshotRepository.save(RepositoryComparisonSnapshot.builder()
                .winnerFullName(response.getWinnerFullName())
                .winnerScore(response.getWinnerScore())
                .comparedAt(LocalDateTime.now())
                .comparedRepositories(comparedRepositories)
                .summary(summary)
                .user(user)
                .build());
    }

    public RepositoryRecommendationResponse getRecommendations(String owner, String repo) {
        RepositoryAnalysisResponse repoInfo = fetchRepositoryInfo("https://github.com/" + owner + "/" + repo);
        ProjectScoreResponse score = calculateProjectScore(owner, repo);

        List<String> priorityFixes = score.getRecommendations().stream()
                .limit(5)
                .toList();

        List<String> cvHighlights = new ArrayList<>();
        cvHighlights.add("Analyzes repository metadata, documentation, technology stack, branches, contributors, and quality signals.");
        cvHighlights.add("Produces an explainable project score with strengths and improvement recommendations.");

        if (repoInfo.getStars() != null && repoInfo.getStars() > 0) {
            cvHighlights.add("Handles repositories with public community activity such as stars and forks.");
        }

        List<String> nextMilestones = List.of(
                "Add code-level static analysis using tree or contents traversal.",
                "Add cached GitHub API responses to reduce rate-limit pressure.",
                "Add exportable PDF reports for recruiters and technical reviewers."
        );

        return RepositoryRecommendationResponse.builder()
                .repositoryFullName(repoInfo.getFullName())
                .priorityFixes(priorityFixes)
                .cvHighlights(cvHighlights)
                .nextMilestones(nextMilestones)
                .build();
    }

    private RepositoryComparisonItemResponse buildComparisonItem(String repositoryUrl) {
        RepositoryAnalysisResponse repoInfo = fetchRepositoryInfo(repositoryUrl);
        GitHubRepoInfo repo = extractOwnerAndRepo(repoInfo.getUrl());

        ReadmeAnalysisResponse readme = getReadmeAnalysis(repo.owner(), repo.repo());
        TechDetectionResponse technologies = detectTechnologies(repo.owner(), repo.repo());
        List<BranchResponse> branches = getBranches(repo.owner(), repo.repo());
        RepositoryQualitySignalsResponse qualitySignals = getQualitySignals(repo.owner(), repo.repo());
        ProjectScoreResponse score = calculateProjectScore(repoInfo, readme, technologies, branches, qualitySignals);

        return RepositoryComparisonItemResponse.builder()
                .fullName(repoInfo.getFullName())
                .url(repoInfo.getUrl())
                .stars(repoInfo.getStars())
                .forks(repoInfo.getForks())
                .mainLanguage(repoInfo.getMainLanguage())
                .score(score.getScore())
                .grade(score.getGrade())
                .strengths(score.getStrengths())
                .recommendations(score.getRecommendations())
                .build();
    }


    public RepositoryComplexityResponse getComplexity(String owner, String repo) {
        RepositoryAnalysisResponse repoInfo = fetchRepositoryInfo("https://github.com/" + owner + "/" + repo);
        ComplexityScanResult scanResult = scanRepositoryWithGitTree(owner, repo, repoInfo.getDefaultBranch());
        List<Map<String, Object>> collectedFiles = scanResult.files();
        ComplexityCounter counter = scanResult.counter();

        List<String> largestFiles = collectedFiles.stream()
                .sorted(Comparator.comparingLong(file -> -asLong(file.get("size"))))
                .limit(5)
                .map(file -> file.get("path") + " (" + asLong(file.get("size")) + " bytes)")
                .toList();

        int testFiles = (int) collectedFiles.stream()
                .filter(file -> isTestFile((String) file.get("path")))
                .count();
        int documentationFiles = (int) collectedFiles.stream()
                .filter(file -> isDocumentationFile((String) file.get("path")))
                .count();
        int configurationFiles = (int) collectedFiles.stream()
                .filter(file -> isConfigurationFile((String) file.get("path")))
                .count();
        long sourceBytes = collectedFiles.stream()
                .filter(file -> isSourceFile((String) file.get("path")))
                .mapToLong(file -> asLong(file.get("size")))
                .sum();

        List<String> notes = new ArrayList<>();
        notes.add("Scans the repository with the Git Trees API when available, with a safety limit of " + MAX_COMPLEXITY_FILES + " files.");
        if (counter.usedContentsFallback) {
            notes.add("Git Trees API was unavailable, so the analyzer used the repository contents fallback.");
        }
        if (counter.limitReached) {
            notes.add("The scan reached the safety limit, so metrics are estimated from the first files returned by GitHub.");
        }

        return RepositoryComplexityResponse.builder()
                .scannedFiles(collectedFiles.size())
                .scannedDirectories(counter.directories)
                .estimatedSourceBytes(sourceBytes)
                .testFiles(testFiles)
                .documentationFiles(documentationFiles)
                .configurationFiles(configurationFiles)
                .largestFiles(largestFiles)
                .sourceScanStrategy(counter.usedContentsFallback ? "contents-api-fallback" : "git-trees-api")
                .notes(notes)
                .build();
    }

    public RepositoryReportResponse buildReport(String owner, String repo) {
        RepositoryAnalysisResponse repoInfo = fetchRepositoryInfo("https://github.com/" + owner + "/" + repo);
        ProjectScoreResponse score = calculateProjectScore(owner, repo);
        RepositoryRecommendationResponse recommendations = getRecommendations(owner, repo);
        RepositoryComplexityResponse complexity = getComplexity(owner, repo);

        String markdown = buildMarkdownReport(repoInfo, score, recommendations, complexity);

        return RepositoryReportResponse.builder()
                .repositoryFullName(repoInfo.getFullName())
                .repositoryUrl(repoInfo.getUrl())
                .generatedAt(LocalDateTime.now())
                .score(score.getScore())
                .grade(score.getGrade())
                .strengths(score.getStrengths())
                .recommendations(score.getRecommendations())
                .cvHighlights(recommendations.getCvHighlights())
                .complexity(complexity)
                .markdown(markdown)
                .build();
    }


    public RepositoryReportResponse saveReport(String owner, String repo, User user) {
        RepositoryReportResponse report = buildReport(owner, repo);

        reportSnapshotRepository.save(RepositoryReportSnapshot.builder()
                .shareId(UUID.randomUUID().toString())
                .repositoryFullName(report.getRepositoryFullName())
                .repositoryUrl(report.getRepositoryUrl())
                .score(report.getScore())
                .grade(report.getGrade())
                .generatedAt(report.getGeneratedAt())
                .markdown(report.getMarkdown())
                .user(user)
                .build());

        return report;
    }

    public List<SavedRepositoryReportResponse> getSavedReports(User user) {
        return reportSnapshotRepository.findTop10ByUserOrderByGeneratedAtDesc(user)
                .stream()
                .map(this::toSavedReportResponse)
                .toList();
    }

    public SavedRepositoryReportResponse getSavedReport(Long id, User user) {
        return reportSnapshotRepository.findByIdAndUser(id, user)
                .map(this::toSavedReportResponse)
                .orElseThrow(() -> new NoSuchElementException("Saved report not found"));
    }

    public SavedRepositoryReportResponse getSharedReport(String shareId) {
        return reportSnapshotRepository.findByShareId(shareId)
                .map(this::toSavedReportResponse)
                .orElseThrow(() -> new NoSuchElementException("Shared report not found"));
    }

    public SavedRepositoryReportResponse refreshSavedReportShareLink(Long id, User user) {
        RepositoryReportSnapshot snapshot = reportSnapshotRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Saved report not found"));

        if (snapshot.getShareId() == null || snapshot.getShareId().isBlank()) {
            snapshot.setShareId(UUID.randomUUID().toString());
            snapshot = reportSnapshotRepository.save(snapshot);
        }

        return toSavedReportResponse(snapshot);
    }

    public void deleteSavedReport(Long id, User user) {
        RepositoryReportSnapshot snapshot = reportSnapshotRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Saved report not found"));

        reportSnapshotRepository.delete(snapshot);
    }

    public RepositoryReportSnapshot getSavedReportSnapshot(Long id, User user) {
        return reportSnapshotRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Saved report not found"));
    }

    public RepositoryReportSnapshot getSharedReportSnapshot(String shareId) {
        return reportSnapshotRepository.findByShareId(shareId)
                .orElseThrow(() -> new NoSuchElementException("Shared report not found"));
    }

    public List<RepositoryReportTrendPointResponse> getSavedReportTrend(String repositoryFullName, User user) {
        return reportSnapshotRepository
                .findTop20ByUserAndRepositoryFullNameOrderByGeneratedAtDesc(user, repositoryFullName)
                .stream()
                .sorted(Comparator.comparing(RepositoryReportSnapshot::getGeneratedAt))
                .map(snapshot -> RepositoryReportTrendPointResponse.builder()
                        .id(snapshot.getId())
                        .repositoryFullName(snapshot.getRepositoryFullName())
                        .score(snapshot.getScore())
                        .grade(snapshot.getGrade())
                        .generatedAt(snapshot.getGeneratedAt())
                        .build())
                .toList();
    }

    private SavedRepositoryReportResponse toSavedReportResponse(RepositoryReportSnapshot snapshot) {
        return SavedRepositoryReportResponse.builder()
                .id(snapshot.getId())
                .repositoryFullName(snapshot.getRepositoryFullName())
                .repositoryUrl(snapshot.getRepositoryUrl())
                .score(snapshot.getScore())
                .grade(snapshot.getGrade())
                .generatedAt(snapshot.getGeneratedAt())
                .markdown(snapshot.getMarkdown())
                .shareId(snapshot.getShareId())
                .scoreDeltaFromPrevious(calculateScoreDeltaFromPrevious(snapshot))
                .build();
    }

    private Integer calculateScoreDeltaFromPrevious(RepositoryReportSnapshot snapshot) {
        if (snapshot.getUser() == null || snapshot.getRepositoryFullName() == null || snapshot.getScore() == null) {
            return null;
        }

        return reportSnapshotRepository
                .findTop20ByUserAndRepositoryFullNameOrderByGeneratedAtDesc(snapshot.getUser(), snapshot.getRepositoryFullName())
                .stream()
                .filter(candidate -> candidate.getGeneratedAt() != null)
                .filter(candidate -> candidate.getGeneratedAt().isBefore(snapshot.getGeneratedAt()))
                .findFirst()
                .map(previous -> previous.getScore() == null ? null : snapshot.getScore() - previous.getScore())
                .orElse(null);
    }

    public ProjectScoreResponse calculateProjectScore(String owner, String repo) {
        RepositoryAnalysisResponse repoInfo = fetchRepositoryInfo(
                "https://github.com/" + owner + "/" + repo
        );

        ReadmeAnalysisResponse readme = getReadmeAnalysis(owner, repo);
        TechDetectionResponse technologies = detectTechnologies(owner, repo);
        List<BranchResponse> branches = getBranches(owner, repo);
        RepositoryQualitySignalsResponse qualitySignals = getQualitySignals(owner, repo);

        return calculateProjectScore(repoInfo, readme, technologies, branches, qualitySignals);
    }

    private ProjectScoreResponse calculateProjectScore(
            RepositoryAnalysisResponse repoInfo,
            ReadmeAnalysisResponse readme,
            TechDetectionResponse technologies,
            List<BranchResponse> branches,
            RepositoryQualitySignalsResponse qualitySignals
    ) {
        int score = 0;

        List<String> strengths = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        if (repoInfo.getDescription() != null && !repoInfo.getDescription().isBlank()) {
            score += 10;
            strengths.add("Repository has a description.");
        } else {
            recommendations.add("Add a clear repository description.");
        }

        if (repoInfo.getStars() != null && repoInfo.getStars() > 0) {
            score += 10;
            strengths.add("Repository has community interest.");
        }

        if (readme.getExists()) {
            score += 20;
            strengths.add("README file exists.");
        } else {
            recommendations.add("Add a README file.");
        }

        if (readme.getHasInstallationSection()) {
            score += 10;
            strengths.add("README includes installation instructions.");
        } else {
            recommendations.add("Add an installation section to the README.");
        }

        if (readme.getHasUsageSection()) {
            score += 10;
            strengths.add("README includes usage instructions.");
        } else {
            recommendations.add("Add usage examples to the README.");
        }

        if (readme.getHasLicenseSection()) {
            score += 10;
            strengths.add("README mentions license information.");
        } else {
            recommendations.add("Add license information.");
        }

        if (!technologies.getDetectedFiles().isEmpty()) {
            score += 10;
            strengths.add("Technology files were detected.");
        } else {
            recommendations.add("Add standard technology/build files when applicable.");
        }

        if (!technologies.getDependencies().isEmpty()) {
            score += 10;
            strengths.add("Dependencies were detected.");
        } else {
            recommendations.add("Make dependencies clear through standard files.");
        }

        if (Boolean.TRUE.equals(qualitySignals.getHasCiConfig())) {
            score += 10;
            strengths.add("CI/CD configuration was detected.");
        } else {
            recommendations.add("Add a CI workflow to run builds and tests automatically.");
        }

        if (Boolean.TRUE.equals(qualitySignals.getHasTests())) {
            score += 10;
            strengths.add("Test-related files were detected.");
        } else {
            recommendations.add("Add automated tests and expose them in the project structure.");
        }

        if (Boolean.TRUE.equals(qualitySignals.getHasDockerSupport())) {
            score += 5;
            strengths.add("Docker configuration was detected.");
        } else {
            recommendations.add("Add Docker support to make local setup and deployment easier.");
        }

        if (Boolean.TRUE.equals(qualitySignals.getHasEnvExample())) {
            score += 5;
            strengths.add("Environment example file was detected.");
        } else {
            recommendations.add("Add a .env.example file documenting required environment variables.");
        }

        boolean hasProtectedBranch = branches.stream()
                .anyMatch(branch -> Boolean.TRUE.equals(branch.getIsProtected()));

        if (hasProtectedBranch) {
            score += 10;
            strengths.add("At least one protected branch was detected.");
        } else {
            recommendations.add("Protect important branches like main or master.");
        }

        if (score > 100) {
            score = 100;
        }

        String grade;

        if (score >= 85) {
            grade = "Excellent";
        } else if (score >= 70) {
            grade = "Good";
        } else if (score >= 50) {
            grade = "Average";
        } else {
            grade = "Needs improvement";
        }

        return new ProjectScoreResponse(
                score,
                grade,
                strengths,
                recommendations
        );
    }




    
    private List<Map<String, Object>> getRepositoryContents(String owner, String repo, String path) {
        String apiUrl = "https://api.github.com/repos/"
                + owner
                + "/"
                + repo
                + "/contents"
                + (path == null || path.isBlank() ? "" : "/" + path);

        try {
            List<Map<String, Object>> response = githubGetList(apiUrl);

            return response == null ? List.of() : response;
        } catch (Exception exception) {
            return List.of();
        }
    }

    private String getFileContent(String owner, String repo, String path) {
        String apiUrl = "https://api.github.com/repos/"
                + owner
                + "/"
                + repo
                + "/contents/"
                + path;
    
        try {
            Map<String, Object> response = githubGetMap(apiUrl);
    
            if (response == null || response.get("content") == null) {
                return "";
            }
    
            String encodedContent = ((String) response.get("content"))
                    .replace("\n", "");
    
            return new String(
                    Base64.getDecoder().decode(encodedContent),
                    StandardCharsets.UTF_8
            );
        } catch (Exception exception) {
            return "";
        }
    }



    public ScheduledRepositoryAnalysisResponse scheduleRepositoryAnalysis(String repositoryUrl, User user) {
        RepositoryAnalysisResponse repoInfo = fetchRepositoryInfo(repositoryUrl);

        ScheduledRepositoryAnalysis scheduled = scheduledRepositoryAnalysisRepository
                .findByUserAndRepositoryFullName(user, repoInfo.getFullName())
                .orElseGet(() -> ScheduledRepositoryAnalysis.builder()
                        .repositoryFullName(repoInfo.getFullName())
                        .repositoryUrl(repoInfo.getUrl())
                        .createdAt(LocalDateTime.now())
                        .user(user)
                        .build());

        scheduled.setRepositoryUrl(repoInfo.getUrl());
        scheduled.setEnabled(true);
        scheduled.setScoreDropThreshold(resolveScoreDropThreshold(scheduled.getUser()));
        scheduled.setEmailNotificationSent(false);
        scheduled.setEmailNotificationSentAt(null);
        scheduled.setLastError(null);

        return toScheduledRepositoryAnalysisResponse(scheduledRepositoryAnalysisRepository.save(scheduled));
    }

    public List<ScheduledRepositoryAnalysisResponse> getScheduledRepositoryAnalyses(User user) {
        return scheduledRepositoryAnalysisRepository.findTop20ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toScheduledRepositoryAnalysisResponse)
                .toList();
    }

    public ScheduledRepositoryAnalysisResponse runScheduledRepositoryAnalysis(Long id, User user) {
        ScheduledRepositoryAnalysis scheduled = scheduledRepositoryAnalysisRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Scheduled repository analysis not found"));

        runScheduledAnalysisAndUpdateState(scheduled, user);
        return toScheduledRepositoryAnalysisResponse(scheduledRepositoryAnalysisRepository.save(scheduled));
    }

    @Transactional
    public void runScheduledRepositoryAnalysisJob(Long id) {
        ScheduledRepositoryAnalysis scheduled = scheduledRepositoryAnalysisRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Scheduled repository analysis not found"));

        if (!Boolean.TRUE.equals(scheduled.getEnabled())) {
            return;
        }

        runScheduledAnalysisAndUpdateState(scheduled, scheduled.getUser());
        scheduledRepositoryAnalysisRepository.save(scheduled);
    }

    public List<Long> getEnabledScheduledRepositoryAnalysisIds() {
        return scheduledRepositoryAnalysisRepository.findByEnabledTrue()
                .stream()
                .sorted(Comparator.comparing(
                        ScheduledRepositoryAnalysis::getLastRunAt,
                        Comparator.nullsFirst(Comparator.naturalOrder())
                ))
                .map(ScheduledRepositoryAnalysis::getId)
                .toList();
    }

    private void runScheduledAnalysisAndUpdateState(ScheduledRepositoryAnalysis scheduled, User user) {
        Integer oldScore = scheduled.getLastScore();

        try {
            RepositoryReportResponse report = saveReportFromUrl(scheduled.getRepositoryUrl(), user);
            scheduled.setRepositoryFullName(report.getRepositoryFullName());
            scheduled.setRepositoryUrl(report.getRepositoryUrl());
            scheduled.setPreviousScore(oldScore);
            scheduled.setLastScore(report.getScore());
            scheduled.setScoreDelta(oldScore == null ? null : report.getScore() - oldScore);
            scheduled.setLastGrade(report.getGrade());
            scheduled.setLastRunAt(LocalDateTime.now());
            scheduled.setLastError(null);
            updateScheduledAnalysisAlert(scheduled);
            maybeSendScoreDropEmail(scheduled);
        } catch (RuntimeException exception) {
            scheduled.setLastRunAt(LocalDateTime.now());
            scheduled.setLastError(exception.getMessage());
            scheduled.setAlertTriggered(false);
            scheduled.setEmailNotificationSent(false);
            scheduled.setEmailNotificationSentAt(null);
            scheduled.setNotificationMessage("Scheduled analysis failed for " + scheduled.getRepositoryFullName() + ": " + exception.getMessage());
        }
    }

    private void updateScheduledAnalysisAlert(ScheduledRepositoryAnalysis scheduled) {
        Integer delta = scheduled.getScoreDelta();
        Integer threshold = scheduled.getScoreDropThreshold() == null ? 10 : scheduled.getScoreDropThreshold();

        if (delta != null && delta <= -threshold) {
            scheduled.setAlertTriggered(true);
            scheduled.setNotificationMessage(
                    scheduled.getRepositoryFullName() + " dropped " + Math.abs(delta)
                            + " points since the previous scheduled analysis."
            );
            return;
        }

        scheduled.setAlertTriggered(false);
        scheduled.setScoreDropThreshold(resolveScoreDropThreshold(scheduled.getUser()));
        scheduled.setEmailNotificationSent(false);
        scheduled.setEmailNotificationSentAt(null);
        scheduled.setNotificationMessage(null);
    }

    private void maybeSendScoreDropEmail(ScheduledRepositoryAnalysis scheduled) {
        if (!Boolean.TRUE.equals(scheduled.getAlertTriggered())) {
            return;
        }

        User user = scheduled.getUser();
        if (user != null && Boolean.FALSE.equals(user.getEmailNotificationsEnabled())) {
            scheduled.setEmailNotificationSent(false);
            scheduled.setEmailNotificationSentAt(null);
            return;
        }

        boolean sent = emailNotificationService.sendScoreDropAlert(scheduled);
        scheduled.setEmailNotificationSent(sent);
        scheduled.setEmailNotificationSentAt(sent ? LocalDateTime.now() : null);

        if (sent && scheduled.getNotificationMessage() != null) {
            scheduled.setNotificationMessage(scheduled.getNotificationMessage() + " Email notification sent.");
        }
    }

    public NotificationSettingsResponse getNotificationSettings(User user) {
        return NotificationSettingsResponse.builder()
                .emailNotificationsEnabled(!Boolean.FALSE.equals(user.getEmailNotificationsEnabled()))
                .scoreDropNotificationThreshold(resolveScoreDropThreshold(user))
                .recipientEmail(user.getEmail())
                .build();
    }

    public NotificationSettingsResponse updateNotificationSettings(NotificationSettingsRequest request, User user) {
        user.setEmailNotificationsEnabled(Boolean.TRUE.equals(request.getEmailNotificationsEnabled()));
        user.setScoreDropNotificationThreshold(request.getScoreDropNotificationThreshold());
        User savedUser = userRepository.save(user);

        scheduledRepositoryAnalysisRepository.findTop20ByUserOrderByCreatedAtDesc(savedUser)
                .forEach(scheduled -> {
                    scheduled.setScoreDropThreshold(savedUser.getScoreDropNotificationThreshold());
                    scheduledRepositoryAnalysisRepository.save(scheduled);
                });

        return getNotificationSettings(savedUser);
    }

    private Integer resolveScoreDropThreshold(User user) {
        Integer threshold = user == null ? null : user.getScoreDropNotificationThreshold();
        return threshold == null ? 10 : threshold;
    }

    public void deleteScheduledRepositoryAnalysis(Long id, User user) {
        ScheduledRepositoryAnalysis scheduled = scheduledRepositoryAnalysisRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Scheduled repository analysis not found"));
        scheduledRepositoryAnalysisRepository.delete(scheduled);
    }

    private RepositoryReportResponse saveReportFromUrl(String repositoryUrl, User user) {
        GitHubRepoInfo repo = extractOwnerAndRepo(repositoryUrl);
        return saveReport(repo.owner(), repo.repo(), user);
    }

    private ScheduledRepositoryAnalysisResponse toScheduledRepositoryAnalysisResponse(ScheduledRepositoryAnalysis scheduled) {
        return ScheduledRepositoryAnalysisResponse.builder()
                .id(scheduled.getId())
                .repositoryFullName(scheduled.getRepositoryFullName())
                .repositoryUrl(scheduled.getRepositoryUrl())
                .enabled(scheduled.getEnabled())
                .createdAt(scheduled.getCreatedAt())
                .lastRunAt(scheduled.getLastRunAt())
                .lastScore(scheduled.getLastScore())
                .previousScore(scheduled.getPreviousScore())
                .scoreDelta(scheduled.getScoreDelta())
                .lastGrade(scheduled.getLastGrade())
                .scoreDropThreshold(scheduled.getScoreDropThreshold())
                .alertTriggered(scheduled.getAlertTriggered())
                .emailNotificationSent(scheduled.getEmailNotificationSent())
                .emailNotificationSentAt(scheduled.getEmailNotificationSentAt())
                .notificationMessage(scheduled.getNotificationMessage())
                .lastError(scheduled.getLastError())
                .build();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> githubGetMap(String apiUrl) {
        return (Map<String, Object>) gitHubApiCache.get(apiUrl)
                .orElseGet(() -> {
                    Map<String, Object> response = githubGet(apiUrl).retrieve().body(Map.class);
                    if (response != null) {
                        gitHubApiCache.put(apiUrl, response);
                    }
                    return response;
                });
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> githubGetList(String apiUrl) {
        return (List<Map<String, Object>>) gitHubApiCache.get(apiUrl)
                .orElseGet(() -> {
                    List<Map<String, Object>> response = githubGet(apiUrl).retrieve().body(List.class);
                    if (response != null) {
                        gitHubApiCache.put(apiUrl, response);
                    }
                    return response;
                });
    }

    @SuppressWarnings("unchecked")
    private ComplexityScanResult scanRepositoryWithGitTree(String owner, String repo, String defaultBranch) {
        ComplexityCounter counter = new ComplexityCounter();
        List<Map<String, Object>> collectedFiles = new ArrayList<>();
        String branch = defaultBranch == null || defaultBranch.isBlank() ? "main" : defaultBranch;
        String apiUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/git/trees/" + branch + "?recursive=1";

        try {
            Map<String, Object> response = githubGetMap(apiUrl);
            List<Map<String, Object>> tree = response == null ? List.of() : (List<Map<String, Object>>) response.getOrDefault("tree", List.of());

            for (Map<String, Object> item : tree) {
                if (collectedFiles.size() >= MAX_COMPLEXITY_FILES) {
                    counter.limitReached = true;
                    break;
                }

                String type = (String) item.get("type");
                String itemPath = (String) item.get("path");

                if (itemPath == null || isIgnoredDirectory(itemPath)) {
                    continue;
                }

                if ("blob".equals(type)) {
                    collectedFiles.add(item);
                } else if ("tree".equals(type)) {
                    counter.directories++;
                }
            }

            if (Boolean.TRUE.equals(response == null ? null : response.get("truncated"))) {
                counter.limitReached = true;
            }

            return new ComplexityScanResult(collectedFiles, counter);
        } catch (Exception exception) {
            counter.usedContentsFallback = true;
            scanRepositoryContents(owner, repo, "", 0, collectedFiles, counter);
            return new ComplexityScanResult(collectedFiles, counter);
        }
    }

    private void scanRepositoryContents(
            String owner,
            String repo,
            String path,
            int depth,
            List<Map<String, Object>> collectedFiles,
            ComplexityCounter counter
    ) {
        if (depth > 4 || collectedFiles.size() >= MAX_COMPLEXITY_FILES) {
            counter.limitReached = true;
            return;
        }

        List<Map<String, Object>> contents = getRepositoryContents(owner, repo, path);

        for (Map<String, Object> item : contents) {
            if (collectedFiles.size() >= MAX_COMPLEXITY_FILES) {
                counter.limitReached = true;
                return;
            }

            String type = (String) item.get("type");
            String itemPath = (String) item.getOrDefault("path", item.get("name"));

            if ("file".equals(type)) {
                collectedFiles.add(item);
            } else if ("dir".equals(type) && !isIgnoredDirectory(itemPath)) {
                counter.directories++;
                scanRepositoryContents(owner, repo, itemPath, depth + 1, collectedFiles, counter);
            }
        }
    }

    private boolean isIgnoredDirectory(String path) {
        String normalized = path.toLowerCase(Locale.ROOT);
        return normalized.contains("node_modules")
                || normalized.contains("target")
                || normalized.contains("build")
                || normalized.contains("dist")
                || normalized.contains(".git");
    }

    private boolean isSourceFile(String path) {
        if (path == null) return false;
        String normalized = path.toLowerCase(Locale.ROOT);
        return SOURCE_FILE_EXTENSIONS.stream().anyMatch(normalized::endsWith);
    }

    private boolean isTestFile(String path) {
        if (path == null) return false;
        String normalized = path.toLowerCase(Locale.ROOT);
        return normalized.contains("test") || normalized.contains("spec");
    }

    private boolean isDocumentationFile(String path) {
        if (path == null) return false;
        String normalized = path.toLowerCase(Locale.ROOT);
        return normalized.endsWith(".md") || normalized.contains("docs/");
    }

    private boolean isConfigurationFile(String path) {
        if (path == null) return false;
        String normalized = path.toLowerCase(Locale.ROOT);
        return normalized.endsWith(".yml")
                || normalized.endsWith(".yaml")
                || normalized.endsWith(".json")
                || normalized.endsWith(".toml")
                || normalized.endsWith(".properties")
                || normalized.endsWith("dockerfile")
                || normalized.contains(".env.example");
    }

    private long asLong(Object value) {
        return value instanceof Number number ? number.longValue() : 0L;
    }

    private String buildMarkdownReport(
            RepositoryAnalysisResponse repoInfo,
            ProjectScoreResponse score,
            RepositoryRecommendationResponse recommendations,
            RepositoryComplexityResponse complexity
    ) {
        StringBuilder markdown = new StringBuilder();
        markdown.append("# GitHub Project Analysis Report\n\n");
        markdown.append("## Repository\n");
        markdown.append("- Name: ").append(repoInfo.getFullName()).append("\n");
        markdown.append("- URL: ").append(repoInfo.getUrl()).append("\n");
        markdown.append("- Main language: ").append(repoInfo.getMainLanguage()).append("\n");
        markdown.append("- Stars: ").append(repoInfo.getStars()).append("\n");
        markdown.append("- Forks: ").append(repoInfo.getForks()).append("\n\n");

        markdown.append("## Score\n");
        markdown.append("- Score: ").append(score.getScore()).append("/100\n");
        markdown.append("- Grade: ").append(score.getGrade()).append("\n\n");

        markdown.append("## Strengths\n");
        score.getStrengths().forEach(item -> markdown.append("- ").append(item).append("\n"));
        markdown.append("\n## Priority recommendations\n");
        score.getRecommendations().stream().limit(6).forEach(item -> markdown.append("- ").append(item).append("\n"));

        markdown.append("\n## Complexity snapshot\n");
        markdown.append("- Files scanned: ").append(complexity.getScannedFiles()).append("\n");
        markdown.append("- Directories scanned: ").append(complexity.getScannedDirectories()).append("\n");
        markdown.append("- Estimated source bytes: ").append(complexity.getEstimatedSourceBytes()).append("\n");
        markdown.append("- Test files: ").append(complexity.getTestFiles()).append("\n");
        markdown.append("- Documentation files: ").append(complexity.getDocumentationFiles()).append("\n");
        markdown.append("- Configuration files: ").append(complexity.getConfigurationFiles()).append("\n\n");

        markdown.append("## CV highlights\n");
        recommendations.getCvHighlights().forEach(item -> markdown.append("- ").append(item).append("\n"));

        return markdown.toString();
    }

    private record ComplexityScanResult(List<Map<String, Object>> files, ComplexityCounter counter) {
    }

    private static class ComplexityCounter {
        private int directories;
        private boolean limitReached;
        private boolean usedContentsFallback;
    }

    private RestClient.RequestHeadersSpec<?> githubGet(String apiUrl) {
        RestClient.RequestHeadersSpec<?> request = restClient.get()
                .uri(apiUrl)
                .header("Accept", "application/vnd.github+json")
                .header("X-GitHub-Api-Version", "2022-11-28")
                .header("User-Agent", "github-project-analyser");
    
        if (githubToken != null && !githubToken.isBlank()) {
            request = request.header("Authorization", "Bearer " + githubToken);
        }
    
        return request;
    }

    private GitHubRepoInfo extractOwnerAndRepo(String repositoryUrl) {
        GitHubRepositoryUrlParser.RepositorySlug slug = GitHubRepositoryUrlParser.parse(repositoryUrl);
        return new GitHubRepoInfo(slug.owner(), slug.repo());
    }

    private GitHubApiException toGitHubApiException(RestClientResponseException exception, String fallbackMessage) {
        int statusCode = exception.getStatusCode().value();

        if (statusCode == 403) {
            return new GitHubApiException(
                    "GitHub API rate limit or access limit reached. Add a GitHub token or try again later.",
                    org.springframework.http.HttpStatus.FORBIDDEN
            );
        }

        if (statusCode == 404) {
            return new GitHubApiException(
                    "GitHub repository or resource was not found. Check the owner, repository name, and visibility.",
                    org.springframework.http.HttpStatus.NOT_FOUND
            );
        }

        return new GitHubApiException(fallbackMessage, org.springframework.http.HttpStatus.BAD_GATEWAY);
    }

    private record GitHubRepoInfo(String owner, String repo) {}
}