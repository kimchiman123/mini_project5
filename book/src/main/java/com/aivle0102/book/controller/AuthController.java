package com.aivle0102.book.controller;

import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.service.LoginService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aivle0102.book.dto.UserSignUpRequest;
import com.aivle0102.book.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AuthController {

    private final LoginService loginService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> LoginForm_Page(@RequestBody UserInfo user, HttpSession session) throws Exception {

        UserInfo loginUser = loginService.getUser(user);
        session.setAttribute("user", loginUser.getUserId());

        return ResponseEntity.ok("로그인 성공");
    }


    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody UserSignUpRequest request) {

        Map<String, Object> body = new HashMap<>();

        try {
            UserInfo user = userService.signUp(request);

            Map<String, Object> data = new HashMap<>();
            data.put("userId", user.getUserId());
            data.put("email", user.getEmail());

            body.put("status", "success");
            body.put("message", "회원가입 성공");
            body.put("data", data);

            // code: 201
            return ResponseEntity.status(HttpStatus.CREATED).body(body);

        } catch (IllegalStateException e) { // 이미 가입된 이메일
            body.put("status", "error");
            body.put("message", e.getMessage());

            // code: 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);

        } catch (Exception e) { // 기타 서버 에러
            body.put("status", "error");
            body.put("message", "서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.");

            // code: 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }
}
