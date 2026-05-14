package com.githubanalyzer.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RepositoryAnalysisResponse {
    private String name;
    private String fullName;
    private String description;
    private Integer stars;
    private Integer forks;
    private String mainLanguage;
    private String defaultBranch;
    private String url;
}