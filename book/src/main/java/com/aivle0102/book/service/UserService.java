package com.aivle0102.book.service;

import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.dto.UserSignUpRequest;

public interface UserService {

    // 회원가입 메서드
    UserInfo signUp(UserSignUpRequest request);

    // ID 찾기
    UserInfo findByNameAndPhone(String name, String phone);

    // PASSWORD 찾기
    String resetPassword(String email, String name, String phone);
}
