package com.aivle0102.book.service.impl;

import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.repository.UserInfoRepository;
import com.aivle0102.book.service.LoginService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    private final UserInfoRepository userInfoRepository;

    @Override
    public UserInfo getUser(UserInfo user) {

        String email = user.getEmail();
        String pw = user.getPassword();

        return userInfoRepository
                .findByEmailAndPassword(email, pw)
                .orElseThrow(() -> new RuntimeException("로그인 실패"));
    }
}
