package com.interviewprep.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.dto.response.TestEvaluationResponse;
import com.interviewprep.entity.ProgrammingQuestion;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

@Service
public class CodeEvaluationService {

    private static final int OUTPUT_LIMIT = 8_000;
    private static final long COMPILE_TIMEOUT_SECONDS = 15;
    private static final long RUN_TIMEOUT_SECONDS = 5;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ExecutorService outputExecutor = Executors.newCachedThreadPool();

    public TestEvaluationResponse evaluate(String code, ProgrammingQuestion question, String requestedLanguage) {
        String language = normalizeLanguage(requestedLanguage != null ? requestedLanguage : question.getLanguage());
        List<Map<String, String>> testCases = parseTestCases(question);
        Path workspace = null;

        try {
            workspace = Files.createTempDirectory("interview-code-");
            ExecutionPlan plan = createExecutionPlan(language, workspace);
            Files.writeString(plan.sourceFile(), code == null ? "" : code, StandardCharsets.UTF_8);

            if (plan.compileCommand() != null && !plan.compileCommand().isEmpty()) {
                ProcessResult compile = runProcess(plan.compileCommand(), workspace, "", COMPILE_TIMEOUT_SECONDS);
                if (!compile.started() || compile.timedOut() || compile.exitCode() != 0) {
                    String detail = compileOutput(compile);
                    if (!compile.started()) {
                        detail = missingCompilerMessage(language, detail);
                    }
                    return failedResponse(language, testCases, "Compilation failed", detail);
                }
            }

            List<TestEvaluationResponse.TestCaseResult> results = new ArrayList<>();
            int passed = 0;

            for (int i = 0; i < testCases.size(); i++) {
                Map<String, String> testCase = testCases.get(i);
                String input = testCase.getOrDefault("input", "");
                String expected = testCase.getOrDefault("output", testCase.getOrDefault("expected", ""));
                ProcessResult run = runProcess(plan.runCommand(), workspace, input, RUN_TIMEOUT_SECONDS);

                String actual = run.stdout().trim();
                String failure = runFailure(run);
                boolean testPassed = failure == null && normalize(actual).equals(normalize(expected));
                if (testPassed) {
                    passed++;
                }

                results.add(TestEvaluationResponse.TestCaseResult.builder()
                        .index(i + 1)
                        .passed(testPassed)
                        .expected(expected)
                        .actual(testPassed ? actual : firstNonBlank(actual, failure, run.stderr()))
                        .build());
            }

            int total = Math.max(testCases.size(), 1);
            int score = (int) Math.round((passed * 100.0) / total);
            return TestEvaluationResponse.builder()
                    .passed(passed == total)
                    .score(score)
                    .passedTests(passed)
                    .totalTests(total)
                    .language(language)
                    .message(passed == total ? "All test cases passed" : "Some test cases failed")
                    .results(results)
                    .build();
        } catch (Exception ex) {
            return failedResponse(language, testCases, "Evaluation failed", ex.getMessage());
        } finally {
            deleteRecursively(workspace);
        }
    }

