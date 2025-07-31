package com.myperseverance.repository;

import com.myperseverance.model.ProgressTask;
import com.myperseverance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ProgressTaskRepository extends JpaRepository<ProgressTask, Long> {
    List<ProgressTask> findByUserAndDate(User user, LocalDate date);
    List<ProgressTask> findByUser(User user);

    @Query("SELECT t.date, COUNT(t) FROM ProgressTask t WHERE t.user = :user AND t.completed = true GROUP BY t.date")
    List<Object[]> countCompletedTasksPerDay(User user);
    List<ProgressTask> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);


}
