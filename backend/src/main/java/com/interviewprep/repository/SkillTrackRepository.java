package com.interviewprep.repository;

import com.interviewprep.entity.SkillTrack;
import com.interviewprep.entity.enums.SkillLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillTrackRepository extends JpaRepository<SkillTrack, Long> {
    List<SkillTrack> findByActiveTrueOrderByNameAsc();
    List<SkillTrack> findByLevelAndActiveTrue(SkillLevel level);
    boolean existsByNameIgnoreCase(String name);
}
