package com.githubanalyzer.backend.service;

import com.githubanalyzer.backend.entity.ScheduledRepositoryAnalysis;
import com.githubanalyzer.backend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailNotificationService.class);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String fromAddress;

    public EmailNotificationService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${app.notifications.email.enabled:false}") boolean enabled,
            @Value("${app.notifications.email.from:no-reply@github-analyser.local}") String fromAddress
    ) {
        this.mailSender = mailSenderProvider.getIfAvailable();
        this.enabled = enabled;
        this.fromAddress = fromAddress;
    }

    public boolean sendScoreDropAlert(ScheduledRepositoryAnalysis scheduled) {
        if (!enabled) {
            LOGGER.info("Email notifications are disabled. Skipping score-drop alert for {}", scheduled.getRepositoryFullName());
            return false;
        }

        if (mailSender == null) {
            LOGGER.warn("Email notifications are enabled, but no JavaMailSender is configured.");
            return false;
        }

        User user = scheduled.getUser();
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            LOGGER.warn("Scheduled analysis {} has no user email for notifications", scheduled.getId());
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(user.getEmail());
            message.setSubject("Repository score dropped: " + scheduled.getRepositoryFullName());
            message.setText(buildScoreDropEmail(scheduled));
            mailSender.send(message);
            return true;
        } catch (MailException exception) {
            LOGGER.warn("Failed to send score-drop alert for scheduled analysis {}", scheduled.getId(), exception);
            return false;
        }
    }

    private String buildScoreDropEmail(ScheduledRepositoryAnalysis scheduled) {
        StringBuilder body = new StringBuilder();
        body.append("Your scheduled GitHub repository analysis detected a score drop.\n\n");
        body.append("Repository: ").append(scheduled.getRepositoryFullName()).append('\n');
        body.append("URL: ").append(scheduled.getRepositoryUrl()).append('\n');
        body.append("Previous score: ").append(scheduled.getPreviousScore()).append("/100\n");
        body.append("Current score: ").append(scheduled.getLastScore()).append("/100\n");
        body.append("Delta: ").append(scheduled.getScoreDelta()).append(" points\n");
        body.append("Grade: ").append(scheduled.getLastGrade()).append("\n\n");
        body.append("Open the dashboard to review the saved report and improvement suggestions.");
        return body.toString();
    }
}
