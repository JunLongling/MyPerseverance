package com.myperseverance.service;

import com.myperseverance.dto.SignupRequest;
import com.myperseverance.model.User;
import com.myperseverance.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return false;
        }
        String hashed = passwordEncoder.encode(request.getPassword());
        User user = User.builder()
                .email(request.getEmail())
                .password(hashed)
                .build();
        userRepository.save(user);
        return true;
    }
}
