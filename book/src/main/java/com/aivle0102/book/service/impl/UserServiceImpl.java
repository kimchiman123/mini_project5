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

        // 1) 이메일 중복 체크
        boolean exists = userInfoRepository.findByEmail(request.getEmail()).isPresent();
        if (exists) {
            // 400 응답으로 내려줄 메시지
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }

        // 2) 엔티티 생성
        UserInfo user = new UserInfo();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setName(request.getName());
        user.setPhone(request.getPhone());

        // 3) 저장 후 리턴
        return userInfoRepository.save(user);
    }
}
