package com.interviewprep.config;

import com.interviewprep.entity.*;
import com.interviewprep.entity.enums.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProgrammingQuestionRepository programmingQuestionRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final GroupChatRepository groupChatRepository;
    private final SkillTrackRepository skillTrackRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initRoles();
        initUsers();
        initSkillTracks();
        initProgrammingQuestions();
        initInterviewQuestions();
        initDiscussionGroups();
    }

    private void initSkillTracks() {
        if (skillTrackRepository.count() > 0) return;
        skillTrackRepository.save(SkillTrack.builder().name("Java Fundamentals").level(SkillLevel.BEGINNER).category("Backend").description("Core Java syntax and OOP").build());
        skillTrackRepository.save(SkillTrack.builder().name("Data Structures").level(SkillLevel.INTERMEDIATE).category("DSA").description("Arrays, trees, graphs").build());
        skillTrackRepository.save(SkillTrack.builder().name("System Design").level(SkillLevel.ADVANCED).category("Architecture").description("Scalable systems").build());
    }

    private void initRoles() {
        for (RoleName name : RoleName.values()) {
            roleRepository.findByName(name).orElseGet(() ->
                    roleRepository.save(Role.builder().name(name).build()));
        }
    }

    private void initUsers() {
        if (userRepository.count() > 0) return;

        Role studentRole = roleRepository.findByName(RoleName.ROLE_STUDENT).orElseThrow();
        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseThrow();

        Set<Role> studentRoles = new HashSet<>();
        studentRoles.add(studentRole);
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        adminRoles.add(studentRole);

        userRepository.save(User.builder()
                .username("admin")
                .email("admin@interviewprep.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Platform Admin")
                .roles(adminRoles)
                .skillLevel(SkillLevel.ADVANCED)
                .active(true)
                .totalScore(0)
                .rank(0)
                .build());

        userRepository.save(User.builder()
                .username("student")
                .email("student@interviewprep.com")
                .password(passwordEncoder.encode("student123"))
                .fullName("Demo Student")
                .roles(studentRoles)
                .skillLevel(SkillLevel.INTERMEDIATE)
                .bio("Aspiring software engineer preparing for placements")
                .skills("Java, React, SQL, Spring Boot")
                .interests("Algorithms, System Design, Mock Interviews")
                .active(true)
                .totalScore(250)
                .rank(2)
                .build());

        userRepository.save(User.builder()
                .username("alex")
                .email("alex@interviewprep.com")
                .password(passwordEncoder.encode("student123"))
                .fullName("Alex Johnson")
                .roles(studentRoles)
                .skillLevel(SkillLevel.BEGINNER)
                .active(true)
                .totalScore(120)
                .rank(3)
                .build());
    }

    private void initProgrammingQuestions() {
        if (programmingQuestionRepository.count() > 0) return;

        programmingQuestionRepository.save(ProgrammingQuestion.builder()
                .title("Sum of Two Numbers")
                .description("Write a program that takes two integers and prints their sum.")
                .difficulty(SkillLevel.BEGINNER)
                .language("Java")
                .starterCode("public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}")
                .testCases("[{\"input\":\"2 3\",\"output\":\"5\"},{\"input\":\"10 20\",\"output\":\"30\"}]")
                .expectedOutput("2 3|5\n10 20|30")
                .timeLimitSeconds(300)
                .build());

        programmingQuestionRepository.save(ProgrammingQuestion.builder()
                .title("Reverse a String")
                .description("Write a program to reverse the given string.")
                .difficulty(SkillLevel.BEGINNER)
                .language("Java")
                .starterCode("public class Solution {\n    public static void main(String[] args) {\n        String input = \"hello\";\n        // reverse and print\n    }\n}")
                .testCases("[{\"input\":\"hello\",\"output\":\"olleh\"},{\"input\":\"java\",\"output\":\"avaj\"}]")
                .expectedOutput("hello|olleh\njava|avaj")
                .timeLimitSeconds(300)
                .build());

        programmingQuestionRepository.save(ProgrammingQuestion.builder()
                .title("Factorial")
                .description("Calculate factorial of a given number n.")
                .difficulty(SkillLevel.INTERMEDIATE)
                .language("Java")
                .starterCode("public class Solution {\n    public static int factorial(int n) {\n        // Your code\n        return 1;\n    }\n}")
                .testCases("[{\"input\":\"5\",\"output\":\"120\"},{\"input\":\"0\",\"output\":\"1\"}]")
                .timeLimitSeconds(600)
                .build());

        programmingQuestionRepository.save(ProgrammingQuestion.builder()
                .title("Palindrome Check")
                .description("Check if the given string is a palindrome.")
                .difficulty(SkillLevel.INTERMEDIATE)
                .language("Java")
                .testCases("[{\"input\":\"racecar\",\"output\":\"true\"},{\"input\":\"hello\",\"output\":\"false\"}]")
                .timeLimitSeconds(600)
                .build());

        programmingQuestionRepository.save(ProgrammingQuestion.builder()
                .title("Find Maximum")
                .description("Find the maximum number in a list of integers.")
                .difficulty(SkillLevel.ADVANCED)
                .language("Java")
                .testCases("[{\"input\":\"1 5 3 9 2\",\"output\":\"9\"},{\"input\":\"-1 -5 -3\",\"output\":\"-1\"}]")
                .timeLimitSeconds(900)
                .build());
    }

    private void initInterviewQuestions() {
        if (interviewQuestionRepository.count() > 0) return;

        interviewQuestionRepository.save(InterviewQuestion.builder()
                .question("Explain the difference between ArrayList and LinkedList in Java.")
                .type(QuestionType.TECHNICAL)
                .difficulty(SkillLevel.BEGINNER)
                .sampleAnswer("ArrayList uses dynamic array with O(1) random access. LinkedList uses nodes with O(1) insert/delete at ends.")
                .build());

        interviewQuestionRepository.save(InterviewQuestion.builder()
                .question("What is dependency injection in Spring Boot?")
                .type(QuestionType.TECHNICAL)
                .difficulty(SkillLevel.INTERMEDIATE)
                .sampleAnswer("DI is a design pattern where objects receive dependencies from external source rather than creating them.")
                .build());

        interviewQuestionRepository.save(InterviewQuestion.builder()
                .question("Design a URL shortener system. What are the key components?")
                .type(QuestionType.TECHNICAL)
                .difficulty(SkillLevel.ADVANCED)
                .sampleAnswer("API gateway, encoding service, database, cache, analytics, rate limiting.")
                .build());

        interviewQuestionRepository.save(InterviewQuestion.builder()
                .question("Tell me about yourself.")
                .type(QuestionType.HR)
                .difficulty(SkillLevel.BEGINNER)
                .sampleAnswer("Brief professional summary highlighting education, skills, and career goals.")
                .build());

        interviewQuestionRepository.save(InterviewQuestion.builder()
                .question("Describe a challenging situation and how you handled it.")
                .type(QuestionType.HR)
                .difficulty(SkillLevel.INTERMEDIATE)
                .sampleAnswer("Use STAR method: Situation, Task, Action, Result.")
                .build());
    }

    private void initDiscussionGroups() {
        if (groupChatRepository.count() > 0) return;
        userRepository.findByUsername("admin").ifPresent(admin ->
                groupChatRepository.save(GroupChat.builder()
                        .name("Java Interview Prep")
                        .description("Discuss Java concepts and interview questions")
                        .createdBy(admin)
                        .members(new HashSet<>(Set.of(admin)))
                        .active(true)
                        .build()));
        userRepository.findByUsername("student").ifPresent(student ->
                groupChatRepository.save(GroupChat.builder()
                        .name("DSA Practice Group")
                        .description("Collaborative data structures and algorithms practice")
                        .createdBy(student)
                        .members(new HashSet<>(Set.of(student)))
                        .active(true)
                        .build()));
    }
}
