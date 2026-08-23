package com.project.career;

import jakarta.persistence.*;

@Entity
@Table(name = "skill_trackers")
public class SkillTracker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String domain;
    private String skillName;
    private String status; // NOT_STARTED | IN_PROGRESS | LEARNED
    private String resourceLink;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getResourceLink() { return resourceLink; }
    public void setResourceLink(String resourceLink) { this.resourceLink = resourceLink; }
}
