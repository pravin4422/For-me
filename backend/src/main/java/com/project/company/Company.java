package com.project.company;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type; // GOVERNMENT | PRIVATE_PRODUCT | PRIVATE_SERVICE | STARTUP
    private String qualification;
    private String eligibility;

    @ElementCollection
    private List<String> requiredSkills;

    @ElementCollection
    private List<String> interviewStages;

    private String experienceRequirements;
    private String careerPageLink;

    @ElementCollection
    private List<String> jobLinks;

    @Column(length = 2000)
    private String notes;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }
    public List<String> getInterviewStages() { return interviewStages; }
    public void setInterviewStages(List<String> interviewStages) { this.interviewStages = interviewStages; }
    public String getExperienceRequirements() { return experienceRequirements; }
    public void setExperienceRequirements(String experienceRequirements) { this.experienceRequirements = experienceRequirements; }
    public String getCareerPageLink() { return careerPageLink; }
    public void setCareerPageLink(String careerPageLink) { this.careerPageLink = careerPageLink; }
    public List<String> getJobLinks() { return jobLinks; }
    public void setJobLinks(List<String> jobLinks) { this.jobLinks = jobLinks; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
