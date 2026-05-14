package com.githubanalyzer.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationSettingsRequest {
    @NotNull(message = "Email notification preference is required")
    private Boolean emailNotificationsEnabled;

    @NotNull(message = "Score drop threshold is required")
    @Min(value = 1, message = "Score drop threshold must be at least 1")
    @Max(value = 100, message = "Score drop threshold cannot be greater than 100")
    private Integer scoreDropNotificationThreshold;
}
