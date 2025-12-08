package com.aivle0102.book.repository;

import com.aivle0102.book.domain.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    // 로그인
    Optional<UserInfo> findByEmailAndPassword(String email, String password);

    // 회원가입 중복 체크용
    Optional<UserInfo> findByEmail(String email);

    // ID 찾기
    Optional<UserInfo> findByNameAndPhone(String name, String phone);

    // PASSWORD 찾기
    Optional<UserInfo> findByEmailAndNameAndPhone(String email, String name, String phone);
}
