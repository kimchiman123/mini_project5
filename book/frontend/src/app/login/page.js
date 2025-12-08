"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        console.log("로그인 시도:", { email, password });

        try {
            const response = await fetch("http://localhost:8080/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                credentials: "include"
            });

            const result = await response.json();
            console.log("서버 응답:", result);

            // 응답 코드 확인
            if (!response.ok || result.status !== "success") {
                alert("❌ 로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
                return;
            }

            // 로그인 정보 저장
            // (백엔드가 내려주는 구조: userId, email, message, status)
            localStorage.setItem("user", JSON.stringify({
                userId: result.userId,
                email: result.email
            }));

            alert("✔ 로그인 성공!");
            window.location.href = "/mainpage";

        } catch (error) {
            console.error("로그인 오류:", error);
            alert("서버와 연결할 수 없습니다.");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* 왼쪽 책 이미지 */}
                <div style={styles.leftBox}>
                    <img
                        src="https://image.yes24.com/goods/123456?random=1"
                        alt="book"
                        style={styles.bookImg}
                    />
                </div>

                {/* 오른쪽 로그인 박스 */}
                <div style={styles.rightBox}>

                    <h2 style={styles.serviceName}>서비스 이름</h2>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>ID</label>
                        <input
                            type="text"
                            placeholder="이메일 입력"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="비밀번호 입력"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button style={styles.loginButton} onClick={handleLogin}>
                        Log in
                    </button>

                    <div style={styles.bottomButtons}>
                        <Link href="/signup">
                            <button style={styles.subButton}>✔ 회원가입</button>
                        </Link>
                        <button style={styles.subButton}>✔ ID/PW 찾기</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

const styles = {
    page: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",   // 중앙 → 상단에 가까워짐
        paddingTop: "60px",         // 원하는 만큼 내리기
        backgroundColor: "#ffffff",
    },

    container: {
        maxWidth: "1300px",
        padding: "40px 60px",
        display: "flex",
        gap: "60px",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        boxShadow: "0 0 15px rgba(0,0,0,0.10)"

    },


    leftBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    bookImg: {
        width: "320px",
        height: "auto",
    },

    rightBox: {
        padding: "40px",
        backgroundColor: "white",
        borderRadius: "10px",
        width: "450px",              // ← 고정폭 설정! (필수)
        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
    },

    serviceName: {
        fontSize: "22px",
        textAlign: "center",
        marginBottom: "30px",
        fontWeight: "600",
    },

    inputGroup: { marginBottom: "20px" },
    label: { display: "block", marginBottom: "5px", fontSize: "14px" },

    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "14px",
    },

    loginButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#0f9d58",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
    },

    bottomButtons: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "15px",
    },

    subButton: {
        backgroundColor: "#0f9d58",
        padding: "10px 20px",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        cursor: "pointer",
    },
};
