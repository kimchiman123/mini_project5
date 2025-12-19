"use client";

import { useState } from "react";
import Link from "next/link";

export default function FindIdPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [emailResult, setEmailResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFindId = async () => {
        if (!name || !phone) {
            alert("이름과 전화번호를 모두 입력해주세요.");
            return;
        }

        setLoading(true);
        setEmailResult(null);

        try {
            const response = await fetch("/api/user/find-id", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone }),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "ID를 찾을 수 없습니다.");
                return;
            }

            // 서버에서 { "email": "xxx@yyy.com" } 형태로 내려주므로
            setEmailResult(result.email);
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
                        src="https://image.yes24.com/goods/123456?random=2"
                        alt="book"
                        style={styles.bookImg}
                    />
                </div>

                {/* 오른쪽 ID 찾기 폼 */}
                <div style={styles.rightBox}>
                    <h2 style={styles.title}>ID 찾기</h2>

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
                        onClick={handleFindId}
                        disabled={loading}
                    >
                        {loading ? "처리 중..." : "ID 찾기"}
                    </button>

                    {emailResult && (
                        <div style={styles.resultBox}>
                            <p style={{ marginBottom: 6 }}>가입된 이메일(ID)</p>
                            <p style={styles.resultEmail}>{emailResult}</p>
                            <p style={{ fontSize: 13, color: "#555" }}>
                                이 이메일로 로그인해 주세요.
                            </p>
                        </div>
                    )}

                    <div style={styles.bottomLinks}>
                        <Link href="/login">
                            <span style={styles.linkText}>로그인 화면으로 돌아가기</span>
                        </Link>
                        <Link href="/find/password">
                            <span style={styles.linkText}>비밀번호 찾기</span>
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
        border: "1px solid",
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
    resultEmail: {
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
