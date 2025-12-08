package com.aivle0102.book.service;

import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.dto.UserSignUpRequest;

public interface UserService {

    // 회원가입 메서드
    UserInfo signUp(UserSignUpRequest request);
}
