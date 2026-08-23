package com.project.company;

import java.util.List;

public class CompanyDTO {
    public Long id;
    public String name;
    public String type;
    public String qualification;
    public String eligibility;
    public List<String> requiredSkills;
    public List<String> interviewStages;
    public String experienceRequirements;
    public String careerPageLink;
    public List<String> jobLinks;
    public String notes;
    public boolean watchlisted;

    public static CompanyDTO from(Company c, boolean watchlisted) {
        CompanyDTO dto = new CompanyDTO();
        dto.id = c.getId();
        dto.name = c.getName();
        dto.type = c.getType();
        dto.qualification = c.getQualification();
        dto.eligibility = c.getEligibility();
        dto.requiredSkills = c.getRequiredSkills();
        dto.interviewStages = c.getInterviewStages();
        dto.experienceRequirements = c.getExperienceRequirements();
        dto.careerPageLink = c.getCareerPageLink();
        dto.jobLinks = c.getJobLinks();
        dto.notes = c.getNotes();
        dto.watchlisted = watchlisted;
        return dto;
    }
}
