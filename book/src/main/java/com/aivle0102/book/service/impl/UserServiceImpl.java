package com.aivle0102.book.service.impl;

import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.dto.UserSignUpRequest;
import com.aivle0102.book.repository.UserInfoRepository;
import com.aivle0102.book.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserInfoRepository userInfoRepository;

    @Override
    @Transactional
    public UserInfo signUp(UserSignUpRequest request) {

        // 1) 이메일 중복 체크 (이미 해놨으면 그대로 두고)
        userInfoRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    throw new IllegalStateException("이미 가입된 이메일입니다.");
                });

        // 2) 입력값 정리 + 유저 엔티티 생성
        UserInfo user = new UserInfo();
        user.setEmail(request.getEmail().trim().toLowerCase()); // 앞뒤 공백 제거 + 소문자 통일
        user.setPassword(request.getPassword());                 // 실서비스면 여기서 암호화
        user.setName(request.getName().trim());
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);

        // 3) 저장
        return userInfoRepository.save(user);
    }
}