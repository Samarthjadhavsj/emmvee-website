package com.emmvee.backend.dto;

public class JobResponse {

    private Long id;
    private String title;
    private String location;
    private String department;
    private String employmentType;

    public JobResponse(
            Long id,
            String title,
            String location,
            String department,
            String employmentType) {

        this.id = id;
        this.title = title;
        this.location = location;
        this.department = department;
        this.employmentType = employmentType;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public String getDepartment() {
        return department;
    }

    public String getEmploymentType() {
        return employmentType;
    }
}
