package com.aivle0102.book.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JoinResponse {
    private int code;          // 201, 400, 500 등
    private String status;     // "success" | "error"
    private String message;    // "회원가입 성공" 등
    private Long userId;       // 성공 시 생성된 사용자 ID
    private String email;      // 어떤 이메일인지
}
