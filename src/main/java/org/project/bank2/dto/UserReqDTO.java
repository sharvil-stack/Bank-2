package org.project.bank2.dto;

import lombok.Data;

@Data
public class UserReqDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}
