package com.project.career;

import jakarta.persistence.*;

@Entity
@Table(name = "interview_preps")
public class InterviewPrep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private Long companyId;
    private String companyName;
    private String round;        // HR | Technical | System Design | etc.
    private String status;       // NOT_STARTED | IN_PROGRESS | DONE
    private String notes;
    private String commonQuestions;
    private String resourceLinks;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getRound() { return round; }
    public void setRound(String round) { this.round = round; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getCommonQuestions() { return commonQuestions; }
    public void setCommonQuestions(String commonQuestions) { this.commonQuestions = commonQuestions; }
    public String getResourceLinks() { return resourceLinks; }
    public void setResourceLinks(String resourceLinks) { this.resourceLinks = resourceLinks; }
}
