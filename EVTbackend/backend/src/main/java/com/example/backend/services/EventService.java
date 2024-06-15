package com.example.backend.services;

import com.example.backend.models.dtos.EventRequest;
import com.example.backend.models.dtos.EventDTO;
import com.example.backend.models.entities.AppEvent;
import com.example.backend.models.entities.AppUser;
import com.example.backend.repositories.EventRepository;
import com.example.backend.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final AppUserRepository appUserRepository;

    public EventDTO createEvent(EventRequest eventRequest, String userEmail) {
        AppUser creator = appUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        AppEvent event = AppEvent.builder()
                .name(eventRequest.getName())
                .startTime(eventRequest.getStartTime())
                .endTime(eventRequest.getEndTime())
                .description(eventRequest.getDescription())
                .venue(eventRequest.getVenue())
                .city(eventRequest.getCity())
                .category(eventRequest.getCategory())
                .duration(eventRequest.getDuration())
                .genre(eventRequest.getGenre())
                .price(eventRequest.getPrice())
                .creator(creator)
                .attendees(new HashSet<>())  // Initialize the attendees set
                .build();

        AppEvent savedEvent = eventRepository.save(event);

        return mapToDTO(savedEvent);
    }

    public EventDTO getEvent(Long eventId, String username) {
        AppEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));
        return mapToDTO(event);
    }

    public void deleteEvent(Long eventId, String username) {
        AppEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));
        if (!event.getCreator().getEmail().equals(username)) {
            throw new AccessDeniedException("You do not have permission to delete this event.");
        }
        eventRepository.delete(event);
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByCreator(Long creatorId) {
        return eventRepository.findByCreator_Id(creatorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByAttendee(Long userId) {
        return eventRepository.findByAttendees_Id(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EventDTO mapToDTO(AppEvent event) {
        return EventDTO.builder()
                .id(event.getId())
                .name(event.getName())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .description(event.getDescription())
                .venue(event.getVenue())
                .city(event.getCity())
                .category(event.getCategory())
                .duration(event.getDuration())
                .genre(event.getGenre())
                .price(event.getPrice())
                .creatorEmail(event.getCreator().getEmail())
                .creatorNickname(event.getCreator().getNickname())
                .attendeeEmails(event.getAttendees().stream()
                        .map(AppUser::getEmail)
                        .collect(Collectors.toSet()))
                .build();
    }
}
