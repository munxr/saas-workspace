package com.saas.workspace.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String companyName;
    private String fullName;
    private String email;
    private String password;
}