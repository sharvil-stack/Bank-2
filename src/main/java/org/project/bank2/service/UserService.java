package org.project.bank2.service;

import org.project.bank2.model.User;
import org.project.bank2.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private  UserRepo userRepo;

    public User createUser(User user)
    {
        return userRepo.save(user);
    }

    public User getUserById(Long id)
    {
        return userRepo.findById(id).orElseThrow(()-> new RuntimeException("User with id " + id + " not found"));
    }

    public List<User> getAllUsers()
    {
        return userRepo.findAll();
    }

    public User updateUser(Long id, User updatedUser)
    {
        User user = getUserById(id);
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());

        return userRepo.save(user);
    }

    public void deleteUser(Long id)
    {
        User user = getUserById(id);
        userRepo.delete(user);
    }

}
