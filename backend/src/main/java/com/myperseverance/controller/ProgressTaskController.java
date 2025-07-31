package com.myperseverance.controller;

import com.myperseverance.dto.ProgressSummaryDTO;
import com.myperseverance.dto.ProgressTaskDTO;
import com.myperseverance.model.ProgressTask;
import com.myperseverance.model.User;
import com.myperseverance.repository.ProgressTaskRepository;
import com.myperseverance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressTaskController {

    private final ProgressTaskRepository taskRepo;
    private final UserService userService;

    // Get tasks for user and optional date (default to today if date not provided)
    @GetMapping("/tasks")
    public List<ProgressTask> getTasksForDate(@RequestParam(required = false) String date) {
        User user = userService.getCurrentUser();
        LocalDate targetDate = (date == null) ? LocalDate.now() : LocalDate.parse(date);
        return taskRepo.findByUserAndDate(user, targetDate);
    }

    // Create a new task
    @PostMapping("/tasks")
    public ProgressTask createTask(@RequestBody ProgressTaskDTO dto) {
        User user = userService.getCurrentUser();
        ProgressTask task = ProgressTask.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .completed(false)
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .user(user)
                .build();
        return taskRepo.save(task);
    }

    @PutMapping("/tasks/{id}")
    public ProgressTask updateTask(@PathVariable Long id, @RequestBody ProgressTaskDTO dto) {
        ProgressTask task = taskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(dto.isCompleted());
        task.setDate(dto.getDate() != null ? dto.getDate() : task.getDate());

        return taskRepo.save(task);
    }

    // Delete a task
    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepo.deleteById(id);
    }

    @GetMapping("/summary")
    public List<ProgressSummaryDTO> getProgressSummary(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        User user = userService.getCurrentUser();

        LocalDate start = (startDate != null) ? LocalDate.parse(startDate) : LocalDate.now().minusYears(1);
        LocalDate end = (endDate != null) ? LocalDate.parse(endDate) : LocalDate.now();

        List<ProgressTask> tasks = taskRepo.findByUserAndDateBetween(user, start, end);

        Map<LocalDate, ProgressSummaryDTO> summaryMap = new HashMap<>();

        for (ProgressTask task : tasks) {
            LocalDate date = task.getDate();
            summaryMap.putIfAbsent(date, new ProgressSummaryDTO(date, 0, 0, new ArrayList<>()));

            ProgressSummaryDTO summary = summaryMap.get(date);
            summary.incrementTotal();
            if (task.isCompleted()) {
                summary.incrementCompleted();
                summary.addTaskTitle(task.getTitle());
            }
        }

        return new ArrayList<>(summaryMap.values());
    }
}
