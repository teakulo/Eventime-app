package com.example.backend.models.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties("creator")
public class EventRequest {
    private String name;

    @JsonProperty("start_time")
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime startTime;

    @JsonProperty("end_time")
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime endTime;
    private String description;
    private String venue;
    private String city;
    private String category;
    private Integer duration;
    private String genre;
    private Double price;


}
