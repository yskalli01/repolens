package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReadmeAnalysisResponse {
    private Boolean exists;
    private String content;
    private Integer characterCount;
    private Integer wordCount;
    private Boolean hasInstallationSection;
    private Boolean hasUsageSection;
    private Boolean hasLicenseSection;
}