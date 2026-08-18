package com.emmvee.backend.service;

import com.emmvee.backend.dto.ApplicationRequest;
import com.emmvee.backend.dto.ApplicationResponse;
import com.emmvee.backend.dto.ApplicationStatusRequest;
import com.emmvee.backend.entity.Application;
import com.emmvee.backend.entity.Job;
import com.emmvee.backend.entity.User;
import com.emmvee.backend.exception.JobNotFoundException;
import com.emmvee.backend.repository.ApplicationRepository;
import com.emmvee.backend.repository.JobRepository;
import com.emmvee.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            JobRepository jobRepository) {

        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    // APPLY FOR JOB
    public ApplicationResponse apply(
            String email,
            ApplicationRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() ->
                        new JobNotFoundException(
                                "Job not found with id: "
                                        + request.getJobId()
                        ));

        if (applicationRepository.existsByUserIdAndJobId(
                user.getId(),
                job.getId())) {

            throw new IllegalArgumentException(
                    "You have already applied for this job"
            );
        }

        Application application = new Application();

        application.setUser(user);
        application.setJob(job);
        application.setResumeUrl(request.getResumeUrl());
        application.setCoverLetter(request.getCoverLetter());

        Application savedApplication =
                applicationRepository.save(application);

        return mapToResponse(savedApplication);
    }

    // USER: GET MY APPLICATIONS
    public List<ApplicationResponse> getMyApplications(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return applicationRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ADMIN: GET ALL APPLICATIONS
    public List<ApplicationResponse> getAllApplications() {

        return applicationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ADMIN: UPDATE APPLICATION STATUS
    public ApplicationResponse updateApplicationStatus(
            Long id,
            ApplicationStatusRequest request) {

        Application application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Application not found with id: " + id
                                ));

        application.setStatus(request.getStatus());

        Application updatedApplication =
                applicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }

    // ENTITY -> RESPONSE DTO
    private ApplicationResponse mapToResponse(
            Application application) {

        return new ApplicationResponse(
                application.getId(),
                application.getUser().getId(),
                application.getUser().getName(),
                application.getJob().getId(),
                application.getJob().getTitle(),
                application.getResumeUrl(),
                application.getCoverLetter(),
                application.getStatus().name(),
                application.getAppliedAt()
        );
    }
}