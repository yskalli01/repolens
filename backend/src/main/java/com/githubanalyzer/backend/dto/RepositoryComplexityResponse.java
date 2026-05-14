package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryComplexityResponse {
    private int scannedFiles;
    private int scannedDirectories;
    private long estimatedSourceBytes;
    private int testFiles;
    private int documentationFiles;
    private int configurationFiles;
    private List<String> largestFiles;
    private String sourceScanStrategy;
    private List<String> notes;
}
