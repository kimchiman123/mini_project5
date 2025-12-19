"use client";

import { useState } from "react";
import Link from "next/link";

export default function FindPasswordPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [tempPassword, setTempPassword] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFindPassword = async () => {
        if (!email || !name || !phone) {
            alert("이메일 / 이름 / 전화번호를 모두 입력해주세요.");
            return;
        }

        setLoading(true);
        setTempPassword(null);

        try {
            const response = await fetch("/api/user/find-pw", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, name, phone }),
            });

            const result = await response.json();

            if (!response.ok || result.status !== "success") {
                alert(result.message || "비밀번호 찾기에 실패했습니다.");
                return;
            }

            // 임시 비밀번호 화면에 보여주기
            setTempPassword(result.data.tempPassword);
        } catch (err) {
            console.error(err);
            alert("서버와 통신 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* 왼쪽 예시 이미지 */}
                <div style={styles.leftBox}>
                    <img
                        src="https://image.yes24.com/goods/987654?random=1"
                        alt="book"
                        style={styles.bookImg}
                    />
                </div>

                {/* 오른쪽 비밀번호 찾기 폼 */}
                <div style={styles.rightBox}>
                    <h2 style={styles.title}>비밀번호 찾기</h2>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>가입 이메일</label>
                        <input
                            type="email"
                            placeholder="가입하신 이메일을 입력하세요"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>이름</label>
                        <input
                            type="text"
                            placeholder="이름을 입력하세요"
                            style={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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

                    <button
                        style={styles.mainButton}
                        onClick={handleFindPassword}
                        disabled={loading}
                    >
                        {loading ? "처리 중..." : "임시 비밀번호 발급"}
                    </button>

                    {tempPassword && (
                        <div style={styles.resultBox}>
                            <p style={{ marginBottom: 6 }}>발급된 임시 비밀번호</p>
                            <p style={styles.tempPw}>{tempPassword}</p>
                            <p style={{ fontSize: 13, color: "#555" }}>
                                로그인 후 마이페이지에서 비밀번호를 꼭 변경해주세요.
                            </p>
                        </div>
                    )}

                    <div style={styles.bottomLinks}>
                        <Link href="/login">
                            <span style={styles.linkText}>로그인 화면으로 돌아가기</span>
                        </Link>
                        <Link href="/find/id">
                            <span style={styles.linkText}>ID 찾기</span>
                        </Link>
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
        alignItems: "flex-start",
        paddingTop: "60px",
        backgroundColor: "#ffffff",
    },
    container: {
        maxWidth: "1300px",
        padding: "40px 60px",
        display: "flex",
        gap: "60px",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        boxShadow: "0 0 15px rgba(0,0,0,0.10)",
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
        width: "450px",
        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
    },
    title: {
        fontSize: "22px",
        textAlign: "center",
        marginBottom: "30px",
        fontWeight: "600",
    },
    inputGroup: { marginBottom: "18px" },
    label: { display: "block", marginBottom: "5px", fontSize: "14px" },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "14px",
    },
    mainButton: {
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
    resultBox: {
        marginTop: "20px",
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "#f0fff4",
        border: "1px solid #a5d6a7",
        textAlign: "center",
    },
    tempPw: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "4px",
        color: "#0f9d58",
    },
    bottomLinks: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
    },
    linkText: {
        fontSize: "13px",
        color: "#0f9d58",
        cursor: "pointer",
        textDecoration: "underline",
    },
};