package com.aivle0102.book.controller;

import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.service.LoginService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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


    //  회원가입

    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> signUp(
            @Valid @RequestBody UserSignUpRequest request,   // DTO 유효성 검사
            BindingResult bindingResult                       // @Valid 검사 결과
    ) {

        Map<String, Object> body = new HashMap<>();

        // 1) DTO 유효성 검사 실패 (@NotBlank, @Email, @Size 등)
        if (bindingResult.hasErrors()) {
            // 에러 하나만 꺼내서 메시지 반환
            String message = bindingResult.getFieldErrors().get(0).getDefaultMessage();

            body.put("status", "error");
            body.put("message", message);

            // code: 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }

        try {
            // 2) 실제 회원가입 비즈니스 로직
            UserInfo user = userService.signUp(request);

            Map<String, Object> data = new HashMap<>();
            data.put("userId", user.getUserId());
            data.put("email", user.getEmail());

            body.put("status", "success");
            body.put("message", "회원가입 성공");
            body.put("data", data);

            // code: 201
            return ResponseEntity.status(HttpStatus.CREATED).body(body);

        } catch (IllegalStateException e) {    // 3) 이미 가입된 이메일 같은 비즈니스 예외
            body.put("status", "error");
            body.put("message", e.getMessage());

            // code: 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);

        } catch (Exception e) {                // 4) 그 외 서버 내부 에러
            body.put("status", "error");
            body.put("message", "서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.");

            // code: 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    // ID 찾기
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String phone = request.get("phone");

        UserInfo user = userService.findByNameAndPhone(name, phone);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "일치하는 정보가 없습니다."));
        }

        return ResponseEntity.ok(Map.of("email", user.getEmail()));
    }

    // PASSWORD 찾기
    @PostMapping("/find-pw")
    public ResponseEntity<?> findPassword(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String name = request.get("name");
        String phone = request.get("phone");

        Map<String, Object> body = new HashMap<>();

        try {
            String tempPassword = userService.resetPassword(email, name, phone);

            Map<String, Object> data = new HashMap<>();
            data.put("tempPassword", tempPassword);

            body.put("status", "success");
            body.put("message", "임시 비밀번호가 발급되었습니다.");
            body.put("data", data);

            return ResponseEntity.ok(body);

        } catch (IllegalArgumentException e) {
            body.put("status", "error");
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);

        } catch (Exception e) {
            body.put("status", "error");
            body.put("message", "서버 내부 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }
}
