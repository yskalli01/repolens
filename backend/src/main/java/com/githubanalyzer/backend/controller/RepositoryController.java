package com.githubanalyzer.backend.controller;

import com.githubanalyzer.backend.dto.RepositoryAnalysisRequest;
import com.githubanalyzer.backend.dto.RepositoryAnalysisResponse;
import com.githubanalyzer.backend.dto.RepositoryComparisonRequest;
import com.githubanalyzer.backend.dto.RepositoryComparisonResponse;
import com.githubanalyzer.backend.dto.RepositoryComparisonHistoryResponse;
import com.githubanalyzer.backend.dto.RepositoryRecommendationResponse;
import com.githubanalyzer.backend.dto.RepositoryComplexityResponse;
import com.githubanalyzer.backend.dto.RepositoryReportResponse;
import com.githubanalyzer.backend.dto.SavedRepositoryReportResponse;
import com.githubanalyzer.backend.dto.RepositoryReportTrendPointResponse;
import com.githubanalyzer.backend.dto.ScheduledRepositoryAnalysisRequest;
import com.githubanalyzer.backend.dto.ScheduledRepositoryAnalysisResponse;
import com.githubanalyzer.backend.dto.NotificationSettingsRequest;
import com.githubanalyzer.backend.dto.NotificationSettingsResponse;
import com.githubanalyzer.backend.dto.FullRepositoryAnalysisResponse;
import com.githubanalyzer.backend.dto.RepositoryQualitySignalsResponse;
import com.githubanalyzer.backend.dto.TechDetectionResponse;
import com.githubanalyzer.backend.entity.User;
import com.githubanalyzer.backend.service.RepositoryAnalysisService;
import com.githubanalyzer.backend.service.PdfReportService;
import com.githubanalyzer.backend.dto.BranchResponse;
import com.githubanalyzer.backend.dto.ContributorResponse;
import com.githubanalyzer.backend.dto.LanguageStatResponse;
import com.githubanalyzer.backend.dto.ProjectScoreResponse;
import com.githubanalyzer.backend.dto.ReadmeAnalysisResponse;
import com.githubanalyzer.backend.dto.RepositoryAnalysisHistoryResponse;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repositories")
public class RepositoryController {

    private final RepositoryAnalysisService analysisService;
    private final PdfReportService pdfReportService;

    public RepositoryController(
            RepositoryAnalysisService analysisService,
            PdfReportService pdfReportService
    ) {
        this.analysisService = analysisService;
        this.pdfReportService = pdfReportService;
    }

    @PostMapping("/analyze")
    public RepositoryAnalysisResponse analyze(
            @Valid @RequestBody RepositoryAnalysisRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.analyze(request.getRepositoryUrl(), user);
    }


    @PostMapping("/analyze/full")
    public FullRepositoryAnalysisResponse analyzeFull(
            @Valid @RequestBody RepositoryAnalysisRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.analyzeFull(request.getRepositoryUrl(), user);
    }

    @GetMapping("/{owner}/{repo}/languages")
    public List<LanguageStatResponse> getLanguages(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.getLanguages(owner, repo);
    }

    @GetMapping("/history")
    public List<RepositoryAnalysisHistoryResponse> getHistory(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.getHistory(user);
    }

    @DeleteMapping("/history/{id}")
    public void deleteHistoryItem(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        analysisService.deleteHistoryItem(id, user);
    }

    @GetMapping("/{owner}/{repo}/contributors")
    public List<ContributorResponse> getContributors(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.getContributors(owner, repo);
    }

    @GetMapping("/{owner}/{repo}/branches")
    public List<BranchResponse> getBranches(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.getBranches(owner, repo);
    }

    @GetMapping("/{owner}/{repo}/readme")
    public ReadmeAnalysisResponse getReadmeAnalysis(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.getReadmeAnalysis(owner, repo);
    }

    @GetMapping("/{owner}/{repo}/technologies")
    public TechDetectionResponse detectTechnologies(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.detectTechnologies(owner, repo);
    }


    @GetMapping("/{owner}/{repo}/quality-signals")
    public RepositoryQualitySignalsResponse getQualitySignals(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.getQualitySignals(owner, repo);
    }

    @PostMapping("/compare")
    public RepositoryComparisonResponse compareRepositories(
            @Valid @RequestBody RepositoryComparisonRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.compareRepositories(request.getRepositoryUrls(), user);
    }

