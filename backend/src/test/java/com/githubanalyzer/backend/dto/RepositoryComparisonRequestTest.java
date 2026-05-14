package com.githubanalyzer.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class RepositoryComparisonRequestTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void acceptsTwoRepositoryUrls() {
        RepositoryComparisonRequest request = new RepositoryComparisonRequest();
        request.setRepositoryUrls(List.of(
                "https://github.com/vercel/next.js",
                "git@github.com:spring-projects/spring-boot.git"
        ));

        Set<ConstraintViolation<RepositoryComparisonRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void rejectsSingleRepositoryUrl() {
        RepositoryComparisonRequest request = new RepositoryComparisonRequest();
        request.setRepositoryUrls(List.of("https://github.com/vercel/next.js"));

        Set<ConstraintViolation<RepositoryComparisonRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }
}
