package com.interviewprep.repository;

import com.interviewprep.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    long countByActiveTrue();
    long countByOnlineTrue();

    @Query("SELECT u FROM User u WHERE u.active = true ORDER BY u.totalScore DESC")
    List<User> findTopByScore(Pageable pageable);

    @Query("""
            SELECT u FROM User u
            JOIN u.roles r
            WHERE r.name = com.interviewprep.entity.enums.RoleName.ROLE_STUDENT
            AND u.active = true
            ORDER BY u.totalScore DESC
            """)
    List<User> findTopStudentsByScore(Pageable pageable);

    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(
            String username, String email, String fullName, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = com.interviewprep.entity.enums.RoleName.ROLE_STUDENT")
    long countStudents();

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = com.interviewprep.entity.enums.RoleName.ROLE_STUDENT AND u.active = true")
    long countActiveStudents();

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = com.interviewprep.entity.enums.RoleName.ROLE_STUDENT AND u.active = false")
    long countInactiveStudents();

    @Query("""
            SELECT COUNT(DISTINCT u.id) FROM User u
            JOIN u.roles r
            WHERE r.name = com.interviewprep.entity.enums.RoleName.ROLE_STUDENT
            AND (EXISTS (SELECT 1 FROM TestResult t WHERE t.user = u)
                 OR EXISTS (SELECT 1 FROM MockTest m WHERE m.user = u AND m.completed = true)
                 OR EXISTS (SELECT 1 FROM Analytics a WHERE a.user = u))
            """)
    long countParticipatingStudents();

    @Query("""
            SELECT COUNT(u) FROM User u
            JOIN u.roles r
            WHERE r.name = com.interviewprep.entity.enums.RoleName.ROLE_STUDENT
            AND NOT (EXISTS (SELECT 1 FROM TestResult t WHERE t.user = u)
                 OR EXISTS (SELECT 1 FROM MockTest m WHERE m.user = u AND m.completed = true)
                 OR EXISTS (SELECT 1 FROM Analytics a WHERE a.user = u))
            """)
    long countNonParticipatingStudents();
}
