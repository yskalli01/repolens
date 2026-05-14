package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContributorResponse {
    private String username;
    private String avatarUrl;
    private String profileUrl;
    private Integer contributions;
}