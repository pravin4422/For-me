package com.project.career;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CareerService {

    private final SkillTrackerRepository skillRepo;
    private final InterviewPrepRepository prepRepo;
    private final CareerResourceRepository resourceRepo;

    public CareerService(SkillTrackerRepository skillRepo,
                         InterviewPrepRepository prepRepo,
                         CareerResourceRepository resourceRepo) {
        this.skillRepo = skillRepo;
        this.prepRepo = prepRepo;
        this.resourceRepo = resourceRepo;
    }

    // Skills
    public List<SkillTracker> getSkills(String userId, String domain) {
        return domain != null ? skillRepo.findByUserIdAndDomain(userId, domain) : skillRepo.findByUserId(userId);
    }

    public SkillTracker saveSkill(SkillTracker s) { return skillRepo.save(s); }

    public SkillTracker updateSkillStatus(Long id, String status) {
        SkillTracker s = skillRepo.findById(id).orElseThrow();
        s.setStatus(status);
        return skillRepo.save(s);
    }

    public void deleteSkill(Long id) { skillRepo.deleteById(id); }

    // Interview Prep
    public List<InterviewPrep> getPreps(String userId, Long companyId) {
        return companyId != null ? prepRepo.findByUserIdAndCompanyId(userId, companyId) : prepRepo.findByUserId(userId);
    }

    public InterviewPrep savePrep(InterviewPrep p) { return prepRepo.save(p); }

    public InterviewPrep updatePrep(Long id, InterviewPrep updated) {
        InterviewPrep p = prepRepo.findById(id).orElseThrow();
        p.setRound(updated.getRound());
        p.setStatus(updated.getStatus());
        p.setNotes(updated.getNotes());
        p.setCommonQuestions(updated.getCommonQuestions());
        p.setResourceLinks(updated.getResourceLinks());
        return prepRepo.save(p);
    }

    public void deletePrep(Long id) { prepRepo.deleteById(id); }

    // Resources
    public List<CareerResource> getResources(String userId, String category) {
        return category != null ? resourceRepo.findByUserIdAndCategory(userId, category) : resourceRepo.findByUserId(userId);
    }

    public CareerResource saveResource(CareerResource r) { return resourceRepo.save(r); }

    public void deleteResource(Long id) { resourceRepo.deleteById(id); }
}
