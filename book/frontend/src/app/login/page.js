import Link from "next/link";

export default function LoginPage() {
    return (
        <div style={styles.page}>  {/* 전체 화면 중앙 정렬 담당 */}

            <div style={styles.container}>  {/* 회색 박스(card) 시작 */}

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
                        <input type="text" placeholder="Value" style={styles.input} />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input type="password" placeholder="Value" style={styles.input} />
                    </div>

                    <button style={styles.loginButton}>Log in</button>

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
