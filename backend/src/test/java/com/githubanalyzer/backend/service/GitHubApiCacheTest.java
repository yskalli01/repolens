package com.githubanalyzer.backend.service;

import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class GitHubApiCacheTest {
    @Test
    void storesAndReturnsCachedValueBeforeTtlExpires() {
        GitHubApiCache cache = new GitHubApiCache(
                Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC),
                300
        );

        cache.put("repo", "value");

        assertTrue(cache.get("repo").isPresent());
        assertEquals("value", cache.get("repo").get());
    }

    @Test
    void returnsEmptyWhenKeyDoesNotExist() {
        GitHubApiCache cache = new GitHubApiCache(
                Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC),
                300
        );

        assertTrue(cache.get("missing").isEmpty());
    }
}
