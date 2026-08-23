package com.project.company;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CompanyService {

    private final CompanyRepository companyRepo;
    private final CompanyWatchlistRepository watchlistRepo;

    public CompanyService(CompanyRepository companyRepo, CompanyWatchlistRepository watchlistRepo) {
        this.companyRepo = companyRepo;
        this.watchlistRepo = watchlistRepo;
    }

    public List<CompanyDTO> getAll(String userId) {
        return companyRepo.findAll().stream()
            .map(c -> CompanyDTO.from(c, watchlistRepo.existsByUserIdAndCompanyId(userId, c.getId())))
            .collect(Collectors.toList());
    }

    public List<CompanyDTO> getByType(String type, String userId) {
        return companyRepo.findByType(type).stream()
            .map(c -> CompanyDTO.from(c, watchlistRepo.existsByUserIdAndCompanyId(userId, c.getId())))
            .collect(Collectors.toList());
    }

    public CompanyDTO save(CompanyDTO dto) {
        Company c = new Company();
        applyDto(c, dto);
        return CompanyDTO.from(companyRepo.save(c), false);
    }

    public CompanyDTO update(Long id, CompanyDTO dto) {
        Company c = companyRepo.findById(id).orElseThrow(() -> new CompanyNotFoundException(id));
        applyDto(c, dto);
        return CompanyDTO.from(companyRepo.save(c), false);
    }

    public void delete(Long id) {
        companyRepo.deleteById(id);
    }

    public List<CompanyDTO> getWatchlist(String userId) {
        return watchlistRepo.findByUserId(userId).stream()
            .map(w -> CompanyDTO.from(w.getCompany(), true))
            .collect(Collectors.toList());
    }

    public void toggleWatchlist(String userId, Long companyId) {
        if (watchlistRepo.existsByUserIdAndCompanyId(userId, companyId)) {
            watchlistRepo.deleteByUserIdAndCompanyId(userId, companyId);
        } else {
            Company c = companyRepo.findById(companyId).orElseThrow(() -> new CompanyNotFoundException(companyId));
            CompanyWatchlist w = new CompanyWatchlist();
            w.setUserId(userId);
            w.setCompany(c);
            watchlistRepo.save(w);
        }
    }

    private void applyDto(Company c, CompanyDTO dto) {
        c.setName(dto.name);
        c.setType(dto.type);
        c.setQualification(dto.qualification);
        c.setEligibility(dto.eligibility);
        c.setRequiredSkills(dto.requiredSkills);
        c.setInterviewStages(dto.interviewStages);
        c.setExperienceRequirements(dto.experienceRequirements);
        c.setCareerPageLink(dto.careerPageLink);
        c.setJobLinks(dto.jobLinks);
        c.setNotes(dto.notes);
    }
}
