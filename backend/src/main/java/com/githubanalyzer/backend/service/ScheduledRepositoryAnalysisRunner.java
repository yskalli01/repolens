package com.githubanalyzer.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ScheduledRepositoryAnalysisRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScheduledRepositoryAnalysisRunner.class);

    private final RepositoryAnalysisService repositoryAnalysisService;
    private final int maxRepositoriesPerRun;

    public ScheduledRepositoryAnalysisRunner(
            RepositoryAnalysisService repositoryAnalysisService,
            @Value("${app.scheduled-analysis.max-per-run:5}") int maxRepositoriesPerRun
    ) {
        this.repositoryAnalysisService = repositoryAnalysisService;
        this.maxRepositoriesPerRun = maxRepositoriesPerRun;
    }

    @Scheduled(cron = "${app.scheduled-analysis.cron:0 0 */6 * * *}")
    public void runDueScheduledAnalyses() {
        List<Long> scheduledIds = repositoryAnalysisService.getEnabledScheduledRepositoryAnalysisIds()
                .stream()
                .limit(maxRepositoriesPerRun)
                .toList();

        for (Long scheduledId : scheduledIds) {
            try {
                repositoryAnalysisService.runScheduledRepositoryAnalysisJob(scheduledId);
            } catch (RuntimeException exception) {
                LOGGER.warn("Scheduled repository analysis {} failed", scheduledId, exception);
            }
        }
    }
}
