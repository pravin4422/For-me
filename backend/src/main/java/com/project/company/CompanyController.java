package com.project.company;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService service;

    public CompanyController(CompanyService service) {
        this.service = service;
    }

    // userId header — replace with Spring Security principal in production
    @GetMapping
    public List<CompanyDTO> getAll(@RequestHeader("X-User-Id") String userId) {
        return service.getAll(userId);
    }

    @GetMapping("/type/{type}")
    public List<CompanyDTO> getByType(@PathVariable String type, @RequestHeader("X-User-Id") String userId) {
        return service.getByType(type, userId);
    }

    @PostMapping
    public CompanyDTO create(@RequestBody CompanyDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public CompanyDTO update(@PathVariable Long id, @RequestBody CompanyDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/watchlist")
    public List<CompanyDTO> watchlist(@RequestHeader("X-User-Id") String userId) {
        return service.getWatchlist(userId);
    }

    @PostMapping("/{id}/watchlist")
    public ResponseEntity<Void> toggleWatchlist(@PathVariable Long id, @RequestHeader("X-User-Id") String userId) {
        service.toggleWatchlist(userId, id);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(CompanyNotFoundException.class)
    public ResponseEntity<String> handleNotFound(CompanyNotFoundException ex) {
        return ResponseEntity.notFound().build();
    }
}
