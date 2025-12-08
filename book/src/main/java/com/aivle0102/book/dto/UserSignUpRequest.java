package com.aivle0102.book.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserSignUpRequest {

    // 1) 이메일: 필수 + 형식 체크
    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    // 2) 비밀번호: 필수 + 최소 8자 + 특수문자 추가
    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8~20자여야 합니다.")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;\"'<>,.?/]).{8,20}$",
            message = "비밀번호는 영문, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다."
    )
    private String password;


    // 3) 이름: 필수
    @NotBlank(message = "이름은 필수 입력값입니다.")
    @Size(max = 20, message = "이름은 20자 이하여야 합니다.")
    private String name;

    // 4) 전화번호: 선택이지만, 값이 있으면 형식 체크
    @Pattern(
            regexp = "^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$",
            message = "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)"
    )
    private String phone;
}