    @GetMapping("/compare/history")
    public List<RepositoryComparisonHistoryResponse> getComparisonHistory(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return analysisService.getComparisonHistory(user);
    }

    @GetMapping("/{owner}/{repo}/recommendations")
    public RepositoryRecommendationResponse getRecommendations(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.getRecommendations(owner, repo);
    }

    @GetMapping("/{owner}/{repo}/complexity")
    public RepositoryComplexityResponse getComplexity(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.getComplexity(owner, repo);
    }

    @GetMapping("/{owner}/{repo}/report")
    public RepositoryReportResponse getReport(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.buildReport(owner, repo);
    }


    @GetMapping(value = "/{owner}/{repo}/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getReportPdf(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        RepositoryReportResponse report = analysisService.buildReport(owner, repo);
        byte[] pdf = pdfReportService.buildSimplePdf(
                report.getRepositoryFullName() + " analysis report",
                report.getMarkdown()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + owner + "-" + repo + "-analysis-report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/{owner}/{repo}/report/save")
    public RepositoryReportResponse saveReport(
            @PathVariable String owner,
            @PathVariable String repo,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.saveReport(owner, repo, user);
    }

    @GetMapping("/reports/saved")
    public List<SavedRepositoryReportResponse> getSavedReports(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return analysisService.getSavedReports(user);
    }


    @GetMapping(value = "/reports/saved/{id}/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getSavedReportPdf(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        var snapshot = analysisService.getSavedReportSnapshot(id, user);
        byte[] pdf = pdfReportService.buildSimplePdf(
                snapshot.getRepositoryFullName() + " saved analysis report",
                snapshot.getMarkdown()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + snapshot.getRepositoryFullName().replace("/", "-") + "-saved-report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping(value = "/reports/shared/{shareId}/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getSharedReportPdf(@PathVariable String shareId) {
        var snapshot = analysisService.getSharedReportSnapshot(shareId);
        byte[] pdf = pdfReportService.buildSimplePdf(
                snapshot.getRepositoryFullName() + " shared analysis report",
                snapshot.getMarkdown()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + snapshot.getRepositoryFullName().replace("/", "-") + "-shared-report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/reports/saved/trends")
    public List<RepositoryReportTrendPointResponse> getSavedReportTrend(
            @RequestParam String repositoryFullName,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.getSavedReportTrend(repositoryFullName, user);
    }

    @GetMapping("/reports/saved/{id}")
    public SavedRepositoryReportResponse getSavedReport(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.getSavedReport(id, user);
    }

    @PostMapping("/reports/saved/{id}/share")
    public SavedRepositoryReportResponse refreshSavedReportShareLink(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.refreshSavedReportShareLink(id, user);
    }

    @GetMapping("/reports/shared/{shareId}")
    public SavedRepositoryReportResponse getSharedReport(@PathVariable String shareId) {
        return analysisService.getSharedReport(shareId);
    }

    @DeleteMapping("/reports/saved/{id}")
    public ResponseEntity<Void> deleteSavedReport(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        analysisService.deleteSavedReport(id, user);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/notification-settings")
    public NotificationSettingsResponse getNotificationSettings(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return analysisService.getNotificationSettings(user);
    }

    @PutMapping("/notification-settings")
    public NotificationSettingsResponse updateNotificationSettings(
            @Valid @RequestBody NotificationSettingsRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.updateNotificationSettings(request, user);
    }


    @PostMapping("/scheduled")
    public ScheduledRepositoryAnalysisResponse scheduleRepositoryAnalysis(
            @Valid @RequestBody ScheduledRepositoryAnalysisRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.scheduleRepositoryAnalysis(request.getRepositoryUrl(), user);
    }

    @GetMapping("/scheduled")
    public List<ScheduledRepositoryAnalysisResponse> getScheduledRepositoryAnalyses(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return analysisService.getScheduledRepositoryAnalyses(user);
    }

    @PostMapping("/scheduled/{id}/run")
    public ScheduledRepositoryAnalysisResponse runScheduledRepositoryAnalysis(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return analysisService.runScheduledRepositoryAnalysis(id, user);
    }

    @DeleteMapping("/scheduled/{id}")
    public ResponseEntity<Void> deleteScheduledRepositoryAnalysis(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        analysisService.deleteScheduledRepositoryAnalysis(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{owner}/{repo}/score")
    public ProjectScoreResponse calculateProjectScore(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        return analysisService.calculateProjectScore(owner, repo);
    }
}