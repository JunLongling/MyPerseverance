package com.myperseverance.service;

import java.util.List;

import com.myperseverance.model.User;
import com.myperseverance.repository.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(login)
                .or(() -> userRepository.findByEmail(login))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + login));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername()) // keep username as principal
                .password(user.getPassword())
                .accountExpired(false)
                .accountLocked(false)
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}