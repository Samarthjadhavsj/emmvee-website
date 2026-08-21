package com.emmvee.backend;

import com.emmvee.backend.dto.JobRequest;
import com.emmvee.backend.dto.JobResponse;
import com.emmvee.backend.exception.JobNotFoundException;
import com.emmvee.backend.service.JobService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class JobServiceTests {

    @Autowired
    private JobService jobService;

    @Test
    void createJobShouldReturnCreatedJob() {
        JobRequest request = new JobRequest();
        request.setTitle("Test Software Engineer");
        request.setLocation("Bengaluru");
        request.setDepartment("Engineering");
        request.setEmploymentType("Full Time");

        JobResponse response = jobService.createJob(request);

        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("Test Software Engineer", response.getTitle());
    }

    @Test
    void getJobByIdShouldReturnExistingJob() {
        JobRequest request = new JobRequest();
        request.setTitle("Test Backend Engineer");
        request.setLocation("Bengaluru");
        request.setDepartment("Engineering");
        request.setEmploymentType("Full Time");

        JobResponse created = jobService.createJob(request);
        JobResponse found = jobService.getJobById(created.getId());

        assertEquals(created.getId(), found.getId());
        assertEquals(created.getTitle(), found.getTitle());
    }

    @Test
    void getJobByIdShouldThrowWhenJobDoesNotExist() {
        assertThrows(
                JobNotFoundException.class,
                () -> jobService.getJobById(Long.MAX_VALUE)
        );
    }

    @Test
    void invalidSortFieldShouldThrowException() {
        assertThrows(
                IllegalArgumentException.class,
                () -> jobService.getAllJobs(
                        null,
                        null,
                        null,
                        null,
                        0,
                        10,
                        "invalidField",
                        "asc"
                )
        );
    }
}
