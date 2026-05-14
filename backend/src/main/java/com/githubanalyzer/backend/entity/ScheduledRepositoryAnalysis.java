package com.githubanalyzer.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "scheduled_repository_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduledRepositoryAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String repositoryFullName;

    private String repositoryUrl;

    @Builder.Default
    private Boolean enabled = true;

    private LocalDateTime createdAt;

    private LocalDateTime lastRunAt;

    private Integer lastScore;

    private Integer previousScore;

    private Integer scoreDelta;

    private String lastGrade;

    @Builder.Default
    private Integer scoreDropThreshold = 10;

    @Builder.Default
    private Boolean alertTriggered = false;

    @Builder.Default
    private Boolean emailNotificationSent = false;

    private LocalDateTime emailNotificationSentAt;

    @Column(columnDefinition = "TEXT")
    private String notificationMessage;

    @Column(columnDefinition = "TEXT")
    private String lastError;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
