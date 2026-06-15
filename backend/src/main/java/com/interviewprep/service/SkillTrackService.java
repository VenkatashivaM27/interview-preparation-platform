package com.interviewprep.service;

import com.interviewprep.dto.request.SkillTrackRequest;
import com.interviewprep.entity.SkillTrack;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.SkillTrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillTrackService {

    private final SkillTrackRepository skillTrackRepository;

    public List<SkillTrack> getAllActive() {
        return skillTrackRepository.findByActiveTrueOrderByNameAsc();
    }

    public List<SkillTrack> getAll() {
        return skillTrackRepository.findAll();
    }

    public SkillTrack getById(Long id) {
        return skillTrackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
    }

    @Transactional
    public SkillTrack create(SkillTrackRequest request) {
        if (skillTrackRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Skill name already exists");
        }
        return skillTrackRepository.save(SkillTrack.builder()
                .name(request.getName())
                .description(request.getDescription())
                .level(request.getLevel())
                .category(request.getCategory())
                .active(true)
                .build());
    }

    @Transactional
    public SkillTrack update(Long id, SkillTrackRequest request) {
        SkillTrack skill = getById(id);
        skill.setName(request.getName());
        skill.setDescription(request.getDescription());
        skill.setLevel(request.getLevel());
        skill.setCategory(request.getCategory());
        return skillTrackRepository.save(skill);
    }

    @Transactional
    public void delete(Long id) {
        SkillTrack skill = getById(id);
        skill.setActive(false);
        skillTrackRepository.save(skill);
    }
}
