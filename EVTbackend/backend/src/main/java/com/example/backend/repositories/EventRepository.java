package com.example.backend.repositories;

import com.example.backend.models.entities.AppEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<AppEvent, Long> {
    List<AppEvent> findByCreator_Id(Long creatorId);
    List<AppEvent> findByAttendees_Id(Long userId);
}
