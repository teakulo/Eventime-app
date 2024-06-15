package com.example.backend.controllers;

import com.example.backend.models.dtos.EventDTO;
import com.example.backend.models.dtos.EventRequest;
import com.example.backend.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventRequest eventRequest,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        EventDTO createdEvent = eventService.createEvent(eventRequest, userDetails.getUsername());
        return ResponseEntity.ok(createdEvent);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        EventDTO event = eventService.getEvent(id, userDetails.getUsername());
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        eventService.deleteEvent(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<EventDTO> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }
}
