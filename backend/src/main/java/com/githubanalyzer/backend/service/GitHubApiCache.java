package com.githubanalyzer.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GitHubApiCache {
    private final ConcurrentHashMap<String, CacheEntry> entries = new ConcurrentHashMap<>();
    private final Clock clock;
    private final Duration ttl;

    public GitHubApiCache(
            Clock clock,
            @Value("${github.cache.ttl-seconds:300}") long ttlSeconds
    ) {
        this.clock = clock;
        this.ttl = Duration.ofSeconds(ttlSeconds);
    }

    public Optional<Object> get(String key) {
        CacheEntry entry = entries.get(key);

        if (entry == null) {
            return Optional.empty();
        }

        if (entry.createdAt().plus(ttl).isBefore(Instant.now(clock))) {
            entries.remove(key);
            return Optional.empty();
        }

        return Optional.of(entry.value());
    }

    public void put(String key, Object value) {
        entries.put(key, new CacheEntry(value, Instant.now(clock)));
    }

    public int size() {
        return entries.size();
    }

    public void clear() {
        entries.clear();
    }

    private record CacheEntry(Object value, Instant createdAt) {}
}
