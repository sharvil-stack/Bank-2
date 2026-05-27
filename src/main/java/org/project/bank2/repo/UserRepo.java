package org.project.bank2.repo;

import org.project.bank2.dto.UserReqDTO;
import org.project.bank2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.lang.ScopedValue;


public interface UserRepo extends JpaRepository<User, Long> {


}
