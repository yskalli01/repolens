package com.githubanalyzer.backend.repository;

import com.githubanalyzer.backend.entity.RepositoryAnalysis;
import com.githubanalyzer.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositoryAnalysisRepository
        extends JpaRepository<RepositoryAnalysis, Long> {

    List<RepositoryAnalysis> findTop10ByUserOrderByAnalyzedAtDesc(User user);
}