"use client";

import { useState } from "react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [phone, setPhone] = useState("");

    const handleSignup = async () => {

        //로그 출력
        const userData = {
            name,
            email,
            password,
            passwordCheck,
            phone
        };

        // 🔥 프론트에서 입력한 값 모두 출력
        console.log("입력한 회원 정보:", userData);

        if (password !== passwordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await fetch("/api/user/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    phone: phone
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "회원가입 실패");
                return;
            }

            alert("회원가입 성공!");
            window.location.href = "/login"; // 가입 후 로그인 페이지로 이동

        } catch (error) {
            console.error("회원가입 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>회원가입</h2>
                <p style={styles.subtitle}>서비스 이용을 위한 정보를 입력해주세요.</p>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>이름</label>
                    <input
                        type="text"
                        placeholder="실명을 입력해주세요"
                        style={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>ID (이메일)</label>
                    <input
                        type="email"
                        placeholder="사용할 이메일"
                        style={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>비밀번호</label>
                    <input
                        type="password"
                        placeholder="8자 이상, 영문/숫자/특수문자 포함"
                        style={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>비밀번호 확인</label>
                    <input
                        type="password"
                        placeholder="비밀번호를 다시 입력"
                        style={styles.input}
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>전화번호</label>
                    <input
                        type="text"
                        placeholder="예: 01012345678"
                        style={styles.input}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <button style={styles.submitButton} onClick={handleSignup}>
                    가입 완료
                </button>

                <p style={styles.footerText}>
                    이미 계정이 있으신가요?
                    <span
                        style={styles.loginLink}
                        onClick={() => window.location.href = "/login"}
                    >
                        로그인 페이지로 돌아가기
                    </span>
                </p>

            </div>
        </div>
    );
}

const styles = {
    page: {
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        width: "430px",
        backgroundColor: "white",
        padding: "28px 32px",
        borderRadius: "12px",
        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",

        transform: "translateY(-20px)",   // ★ 회원가입 카드 더 위로 올림
    },

    title: {
        fontSize: "22px",              // ⭐ 제목도 살짝 줄임
        fontWeight: "700",
        textAlign: "center",
        marginBottom: "8px",
    },

    subtitle: {
        textAlign: "center",
        fontSize: "13px",
        color: "#666",
        marginBottom: "25px",
    },

    inputGroup: {
        marginBottom: "15px",
    },

    label: {
        display: "block",
        fontSize: "13px",
        color: "#333",
        marginBottom: "6px",
        fontWeight: "600",
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "10px",
        fontSize: "13px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        outline: "none",
    },

    submitButton: {
        marginTop: "18px",
        width: "100%",
        padding: "12px",              // 기존 14px → 12px
        backgroundColor: "#497ff5",
        color: "white",
        fontSize: "15px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
    },

    footerText: {
        marginTop: "18px",
        fontSize: "12px",
        textAlign: "center",
        color: "#666",
    },

    loginLink: {
        color: "#497ff5",
        cursor: "pointer",
        marginLeft: "4px",
        fontWeight: "600",
    },
};
