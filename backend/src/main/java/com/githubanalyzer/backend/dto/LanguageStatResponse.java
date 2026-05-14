package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LanguageStatResponse {
    private String language;
    private Long bytes;
    private Double percentage;
}