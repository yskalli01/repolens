package com.githubanalyzer.backend.util;

public final class GitHubRepositoryUrlParser {

    private GitHubRepositoryUrlParser() {}

    public static RepositorySlug parse(String repositoryUrl) {
        if (repositoryUrl == null || repositoryUrl.isBlank()) {
            throw new IllegalArgumentException("Repository URL is required");
        }

        String cleanUrl = repositoryUrl.trim()
                .replaceFirst("^https?://github\\.com/", "")
                .replaceFirst("^git@github\\.com:", "")
                .replaceFirst("\\.git$", "")
                .replaceAll("/+$", "");

        String[] parts = cleanUrl.split("/");

        if (parts.length != 2 || parts[0].isBlank() || parts[1].isBlank()) {
            throw new IllegalArgumentException("Invalid GitHub repository URL");
        }

        return new RepositorySlug(parts[0], parts[1]);
    }

    public record RepositorySlug(String owner, String repo) {}
}
