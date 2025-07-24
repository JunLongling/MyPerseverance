package com.myperseverance.service;

import com.myperseverance.model.Habit;
import com.myperseverance.repository.HabitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HabitService {

    @Autowired
    private HabitRepository habitRepository;

    public List<Habit> getAllHabits() {
        return habitRepository.findAll();
    }

    public Optional<Habit> getHabitById(Long id) {
        return habitRepository.findById(id);
    }

    public Habit createHabit(Habit habit) {
        return habitRepository.save(habit);
    }

    public Habit updateHabit(Long id, Habit updatedHabit) {
        return habitRepository.findById(id).map(habit -> {
            habit.setName(updatedHabit.getName());
            habit.setDescription(updatedHabit.getDescription());
            habit.setCompleted(updatedHabit.isCompleted());
            return habitRepository.save(habit);
        }).orElseThrow(() -> new RuntimeException("Habit not found"));
    }

    public void deleteHabit(Long id) {
        habitRepository.deleteById(id);
    }
}
