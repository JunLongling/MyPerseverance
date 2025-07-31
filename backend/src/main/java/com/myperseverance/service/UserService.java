package com.myperseverance.service;

import com.myperseverance.dto.SignupRequest;
import com.myperseverance.dto.UserProfile;
import com.myperseverance.model.User;
import com.myperseverance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean signup(SignupRequest request) {
        if (!isEmailAvailable(request.getEmail()) || !isUsernameAvailable(request.getUsername())) {
            return false;
        }

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .registeredAt(Instant.now())
                .build();

        userRepository.save(user);
        return true;
    }

    public Optional<UserProfile> getUserProfileByUsername(String requester, String targetUsername) {
        if (requester == null || !requester.equals(targetUsername)) {
            return Optional.empty();
        }
        return userRepository.findByUsername(targetUsername)
                .map(this::toUserProfile);
    }

    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    private UserProfile toUserProfile(User user) {
        return UserProfile.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .registeredAt(user.getRegisteredAt())
                .build();
    }
}
