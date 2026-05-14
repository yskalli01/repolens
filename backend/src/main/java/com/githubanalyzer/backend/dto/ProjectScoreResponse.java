package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProjectScoreResponse {
    private Integer score;
    private String grade;
    private List<String> strengths;
    private List<String> recommendations;
}