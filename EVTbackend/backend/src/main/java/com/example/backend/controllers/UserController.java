package com.example.backend.controllers;

import com.example.backend.models.dtos.AppUserDTO;
import com.example.backend.services.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/users")
@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final AppUserService appUserService;

    @GetMapping("/list")
    public List<AppUserDTO> getUsers() {
        log.debug("Fetching all users");
        return appUserService.getUserList();
    }

    @GetMapping("/{id}")
    public AppUserDTO getUser(@PathVariable Long id) {
        log.debug("Fetching user with id: {}", id);
        return appUserService.getUser(id);
    }

    @GetMapping("/current")
    public AppUserDTO getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        log.debug("Fetching current user: {}", userDetails.getUsername());
        return appUserService.getUserByEmail(userDetails.getUsername());
    }

    @PutMapping("/{id}")
    public AppUserDTO updateUser(@PathVariable Long id, @RequestBody AppUserDTO user) {
        log.debug("Updating user with id: {}", id);
        return appUserService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        log.debug("Deleting user with id: {}", id);
        appUserService.deleteUser(id);
    }

    @PostMapping("/{userId}/add-friend/{friendId}")
    public void addFriend(@PathVariable Long userId, @PathVariable Long friendId) {
        log.debug("Adding friend with ID: {} to user with ID: {}", friendId, userId);
        appUserService.addFriend(userId, friendId);
    }

    @DeleteMapping("/{userId}/remove-friend/{friendId}")
    public void removeFriend(@PathVariable Long userId, @PathVariable Long friendId) {
        log.debug("Removing friend with ID: {} from user with ID: {}", friendId, userId);
        appUserService.removeFriend(userId, friendId);
    }

    @PostMapping("/{userId}/attend-event/{eventId}")
    public void attendEvent(@PathVariable Long userId, @PathVariable Long eventId) {
        log.debug("User with ID: {} attending event with ID: {}", userId, eventId);
        appUserService.attendEvent(eventId, userId);
    }

    @DeleteMapping("/{userId}/unattend-event/{eventId}")
    public void unattendEvent(@PathVariable Long userId, @PathVariable Long eventId) {
        log.debug("User with ID: {} unattending event with ID: {}", userId, eventId);
        appUserService.unattendEvent(eventId, userId);
    }
}
