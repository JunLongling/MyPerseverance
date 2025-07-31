package com.myperseverance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignInRequest {
    @NotBlank(message = "Email or username is required")
    private String signIn;

    @NotBlank(message = "Password is required")
    private String password;
}
