package com.project.career;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/career")
public class CareerController {

    private final CareerService service;

    public CareerController(CareerService service) {
        this.service = service;
    }

    // ── Skills ──────────────────────────────────────────────────────────────
    @GetMapping("/skills")
    public List<SkillTracker> getSkills(@RequestHeader("X-User-Id") String userId,
                                        @RequestParam(required = false) String domain) {
        return service.getSkills(userId, domain);
    }

    @PostMapping("/skills")
    public SkillTracker addSkill(@RequestHeader("X-User-Id") String userId,
                                 @RequestBody SkillTracker skill) {
        skill.setUserId(userId);
        return service.saveSkill(skill);
    }

    @PatchMapping("/skills/{id}/status")
    public SkillTracker updateStatus(@PathVariable Long id, @RequestParam String status) {
        return service.updateSkillStatus(id, status);
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        service.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }

    // ── Interview Prep ───────────────────────────────────────────────────────
    @GetMapping("/interview-prep")
    public List<InterviewPrep> getPreps(@RequestHeader("X-User-Id") String userId,
                                        @RequestParam(required = false) Long companyId) {
        return service.getPreps(userId, companyId);
    }

    @PostMapping("/interview-prep")
    public InterviewPrep addPrep(@RequestHeader("X-User-Id") String userId,
                                 @RequestBody InterviewPrep prep) {
        prep.setUserId(userId);
        return service.savePrep(prep);
    }

    @PutMapping("/interview-prep/{id}")
    public InterviewPrep updatePrep(@PathVariable Long id, @RequestBody InterviewPrep prep) {
        return service.updatePrep(id, prep);
    }

    @DeleteMapping("/interview-prep/{id}")
    public ResponseEntity<Void> deletePrep(@PathVariable Long id) {
        service.deletePrep(id);
        return ResponseEntity.noContent().build();
    }

    // ── Resources ────────────────────────────────────────────────────────────
    @GetMapping("/resources")
    public List<CareerResource> getResources(@RequestHeader("X-User-Id") String userId,
                                             @RequestParam(required = false) String category) {
        return service.getResources(userId, category);
    }

    @PostMapping("/resources")
    public CareerResource addResource(@RequestHeader("X-User-Id") String userId,
                                      @RequestBody CareerResource resource) {
        resource.setUserId(userId);
        return service.saveResource(resource);
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        service.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
