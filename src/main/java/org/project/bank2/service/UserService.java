package org.project.bank2.service;

import org.project.bank2.dto.UserReqDTO;
import org.project.bank2.dto.UserresDTO;
import org.project.bank2.model.User;
import org.project.bank2.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private  UserRepo userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public UserresDTO createUser(UserReqDTO dto)
    {
        User user = new User();

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");

        User savedUser = userRepo.save(user);

        UserresDTO response = new UserresDTO();

        response.setId(savedUser.getId());
        response.setFirstName(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());

        return response;
    }

        public UserresDTO getUserById(Long id)
    {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToResponse(user);
    }
    private UserresDTO mapToResponse(User user) {

        UserresDTO dto = new UserresDTO();

        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());

        return dto;
    }

    public List<UserresDTO> getAllUsers() {

        return userRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public UserresDTO updateUser(Long id, UserReqDTO updatedUser)
    {
        User user = userRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());


        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }


        if (updatedUser.getRole() != null && !updatedUser.getRole().isBlank()) {
            user.setRole(updatedUser.getRole());
        }

        User savedUser = userRepo.save(user);

        return mapToResponse(savedUser);
    }

    public void deleteUser(Long id)
    {
        User user = userRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        userRepo.delete(user);
    }


}
