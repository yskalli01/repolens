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
public class ScheduledRepositoryAnalysisResponse {
    private Long id;
    private String repositoryFullName;
    private String repositoryUrl;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime lastRunAt;
    private Integer lastScore;
    private Integer previousScore;
    private Integer scoreDelta;
    private String lastGrade;
    private Integer scoreDropThreshold;
    private Boolean alertTriggered;
    private Boolean emailNotificationSent;
    private LocalDateTime emailNotificationSentAt;
    private String notificationMessage;
    private String lastError;
}
