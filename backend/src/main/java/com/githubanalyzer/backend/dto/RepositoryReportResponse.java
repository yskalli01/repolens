package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryReportResponse {
    private String repositoryFullName;
    private String repositoryUrl;
    private LocalDateTime generatedAt;
    private int score;
    private String grade;
    private List<String> strengths;
    private List<String> recommendations;
    private List<String> cvHighlights;
    private RepositoryComplexityResponse complexity;
    private String markdown;
}
