package com.myperseverance.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgressSummaryDTO {
    private LocalDate date;
    private int totalTasks;
    private int completedTasks;
    private List<String> taskTitles = new ArrayList<>();

    public void incrementTotal() {
        this.totalTasks++;
    }

    public void incrementCompleted() {
        this.completedTasks++;
    }

    public void addTaskTitle(String title) {
        this.taskTitles.add(title);
    }
}
