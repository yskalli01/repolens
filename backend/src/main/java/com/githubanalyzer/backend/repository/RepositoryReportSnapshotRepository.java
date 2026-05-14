package com.githubanalyzer.backend.repository;

import com.githubanalyzer.backend.entity.RepositoryReportSnapshot;
import com.githubanalyzer.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RepositoryReportSnapshotRepository extends JpaRepository<RepositoryReportSnapshot, Long> {
    List<RepositoryReportSnapshot> findTop10ByUserOrderByGeneratedAtDesc(User user);
    Optional<RepositoryReportSnapshot> findByIdAndUser(Long id, User user);
    Optional<RepositoryReportSnapshot> findByShareId(String shareId);
    List<RepositoryReportSnapshot> findTop20ByUserAndRepositoryFullNameOrderByGeneratedAtDesc(User user, String repositoryFullName);
}
