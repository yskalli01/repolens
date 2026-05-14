package com.githubanalyzer.backend.exception;

import org.springframework.http.HttpStatus;

public class GitHubApiException extends RuntimeException {

    private final HttpStatus status;

    public GitHubApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
