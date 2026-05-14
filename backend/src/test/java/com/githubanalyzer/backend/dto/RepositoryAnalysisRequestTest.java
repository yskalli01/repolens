package com.githubanalyzer.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class RepositoryAnalysisRequestTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void acceptsValidGitHubRepositoryUrl() {
        RepositoryAnalysisRequest request = new RepositoryAnalysisRequest();
        request.setRepositoryUrl("https://github.com/vercel/next.js");

        Set<ConstraintViolation<RepositoryAnalysisRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void rejectsNonGitHubUrl() {
        RepositoryAnalysisRequest request = new RepositoryAnalysisRequest();
        request.setRepositoryUrl("https://example.com/not/a-github-repo");

        Set<ConstraintViolation<RepositoryAnalysisRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }

    @Test
    void rejectsBlankRepositoryUrl() {
        RepositoryAnalysisRequest request = new RepositoryAnalysisRequest();
        request.setRepositoryUrl("");

        Set<ConstraintViolation<RepositoryAnalysisRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }
}
