package com.example.backend.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String description;
    private String venue;
    private String city;
    private String category;
    private Integer duration;
    private String genre;
    private Double price;
    private String creatorEmail;
    private String creatorNickname;
    private Set<String> attendeeEmails;
}
