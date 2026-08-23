package com.project.career;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CareerResourceRepository extends JpaRepository<CareerResource, Long> {
    List<CareerResource> findByUserId(String userId);
    List<CareerResource> findByUserIdAndCategory(String userId, String category);
}
