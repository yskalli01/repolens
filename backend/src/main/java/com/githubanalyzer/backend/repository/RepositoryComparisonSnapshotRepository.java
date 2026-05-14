package com.githubanalyzer.backend.repository;

import com.githubanalyzer.backend.entity.RepositoryComparisonSnapshot;
import com.githubanalyzer.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositoryComparisonSnapshotRepository extends JpaRepository<RepositoryComparisonSnapshot, Long> {
    List<RepositoryComparisonSnapshot> findTop10ByUserOrderByComparedAtDesc(User user);
}
