package org.project.bank2.controller;

import org.project.bank2.dto.UserReqDTO;
import org.project.bank2.dto.UserresDTO;
import org.project.bank2.model.User;
import org.project.bank2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserresDTO> createUser(@RequestBody UserReqDTO dto) {
        return ResponseEntity.ok(userService.createUser(dto));

    }

    @GetMapping("/{id}")
    public ResponseEntity<UserresDTO> findById( @PathVariable Long id){
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserresDTO>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserresDTO >updateUser(@PathVariable Long id, @RequestBody UserReqDTO user)
    {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.ok("User has been deleted");
    }

}
