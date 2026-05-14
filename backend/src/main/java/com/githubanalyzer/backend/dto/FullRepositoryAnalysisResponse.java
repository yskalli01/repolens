package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FullRepositoryAnalysisResponse {
    private RepositoryAnalysisResponse repository;
    private List<LanguageStatResponse> languages;
    private List<ContributorResponse> contributors;
    private List<BranchResponse> branches;
    private ReadmeAnalysisResponse readme;
    private TechDetectionResponse technologies;
    private RepositoryQualitySignalsResponse qualitySignals;
    private ProjectScoreResponse score;
}
