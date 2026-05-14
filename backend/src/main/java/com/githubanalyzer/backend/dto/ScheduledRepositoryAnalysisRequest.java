package com.githubanalyzer.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ScheduledRepositoryAnalysisRequest {
    @NotBlank(message = "Repository URL is required")
    @Pattern(
            regexp = "^(https://github\\.com/[^/]+/[^/]+/?|git@github\\.com:[^/]+/[^/]+\\.git)$",
            message = "Repository URL must be a valid GitHub repository URL"
    )
    private String repositoryUrl;
}
