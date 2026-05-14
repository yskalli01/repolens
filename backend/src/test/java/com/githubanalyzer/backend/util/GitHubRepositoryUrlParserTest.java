package com.githubanalyzer.backend.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class GitHubRepositoryUrlParserTest {

    @Test
    void parsesHttpsRepositoryUrl() {
        GitHubRepositoryUrlParser.RepositorySlug slug = GitHubRepositoryUrlParser.parse(
                "https://github.com/vercel/next.js"
        );

        assertThat(slug.owner()).isEqualTo("vercel");
        assertThat(slug.repo()).isEqualTo("next.js");
    }

    @Test
    void parsesGitRepositoryUrl() {
        GitHubRepositoryUrlParser.RepositorySlug slug = GitHubRepositoryUrlParser.parse(
                "git@github.com:spring-projects/spring-boot.git"
        );

        assertThat(slug.owner()).isEqualTo("spring-projects");
        assertThat(slug.repo()).isEqualTo("spring-boot");
    }

    @Test
    void rejectsInvalidRepositoryUrl() {
        assertThatThrownBy(() -> GitHubRepositoryUrlParser.parse("https://example.com/test"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid GitHub repository URL");
    }
}
