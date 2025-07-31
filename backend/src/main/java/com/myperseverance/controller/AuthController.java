package com.myperseverance.controller;

import com.myperseverance.dto.*;
import com.myperseverance.service.UserService;
import com.myperseverance.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        boolean success = userService.signup(request);
        if (!success) {
            return ResponseEntity.badRequest().body("Email or username already in use");
        }
        return ResponseEntity.ok("Signup successful");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@Valid @RequestBody SignInRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getSignIn(), request.getPassword())
            );
            String accessToken = jwtUtil.generateToken(request.getSignIn());
            String refreshToken = jwtUtil.generateRefreshToken(request.getSignIn());

            // Set refresh token as secure HttpOnly cookie
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(true) // set to false for local testing without HTTPS
                    .path("/api")
                    .maxAge(7 * 24 * 60 * 60) // 7 days
                    .sameSite("None")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new SignInResponse(accessToken, null));
        } catch (BadCredentialsException | UsernameNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }


    @PostMapping("/signout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api")
                .maxAge(0)
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        String newAccessToken = jwtUtil.generateToken(username);
        return ResponseEntity.ok(new AccessTokenResponse(newAccessToken));
    }


    @GetMapping("/check-email")
    public ResponseEntity<AvailabilityResponse> checkEmailAvailability(@RequestParam String email) {
        if (email == null || email.isBlank()) return ResponseEntity.ok(new AvailabilityResponse(true));
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        if (!email.matches(emailRegex)) return ResponseEntity.ok(new AvailabilityResponse(true));
        return ResponseEntity.ok(new AvailabilityResponse(userService.isEmailAvailable(email)));
    }

    @GetMapping("/check-username")
    public ResponseEntity<AvailabilityResponse> checkUsernameAvailability(@RequestParam String username) {
        if (username == null || username.isBlank()) return ResponseEntity.ok(new AvailabilityResponse(true));
        String usernameRegex = "^[A-Za-z][A-Za-z0-9_]{2,19}$";
        if (!username.matches(usernameRegex)) return ResponseEntity.ok(new AvailabilityResponse(true));
        return ResponseEntity.ok(new AvailabilityResponse(userService.isUsernameAvailable(username)));
    }
}
