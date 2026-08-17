package com.emmvee.backend.repository;

import com.emmvee.backend.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("""
        SELECT j
        FROM Job j
        WHERE
            (:search IS NULL OR :search = '' OR
             LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:department IS NULL OR :department = '' OR
             j.department = :department)
        AND (:location IS NULL OR :location = '' OR
             j.location = :location)
        AND (:employmentType IS NULL OR :employmentType = '' OR
             j.employmentType = :employmentType)
        """)
    Page<Job> searchAndFilterJobs(
            @Param("search") String search,
            @Param("department") String department,
            @Param("location") String location,
            @Param("employmentType") String employmentType,
            Pageable pageable
    );
}
