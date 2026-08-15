package com.emmvee.backend.dto;

import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long id;
    private Long userId;
    private String userName;
    private Long jobId;
    private String jobTitle;
    private String resumeUrl;
    private String coverLetter;
    private String status;
    private LocalDateTime appliedAt;

    public ApplicationResponse(
            Long id,
            Long userId,
            String userName,
            Long jobId,
            String jobTitle,
            String resumeUrl,
            String coverLetter,
            String status,
            LocalDateTime appliedAt) {

        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.resumeUrl = resumeUrl;
        this.coverLetter = coverLetter;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
}
