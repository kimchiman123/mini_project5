// app/password/change/page.js
"use client";

import { useEffect, useState } from "react";

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordCheck, setNewPasswordCheck] = useState("");
    const [userId, setUserId] = useState(null);

    // 로그인 여부 확인 (localStorage의 user 사용)
    useEffect(() => {
        const stored = typeof window !== "undefined"
            ? localStorage.getItem("user")
            : null;

        if (!stored) {
            alert("로그인이 필요한 서비스입니다.");
            window.location.href = "/login";
            return;
        }

        try {
            const user = JSON.parse(stored);
            setUserId(user.userId);   // 로그인 때 저장해 둔 userId 사용
        } catch (e) {
            console.error("user 파싱 오류:", e);
            alert("로그인 정보를 다시 확인해 주세요.");
            window.location.href = "/login";
        }
    }, []);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !newPasswordCheck) {
            alert("모든 항목을 입력해 주세요.");
            return;
        }

        if (newPassword !== newPasswordCheck) {
            alert("새 비밀번호와 확인이 일치하지 않습니다.");
            return;
        }

        if (!userId) {
            alert("사용자 정보를 찾을 수 없습니다. 다시 로그인 후 시도해 주세요.");
            return;
        }

        try {
            const res = await fetch("/api/user/change-pw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    currentPassword,
                    newPassword,
                }),
            });

            const result = await res.json();
            console.log("🔐 /user/change-pw 응답:", result);

            if (!res.ok || result.status !== "success") {
                alert(result.message || "비밀번호 변경에 실패했습니다.");
                return;
            }

            alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");

            // 로그인 정보 초기화 후 로그인 화면으로 이동
            localStorage.removeItem("user");
            window.location.href = "/login";
        } catch (err) {
            console.error("비밀번호 변경 오류:", err);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>비밀번호 변경</h2>
                <p style={styles.subtitle}>
                    현재 비밀번호를 확인한 후 새 비밀번호로 변경합니다.
                </p>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>현재 비밀번호</label>
                    <input
                        type="password"
                        style={styles.input}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>새 비밀번호</label>
                    <input
                        type="password"
                        placeholder="8자 이상, 영문/숫자/특수문자 포함"
                        style={styles.input}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>새 비밀번호 확인</label>
                    <input
                        type="password"
                        style={styles.input}
                        value={newPasswordCheck}
                        onChange={(e) => setNewPasswordCheck(e.target.value)}
                    />
                </div>

                <button style={styles.submitButton} onClick={handleChangePassword}>
                    비밀번호 변경
                </button>
            </div>
        </div>
    );
}

const styles = {
    page: {
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
        backgroundColor: "#f0f0f0",
    },
    card: {
        width: "430px",
        backgroundColor: "white",
        padding: "28px 32px",
        borderRadius: "12px",
        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
    },
    title: {
        fontSize: "22px",
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
        padding: "10px",
        fontSize: "13px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        outline: "none",
    },
    submitButton: {
        marginTop: "18px",
        width: "100%",
        padding: "12px",
        backgroundColor: "#497ff5",
        color: "white",
        fontSize: "15px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
    },
};
