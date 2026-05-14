package com.githubanalyzer.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RepositoryAnalysisHistoryResponse {
    private Long id;
    private String repositoryUrl;
    private String fullName;
    private String description;
    private Integer stars;
    private Integer forks;
    private String mainLanguage;
    private String url;
    private LocalDateTime analyzedAt;
}