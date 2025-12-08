package com.aivle0102.book.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserSignUpRequest {

    private String email;
    private String password;
    private String name;
    private String phone;  // 선택값이면 null 가능
}
