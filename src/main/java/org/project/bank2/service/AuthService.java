package org.project.bank2.service;


import org.project.bank2.dto.auth.AuthResponse;
import org.project.bank2.dto.auth.LoginRequest;
import org.project.bank2.dto.auth.RegisterRequest;
import org.project.bank2.model.User;
import org.project.bank2.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    public AuthResponse register(RegisterRequest dto){
        if(userRepo.existsByEmail(dto.getEmail())){
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");
        userRepo.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token,user.getEmail(),user.getRole());
    }

    public AuthResponse login(LoginRequest dto){
        User user = userRepo.findByEmail(dto.getEmail()).orElseThrow(()->new RuntimeException("Invalid email or Password"));

        boolean matches = passwordEncoder.matches(dto.getPassword(),user.getPassword());
        if(!matches){
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token,user.getEmail(),user.getRole());
    }

}
