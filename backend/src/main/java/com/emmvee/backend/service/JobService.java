package com.emmvee.backend.service;

import com.emmvee.backend.dto.JobRequest;
import com.emmvee.backend.dto.JobResponse;
import com.emmvee.backend.entity.Job;
import com.emmvee.backend.exception.JobNotFoundException;
import com.emmvee.backend.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class JobService {

    private static final Logger logger =
            LoggerFactory.getLogger(JobService.class);

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "id",
            "title",
            "location",
            "department",
            "employmentType"
    );

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // CREATE
    public JobResponse createJob(JobRequest request) {

        logger.info("Creating job with title: {}", request.getTitle());

        Job job = new Job();

        job.setTitle(request.getTitle());
        job.setLocation(request.getLocation());
        job.setDepartment(request.getDepartment());
        job.setEmploymentType(request.getEmploymentType());

        Job savedJob = jobRepository.save(job);

        logger.info("Job created successfully with id: {}", savedJob.getId());

        return mapToResponse(savedJob);
    }

    // GET ALL + SEARCH + FILTER + PAGINATION + SORTING
    public Page<JobResponse> getAllJobs(
            String search,
            String department,
            String location,
            String employmentType,
            int page,
            int size,
            String sortBy,
            String direction) {

        search = normalize(search);
        department = normalize(department);
        location = normalize(location);
        employmentType = normalize(employmentType);

        sortBy = normalize(sortBy);
        direction = normalize(direction);

        if (sortBy == null) {
            sortBy = "id";
        }

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException(
                    "Invalid sort field: " + sortBy
            );
        }

        if (direction == null) {
            direction = "asc";
        }

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Sort sort = Sort.by(sortDirection, sortBy);

        Pageable pageable = PageRequest.of(page, size, sort);

        logger.info(
                "Fetching jobs: search={}, department={}, location={}, employmentType={}, page={}, size={}, sortBy={}, direction={}",
                search,
                department,
                location,
                employmentType,
                page,
                size,
                sortBy,
                direction
        );

        Page<Job> jobs = jobRepository.searchAndFilterJobs(
                search,
                department,
                location,
                employmentType,
                pageable
        );

        logger.info(
                "Found {} jobs on page {}",
                jobs.getNumberOfElements(),
                jobs.getNumber()
        );

        return jobs.map(this::mapToResponse);
    }

    // GET BY ID
    public JobResponse getJobById(Long id) {

        logger.info("Fetching job with id: {}", id);

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Job not found with id: {}", id);

                    return new JobNotFoundException(
                            "Job not found with id: " + id
                    );
                });

        logger.info("Job found with id: {}", id);

        return mapToResponse(job);
    }

    // UPDATE
    public JobResponse updateJob(Long id, JobRequest request) {

        logger.info("Updating job with id: {}", id);

        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn(
                            "Cannot update. Job not found with id: {}",
                            id
                    );

                    return new JobNotFoundException(
                            "Job not found with id: " + id
                    );
                });

        existingJob.setTitle(request.getTitle());
        existingJob.setLocation(request.getLocation());
        existingJob.setDepartment(request.getDepartment());
        existingJob.setEmploymentType(request.getEmploymentType());

        Job savedJob = jobRepository.save(existingJob);

        logger.info("Job updated successfully with id: {}", id);

        return mapToResponse(savedJob);
    }

    // DELETE
    public void deleteJob(Long id) {

        logger.info("Deleting job with id: {}", id);

        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn(
                            "Cannot delete. Job not found with id: {}",
                            id
                    );

                    return new JobNotFoundException(
                            "Job not found with id: " + id
                    );
                });

        jobRepository.delete(existingJob);

        logger.info("Job deleted successfully with id: {}", id);
    }

    // ENTITY -> RESPONSE DTO
    private JobResponse mapToResponse(Job job) {

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getLocation(),
                job.getDepartment(),
                job.getEmploymentType()
        );
    }

    // EMPTY STRING -> NULL
    private String normalize(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}