    private ExecutionPlan createExecutionPlan(String language, Path workspace) throws IOException {
        return switch (language) {
            case "Java" -> {
                Path source = workspace.resolve("Solution.java");
                yield new ExecutionPlan(
                        source,
                        List.of(javaTool("javac"), "Solution.java"),
                        List.of(javaTool("java"), "-cp", workspace.toString(), "Solution")
                );
            }
            case "Python" -> {
                Path source = workspace.resolve("solution.py");
                yield new ExecutionPlan(source, List.of(), append(resolvePythonCommand(), "solution.py"));
            }
            case "JavaScript" -> {
                Path source = workspace.resolve("solution.js");
                yield new ExecutionPlan(source, List.of(), List.of(resolveNodeCommand(), "solution.js"));
            }
            case "C" -> {
                Path source = workspace.resolve("solution.c");
                String exe = workspace.resolve(executableName("solution")).toString();
                yield new ExecutionPlan(source, cCompileCommand(resolveCCompiler(), "solution.c", exe), List.of(exe));
            }
            case "C++" -> {
                Path source = workspace.resolve("solution.cpp");
                String exe = workspace.resolve(executableName("solution")).toString();
                yield new ExecutionPlan(source, cppCompileCommand(resolveCppCompiler(), "solution.cpp", exe), List.of(exe));
            }
            case "C#" -> createCSharpPlan(workspace);
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    private List<Map<String, String>> parseTestCases(ProgrammingQuestion question) {
        try {
            if (question.getTestCases() != null && question.getTestCases().startsWith("[")) {
                return objectMapper.readValue(question.getTestCases(), new TypeReference<>() {});
            }
        } catch (Exception ignored) {
        }
        List<Map<String, String>> cases = new ArrayList<>();
        if (question.getExpectedOutput() != null) {
            String[] lines = question.getExpectedOutput().split("\n");
            for (String line : lines) {
                String[] parts = line.split("\\|");
                Map<String, String> testCase = new HashMap<>();
                if (parts.length >= 2) {
                    testCase.put("input", parts[0].trim());
                    testCase.put("output", parts[1].trim());
                } else {
                    testCase.put("input", "");
                    testCase.put("output", line.trim());
                }
                cases.add(testCase);
            }
        }
        if (cases.isEmpty()) {
            Map<String, String> defaultCase = new HashMap<>();
            defaultCase.put("input", "");
            defaultCase.put("output", "true");
            cases.add(defaultCase);
        }
        return cases;
    }

    private ProcessResult runProcess(List<String> command, Path workingDirectory, String input, long timeoutSeconds) {
        try {
            ProcessBuilder builder = new ProcessBuilder(command);
            builder.directory(workingDirectory.toFile());
            Process process = builder.start();

            Future<String> stdout = outputExecutor.submit(() -> readStream(process.getInputStream()));
            Future<String> stderr = outputExecutor.submit(() -> readStream(process.getErrorStream()));

            try (OutputStream stdin = process.getOutputStream()) {
                if (input != null) {
                    stdin.write((input + System.lineSeparator()).getBytes(StandardCharsets.UTF_8));
                    stdin.flush();
                }
            } catch (IOException ignored) {
            }

            boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return new ProcessResult(true, true, -1, getFuture(stdout), getFuture(stderr));
            }

            return new ProcessResult(true, false, process.exitValue(), getFuture(stdout), getFuture(stderr));
        } catch (Exception ex) {
            return new ProcessResult(false, false, -1, "", "Unable to start " + command.get(0) + ": " + ex.getMessage());
        }
    }

    private String readStream(InputStream stream) throws IOException {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            int next;
            while ((next = reader.read()) != -1) {
                if (output.length() < OUTPUT_LIMIT) {
                    output.append((char) next);
                }
            }
        }
        if (output.length() >= OUTPUT_LIMIT) {
            output.append("\n[output truncated]");
        }
        return output.toString();
    }

    private String getFuture(Future<String> future) {
        try {
            return future.get(1, TimeUnit.SECONDS);
        } catch (Exception ignored) {
            return "";
        }
    }

    private String runFailure(ProcessResult result) {
        if (!result.started()) return result.stderr();
        if (result.timedOut()) return "Execution timed out after " + RUN_TIMEOUT_SECONDS + " seconds";
        if (result.exitCode() != 0) return firstNonBlank(result.stderr(), result.stdout(), "Runtime error");
        return null;
    }

