package com.myperseverance.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "task_id", "date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "task_id", nullable = false)
    private String taskId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private int count;
}

