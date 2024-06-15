package com.example.backend.services;

import com.example.backend.enums.Role;
import com.example.backend.models.dtos.AppUserDTO;
import com.example.backend.models.entities.AppEvent;
import com.example.backend.models.entities.AppUser;
import com.example.backend.repositories.AppUserRepository;
import com.example.backend.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppUserService implements UserDetailsService {

    private final AppUserRepository appUserRepository;
    private final EventRepository eventRepository;

    public AppUserDTO createUser(AppUserDTO appUserDto) {
        log.debug("Creating user with email: {}", appUserDto.getEmail());
        AppUser entity = toEntity(appUserDto);
        log.debug("Setting default role to USER for user: {}", appUserDto.getEmail());
        entity.setRole(Role.USER);
        entity = appUserRepository.save(entity);
        log.debug("User created with ID: {}", entity.getId());
        return toDto(entity);
    }

    public List<AppUserDTO> getUserList() {
        log.debug("Retrieving user list");
        List<AppUser> users = appUserRepository.findAll();
        List<AppUserDTO> result = new ArrayList<>();
        for (AppUser user : users) {
            result.add(toDto(user));
            log.debug("User added to list: {}", user.getEmail());
        }
        log.debug("Total users retrieved: {}", result.size());
        return result;
    }

    public AppUserDTO getUser(Long id) {
        log.debug("Retrieving user with id: {}", id);
        AppUser entity = getEntity(id);
        log.debug("User retrieved: {}", entity.getEmail());
        return toDto(entity);
    }

    public AppUserDTO getUserByEmail(String email) {
        log.debug("Retrieving user with email: {}", email);
        AppUser entity = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.debug("User retrieved: {}", entity.getEmail());
        return toDto(entity);
    }

    public AppUserDTO updateUser(Long id, AppUserDTO appUserDto) {
        log.debug("Updating user with id: {}", id);
        AppUser entity = getEntity(id);
        log.debug("Current user details: {}", entity);
        entity.setEmail(appUserDto.getEmail());
        entity.setFirstName(appUserDto.getFirstName());
        entity.setLastName(appUserDto.getLastName());
        entity.setNickname(appUserDto.getNickname());
        entity.setBio(appUserDto.getBio());
        entity.setRole(appUserDto.getRole());
        log.debug("Updated user details: {}", entity);
        AppUser updatedUser = appUserRepository.save(entity);
        log.debug("User updated with ID: {}", updatedUser.getId());
        return toDto(updatedUser);
    }

    public void deleteUser(Long id) {
        log.debug("Deleting user with id: {}", id);
        appUserRepository.deleteById(id);
        log.debug("User deleted with id: {}", id);
    }

    public void addFriend(Long userId, Long friendId) {
        log.debug("Adding friend with ID: {} to user with ID: {}", friendId, userId);
        AppUser user = getEntity(userId);
        AppUser friend = getEntity(friendId);
        user.getFriends().add(friend);
        friend.getFriends().add(user);
        appUserRepository.save(user);
        appUserRepository.save(friend);
        log.debug("Friend added successfully.");
    }

    public void removeFriend(Long userId, Long friendId) {
        log.debug("Removing friend with ID: {} from user with ID: {}", friendId, userId);
        AppUser user = getEntity(userId);
        AppUser friend = getEntity(friendId);
        user.getFriends().remove(friend);
        friend.getFriends().remove(user);
        appUserRepository.save(user);
        appUserRepository.save(friend);
        log.debug("Friend removed successfully.");
    }

    public void attendEvent(Long eventId, Long userId) {
        log.debug("User with ID: {} attending event with ID: {}", userId, eventId);
        AppUser user = getEntity(userId);
        AppEvent event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        user.getEventsAttending().add(event);
        appUserRepository.save(user);
        log.debug("User attended the event successfully.");
    }

    public void unattendEvent(Long eventId, Long userId) {
        log.debug("User with ID: {} unattending event with ID: {}", userId, eventId);
        AppUser user = getEntity(userId);
        AppEvent event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        user.getEventsAttending().remove(event);
        appUserRepository.save(user);
        log.debug("User unattended the event successfully.");
    }

    private AppUser getEntity(Long id) {
        log.debug("Fetching user entity with id: {}", id);
        Optional<AppUser> userOptional = appUserRepository.findById(id);
        if (userOptional.isPresent()) {
            log.debug("User found: {}", userOptional.get().getEmail());
            return userOptional.get();
        } else {
            log.error("User not found with id: {}", id);
            throw new RuntimeException("User not found");
        }
    }

    private static AppUserDTO toDto(AppUser user) {
        log.debug("Converting entity to DTO: {}", user);
        return new AppUserDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getNickname(),
                user.getBio(),
                user.getRole()
        );
    }

    private AppUser toEntity(AppUserDTO appUserDto) {
        log.debug("Converting DTO to entity: {}", appUserDto);
        AppUser user = new AppUser();
        user.setEmail(appUserDto.getEmail());
        user.setFirstName(appUserDto.getFirstName());
        user.setLastName(appUserDto.getLastName());
        user.setNickname(appUserDto.getNickname());
        user.setBio(appUserDto.getBio());
        user.setRole(appUserDto.getRole());
        log.debug("Converted entity: {}", user);
        return user;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Loading user by username: {}", username);
        AppUser user = appUserRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        log.debug("User found: {}, with roles: {}", user.getEmail(), user.getRole().getAuthorities());
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getRole().getAuthorities()
        );
    }
}
