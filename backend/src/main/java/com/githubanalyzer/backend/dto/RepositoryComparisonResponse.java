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
public class RepositoryComparisonResponse {
    private List<RepositoryComparisonItemResponse> repositories;
    private String winnerFullName;
    private Integer winnerScore;
    private List<String> summary;
}
