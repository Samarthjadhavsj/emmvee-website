package com.emmvee.backend.controller;

import com.emmvee.backend.dto.ApplicationRequest;
import com.emmvee.backend.dto.ApplicationResponse;
import com.emmvee.backend.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService = applicationService;
    }

    // APPLY FOR JOB
    @PostMapping
    public ApplicationResponse apply(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {

        return applicationService.apply(
                authentication.getName(),
                request
        );
    }

    // GET MY APPLICATIONS
    @GetMapping("/my")
    public List<ApplicationResponse> getMyApplications(
            Authentication authentication) {

        return applicationService.getMyApplications(
                authentication.getName()
        );
    }
}