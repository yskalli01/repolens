package com.githubanalyzer.backend.repository;

import com.githubanalyzer.backend.entity.ScheduledRepositoryAnalysis;
import com.githubanalyzer.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScheduledRepositoryAnalysisRepository extends JpaRepository<ScheduledRepositoryAnalysis, Long> {
    List<ScheduledRepositoryAnalysis> findTop20ByUserOrderByCreatedAtDesc(User user);
    List<ScheduledRepositoryAnalysis> findByEnabledTrue();
    Optional<ScheduledRepositoryAnalysis> findByIdAndUser(Long id, User user);
    Optional<ScheduledRepositoryAnalysis> findByUserAndRepositoryFullName(User user, String repositoryFullName);
}
