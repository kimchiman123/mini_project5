package com.aivle0102.book.repository;

import com.aivle0102.book.domain.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    Optional<UserInfo> findByEmailAndPassword(String email, String password);

    // 회원가입 중복 확인용
    Optional<UserInfo> findByEmail(String email);
}
