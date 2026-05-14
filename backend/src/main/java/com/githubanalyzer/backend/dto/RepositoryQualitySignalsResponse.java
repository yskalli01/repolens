package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RepositoryQualitySignalsResponse {
    private Boolean hasCiConfig;
    private Boolean hasDockerSupport;
    private Boolean hasEnvExample;
    private Boolean hasTests;
    private Boolean hasLicenseFile;
    private Boolean hasIgnoreFile;
    private List<String> detectedFiles;
}
