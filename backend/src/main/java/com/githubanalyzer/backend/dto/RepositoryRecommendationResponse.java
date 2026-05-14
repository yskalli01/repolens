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
public class RepositoryRecommendationResponse {
    private String repositoryFullName;
    private List<String> priorityFixes;
    private List<String> cvHighlights;
    private List<String> nextMilestones;
}