    private TestEvaluationResponse failedResponse(
            String language,
            List<Map<String, String>> testCases,
            String message,
            String detail
    ) {
        List<TestEvaluationResponse.TestCaseResult> results = new ArrayList<>();
        for (int i = 0; i < testCases.size(); i++) {
            Map<String, String> testCase = testCases.get(i);
            results.add(TestEvaluationResponse.TestCaseResult.builder()
                    .index(i + 1)
                    .passed(false)
                    .expected(testCase.getOrDefault("output", testCase.getOrDefault("expected", "")))
                    .actual(trimOutput(detail))
                    .build());
        }
        int total = Math.max(testCases.size(), 1);
        return TestEvaluationResponse.builder()
                .passed(false)
                .score(0)
                .passedTests(0)
                .totalTests(total)
                .language(language)
                .message(message + ": " + trimOutput(detail))
                .results(results)
                .build();
    }

    private String compileOutput(ProcessResult result) {
        if (!result.started()) return result.stderr();
        if (result.timedOut()) return "Compilation timed out after " + COMPILE_TIMEOUT_SECONDS + " seconds";
        return firstNonBlank(result.stderr(), result.stdout(), "Compiler exited with code " + result.exitCode());
    }

    private String missingCompilerMessage(String language, String detail) {
        return switch (language) {
            case "C" -> "C compiler not found. Install GCC, Clang, or Visual Studio C++ Build Tools and make sure the compiler is available in PATH. " + detail;
            case "C++" -> "C++ compiler not found. Install G++, Clang++, or Visual Studio C++ Build Tools and make sure the compiler is available in PATH. " + detail;
            case "C#" -> "C# compiler not found. Install the .NET SDK or C# compiler and make sure dotnet or csc is available in PATH. " + detail;
            case "Java" -> "Java compiler not found. Install a JDK and make sure javac is available in PATH. " + detail;
            default -> detail;
        };
    }

    private String normalizeLanguage(String language) {
        String value = Optional.ofNullable(language).orElse("Java").trim().toLowerCase(Locale.ROOT);
        return switch (value) {
            case "python", "py", "python3" -> "Python";
            case "c" -> "C";
            case "c++", "cpp", "cxx" -> "C++";
            case "javascript", "js", "node" -> "JavaScript";
            case "c#", "csharp", "cs" -> "C#";
            default -> "Java";
        };
    }

    private String javaTool(String name) {
        String executable = executableName(name);
        Path javaHomeTool = Paths.get(System.getProperty("java.home"), "bin", executable);
        if (Files.exists(javaHomeTool)) {
            return javaHomeTool.toString();
        }
        return executable;
    }

    private List<String> resolvePythonCommand() {
        if (isCommandAvailable(List.of("python", "--version"))) return List.of("python");
        if (isCommandAvailable(List.of("py", "-3", "--version"))) return List.of("py", "-3");
        if (isCommandAvailable(List.of("python3", "--version"))) return List.of("python3");
        return List.of("python");
    }

    private String resolveNodeCommand() {
        Path cwd = Paths.get("").toAbsolutePath();
        List<Path> candidates = List.of(
                cwd.resolve("tools/node-v20.18.0-win-x64/" + executableName("node")),
                cwd.resolve("../tools/node-v20.18.0-win-x64/" + executableName("node"))
        );
        for (Path candidate : candidates) {
            Path normalized = candidate.normalize();
            if (Files.exists(normalized)) return normalized.toString();
        }
        return executableName("node");
    }

    private String resolveFirstCommand(String... commands) {
        for (String command : commands) {
            if (isCommandAvailable(List.of(command, "--version"))) return command;
        }
        return commands[0];
    }

    private String resolveCCompiler() {
        if (isCommandAvailable(List.of("gcc", "--version"))) return "gcc";
        if (isCommandAvailable(List.of("clang", "--version"))) return "clang";
        if (canStart(List.of("cl"))) return "cl";
        return "gcc";
    }

    private String resolveCppCompiler() {
        if (isCommandAvailable(List.of("g++", "--version"))) return "g++";
        if (isCommandAvailable(List.of("clang++", "--version"))) return "clang++";
        if (canStart(List.of("cl"))) return "cl";
        return "g++";
    }

