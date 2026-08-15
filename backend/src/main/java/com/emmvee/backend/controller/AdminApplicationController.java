package com.emmvee.backend.controller;

import com.emmvee.backend.dto.ApplicationResponse;
import com.emmvee.backend.dto.ApplicationStatusRequest;
import com.emmvee.backend.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/applications")
public class AdminApplicationController {

    private final ApplicationService applicationService;

    public AdminApplicationController(
            ApplicationService applicationService) {

        this.applicationService = applicationService;
    }

    // GET ALL APPLICATIONS
    @GetMapping
    public List<ApplicationResponse> getAllApplications() {

        return applicationService.getAllApplications();
    }

    // UPDATE APPLICATION STATUS
    @PutMapping("/{id}/status")
    public ApplicationResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusRequest request) {

        return applicationService.updateApplicationStatus(
                id,
                request
        );
    }
}