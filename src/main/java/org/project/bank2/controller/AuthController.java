package org.project.bank2.controller;

import jakarta.validation.Valid;
import org.project.bank2.dto.auth.AuthResponse;
import org.project.bank2.dto.auth.LoginRequest;
import org.project.bank2.dto.auth.RegisterRequest;
import org.project.bank2.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest dto
    ) {

        return ResponseEntity.ok(
                authService.register(dto)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

}