    private List<String> cCompileCommand(String compiler, String source, String exe) {
        if ("cl".equals(compiler)) {
            return List.of("cl", "/nologo", "/Fe:" + exe, source);
        }
        return List.of(compiler, source, "-O2", "-std=c11", "-o", exe);
    }

    private List<String> cppCompileCommand(String compiler, String source, String exe) {
        if ("cl".equals(compiler)) {
            return List.of("cl", "/nologo", "/EHsc", "/Fe:" + exe, source);
        }
        return List.of(compiler, source, "-O2", "-std=c++17", "-o", exe);
    }

    private ExecutionPlan createCSharpPlan(Path workspace) throws IOException {
        Path source = workspace.resolve("Program.cs");
        if (canStart(List.of("csc", "/help"))) {
            String exe = workspace.resolve(executableName("Program")).toString();
            return new ExecutionPlan(source, List.of("csc", "/nologo", "/out:" + exe, "Program.cs"), List.of(exe));
        }
        if (isCommandAvailable(List.of("dotnet", "--version"))) {
            Path project = workspace.resolve("Solution.csproj");
            String targetFramework = "net8.0";
            Files.writeString(project, """
                    <Project Sdk="Microsoft.NET.Sdk">
                      <PropertyGroup>
                        <OutputType>Exe</OutputType>
                        <TargetFramework>net8.0</TargetFramework>
                        <ImplicitUsings>enable</ImplicitUsings>
                        <Nullable>disable</Nullable>
                      </PropertyGroup>
                    </Project>
                    """, StandardCharsets.UTF_8);
            return new ExecutionPlan(
                    source,
                    List.of("dotnet", "build", "Solution.csproj", "-c", "Release", "--nologo"),
                    List.of("dotnet", workspace.resolve("bin/Release/" + targetFramework + "/Solution.dll").toString())
            );
        }
        String exe = workspace.resolve(executableName("Program")).toString();
        return new ExecutionPlan(source, List.of("csc", "/nologo", "/out:" + exe, "Program.cs"), List.of(exe));
    }

    private boolean isCommandAvailable(List<String> command) {
        try {
            Process process = new ProcessBuilder(command).start();
            boolean finished = process.waitFor(3, TimeUnit.SECONDS);
            if (!finished) process.destroyForcibly();
            return finished && process.exitValue() == 0;
        } catch (Exception ignored) {
            return false;
        }
    }

    private boolean canStart(List<String> command) {
        try {
            Process process = new ProcessBuilder(command).start();
            process.waitFor(3, TimeUnit.SECONDS);
            process.destroyForcibly();
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    private List<String> append(List<String> prefix, String value) {
        List<String> command = new ArrayList<>(prefix);
        command.add(value);
        return command;
    }

    private String executableName(String base) {
        return System.getProperty("os.name").toLowerCase(Locale.ROOT).contains("win") ? base + ".exe" : base;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) return trimOutput(value);
        }
        return "";
    }

    private String trimOutput(String value) {
        if (value == null) return "";
        String trimmed = value.trim();
        return trimmed.length() > OUTPUT_LIMIT ? trimmed.substring(0, OUTPUT_LIMIT) + "\n[output truncated]" : trimmed;
    }

    private void deleteRecursively(Path path) {
        if (path == null || !Files.exists(path)) return;
        try (Stream<Path> walk = Files.walk(path)) {
            walk.sorted(Comparator.reverseOrder()).forEach(item -> {
                try {
                    Files.deleteIfExists(item);
                } catch (IOException ignored) {
                }
            });
        } catch (IOException ignored) {
        }
    }

    private record ExecutionPlan(Path sourceFile, List<String> compileCommand, List<String> runCommand) {
    }

    private record ProcessResult(boolean started, boolean timedOut, int exitCode, String stdout, String stderr) {
    }
}
