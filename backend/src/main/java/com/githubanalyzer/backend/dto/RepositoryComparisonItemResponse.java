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
public class RepositoryComparisonItemResponse {
    private String fullName;
    private String url;
    private Integer stars;
    private Integer forks;
    private String mainLanguage;
    private Integer score;
    private String grade;
    private List<String> strengths;
    private List<String> recommendations;
}
