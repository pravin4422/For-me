package com.project.company;

import jakarta.persistence.*;

@Entity
@Table(name = "company_watchlist", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "company_id"}))
public class CompanyWatchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
}
