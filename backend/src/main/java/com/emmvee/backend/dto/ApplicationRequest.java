package com.emmvee.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ApplicationRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotBlank(message = "Resume URL is required")
    private String resumeUrl;

    @NotBlank(message = "Cover letter is required")
    private String coverLetter;

    public ApplicationRequest() {
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
}
