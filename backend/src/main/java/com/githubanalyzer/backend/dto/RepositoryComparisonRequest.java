package com.githubanalyzer.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class RepositoryComparisonRequest {
    @NotNull(message = "Repository URLs are required")
    @Size(min = 2, max = 3, message = "Compare between 2 and 3 repositories")
    private List<@NotBlank(message = "Repository URL is required") @Pattern(
            regexp = "^(https?://github\\.com/[^/]+/[^/]+/?|git@github\\.com:[^/]+/[^/]+\\.git)$",
            message = "Repository URL must be a valid GitHub repository URL"
    ) String> repositoryUrls;
}
