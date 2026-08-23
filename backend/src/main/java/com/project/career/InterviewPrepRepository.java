package com.project.career;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewPrepRepository extends JpaRepository<InterviewPrep, Long> {
    List<InterviewPrep> findByUserId(String userId);
    List<InterviewPrep> findByUserIdAndCompanyId(String userId, Long companyId);
}
