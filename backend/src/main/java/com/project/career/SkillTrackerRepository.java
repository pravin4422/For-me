package com.project.career;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillTrackerRepository extends JpaRepository<SkillTracker, Long> {
    List<SkillTracker> findByUserIdAndDomain(String userId, String domain);
    List<SkillTracker> findByUserId(String userId);
}
