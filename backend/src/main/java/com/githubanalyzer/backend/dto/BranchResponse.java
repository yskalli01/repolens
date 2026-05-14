package com.githubanalyzer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BranchResponse {
    private String name;
    private String commitSha;
    private Boolean isProtected;
}