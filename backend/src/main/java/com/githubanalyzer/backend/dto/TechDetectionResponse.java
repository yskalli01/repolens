package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TechDetectionResponse {
    private List<String> packageManagers;
    private List<String> frameworks;
    private List<String> buildTools;
    private List<String> detectedFiles;
    private List<String> dependencies;
}