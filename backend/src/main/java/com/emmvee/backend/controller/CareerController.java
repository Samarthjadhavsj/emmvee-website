package com.emmvee.backend.controller;

import com.emmvee.backend.dto.JobRequest;
import com.emmvee.backend.dto.JobResponse;
import com.emmvee.backend.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/careers")
public class CareerController {

    private final JobService jobService;

    public CareerController(JobService jobService) {
        this.jobService = jobService;
    }

    // CREATE
    @PostMapping("/jobs")
    public JobResponse createJob(
            @Valid @RequestBody JobRequest request) {

        return jobService.createJob(request);
    }

    // GET ALL + SEARCH + FILTER + PAGINATION + SORTING
    @GetMapping("/jobs")
    public Page<JobResponse> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String employmentType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        return jobService.getAllJobs(
                search,
                department,
                location,
                employmentType,
                page,
                size,
                sortBy,
                direction
        );
    }

    // GET BY ID
    @GetMapping("/jobs/{id}")
    public JobResponse getJobById(
            @PathVariable Long id) {

        return jobService.getJobById(id);
    }

    // UPDATE
    @PutMapping("/jobs/{id}")
    public JobResponse updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request) {

        return jobService.updateJob(id, request);
    }

    // DELETE
    @DeleteMapping("/jobs/{id}")
    public String deleteJob(
            @PathVariable Long id) {

        jobService.deleteJob(id);

        return "Job deleted successfully";
    }
}