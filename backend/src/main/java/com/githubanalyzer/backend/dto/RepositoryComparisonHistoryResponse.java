package com.githubanalyzer.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepositoryComparisonHistoryResponse {
    private Long id;
    private String winnerFullName;
    private Integer winnerScore;
    private LocalDateTime comparedAt;
    private String comparedRepositories;
    private String summary;
}
