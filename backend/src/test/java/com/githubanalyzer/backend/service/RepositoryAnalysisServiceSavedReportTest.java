package com.githubanalyzer.backend.service;

import com.githubanalyzer.backend.entity.RepositoryReportSnapshot;
import com.githubanalyzer.backend.entity.User;
import com.githubanalyzer.backend.repository.RepositoryAnalysisRepository;
import com.githubanalyzer.backend.repository.RepositoryReportSnapshotRepository;
import com.githubanalyzer.backend.repository.RepositoryComparisonSnapshotRepository;
import com.githubanalyzer.backend.repository.ScheduledRepositoryAnalysisRepository;
import com.githubanalyzer.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RepositoryAnalysisServiceSavedReportTest {

    private final RepositoryAnalysisRepository analysisRepository = mock(RepositoryAnalysisRepository.class);
    private final RepositoryReportSnapshotRepository reportSnapshotRepository = mock(RepositoryReportSnapshotRepository.class);
    private final RepositoryComparisonSnapshotRepository comparisonSnapshotRepository = mock(RepositoryComparisonSnapshotRepository.class);
    private final ScheduledRepositoryAnalysisRepository scheduledRepositoryAnalysisRepository = mock(ScheduledRepositoryAnalysisRepository.class);
    private final GitHubApiCache gitHubApiCache = mock(GitHubApiCache.class);
    private final EmailNotificationService emailNotificationService = mock(EmailNotificationService.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final RepositoryAnalysisService service = new RepositoryAnalysisService(
            analysisRepository,
            reportSnapshotRepository,
            comparisonSnapshotRepository,
            scheduledRepositoryAnalysisRepository,
            gitHubApiCache,
            emailNotificationService,
            userRepository
    );

    @Test
    void deletesSavedReportOwnedByUser() {
        User user = User.builder().id(1L).email("user@example.com").password("password").build();
        RepositoryReportSnapshot snapshot = RepositoryReportSnapshot.builder()
                .id(10L)
                .shareId("share-id")
                .user(user)
                .build();

        when(reportSnapshotRepository.findByIdAndUser(10L, user)).thenReturn(Optional.of(snapshot));

        service.deleteSavedReport(10L, user);

        verify(reportSnapshotRepository).delete(snapshot);
    }

    @Test
    void createsShareIdWhenSavedReportDoesNotHaveOne() {
        User user = User.builder().id(1L).email("user@example.com").password("password").build();
        RepositoryReportSnapshot snapshot = RepositoryReportSnapshot.builder()
                .id(10L)
                .repositoryFullName("owner/repo")
                .repositoryUrl("https://github.com/owner/repo")
                .score(90)
                .grade("A")
                .markdown("# Report")
                .user(user)
                .build();

        when(reportSnapshotRepository.findByIdAndUser(10L, user)).thenReturn(Optional.of(snapshot));
        when(reportSnapshotRepository.save(snapshot)).thenReturn(snapshot);

        service.refreshSavedReportShareLink(10L, user);

        verify(reportSnapshotRepository).save(snapshot);
    }
}
