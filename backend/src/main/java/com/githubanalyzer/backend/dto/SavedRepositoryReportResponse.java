package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedRepositoryReportResponse {
    private Long id;
    private String repositoryFullName;
    private String repositoryUrl;
    private Integer score;
    private String grade;
    private LocalDateTime generatedAt;
    private String markdown;
    private String shareId;
    private Integer scoreDeltaFromPrevious;
}
