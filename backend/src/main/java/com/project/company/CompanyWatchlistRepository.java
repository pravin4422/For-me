package com.project.company;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompanyWatchlistRepository extends JpaRepository<CompanyWatchlist, Long> {
    List<CompanyWatchlist> findByUserId(String userId);
    Optional<CompanyWatchlist> findByUserIdAndCompanyId(String userId, Long companyId);
    boolean existsByUserIdAndCompanyId(String userId, Long companyId);
    void deleteByUserIdAndCompanyId(String userId, Long companyId);
}
