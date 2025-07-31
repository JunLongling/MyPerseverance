package com.myperseverance.dto;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

@Data
public class ProgressTaskDTO {
    private String title;
    private String description;
    private LocalDate date;
    private boolean completed;
}
