"use client";

import Link from "next/link";
import { AppBar, Toolbar, Container, Button, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

import "@fontsource/nanum-gothic";
import "@fontsource/gowun-dodum";

const theme = createTheme({
    typography: {
        fontFamily: "Gowun Dodum, sans-serif",
        h4: {
            fontFamily: "Nanum Gothic, sans-serif",
            fontWeight: 700,
        },
        h6: {
            fontFamily: "Nanum Gothic, sans-serif",
            fontWeight: 700,
        },
        button: {
            fontFamily: "Nanum Gothic, sans-serif",
            fontWeight: 700,
        },
    },
});

export default function AppLayout({ children }) {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("/api/user/me", {
                    method: "GET",
                    credentials: "include",  // 세션 쿠키 포함
                });

                const result = await res.json().catch(() => ({}));
                console.log("🧩 /user/me 응답:", result);

                if (!res.ok || result.status !== "success" || !result.data) {
                    // 세션 없음 → 프론트 로그인 정보도 삭제
                    localStorage.removeItem("user");
                    setIsLogin(false);
                    return;
                }

                // 세션 유효 → 프론트에도 반영
                const user = {
                    userId: result.data.userId,
                    email: result.data.email,
                };
                localStorage.setItem("user", JSON.stringify(user));
                setIsLogin(true);
            } catch (e) {
                console.error("세션 확인 오류:", e);
                setIsLogin(false);
            }
        };

        // 브라우저에서만 호출되도록 보장 (SSR 방지용)
        if (typeof window !== "undefined") {
            checkSession();
        }
    }, []);

    const handleLogout = async () => {
        const ok = window.confirm("정말 로그아웃 하시겠습니까?");
        if (!ok) return;

        try {
            await fetch("/api/user/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error("로그아웃 요청 실패(무시 가능):", e);
        }

        localStorage.removeItem("user");
        setIsLogin(false);
        window.location.href = "/mainpage";
    };

    const requireLogin = (path) => {
        if (!isLogin) {
            alert("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동합니다.");
            window.location.href = "/login";
            return;
        }
        window.location.href = path;
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" sx={{ boxShadow: 2 }}>
                <Toolbar
                    sx={{
                        minHeight: 80,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Link href="/mainpage">
                        <Button color="inherit" sx={{ fontSize: 18, fontWeight: 700 }}>
                            도서 관리 시스템
                        </Button>
                    </Link>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        {!isLogin ? (
                            <Link href="/login">
                                <Button color="inherit">로그인</Button>
                            </Link>
                        ) : (
                            <Button color="inherit" onClick={handleLogout}>
                                로그아웃
                            </Button>
                        )}

                        {isLogin && (
                            <Button
                                color="inherit"
                                onClick={() => requireLogin("/password/change")}
                            >
                                비밀번호 변경
                            </Button>
                        )}

                        <Button
                            color="inherit"
                            onClick={() => requireLogin("/userpage/view")}
                        >
                            내 작품 관리
                        </Button>

                        <Button
                            color="inherit"
                            onClick={() => requireLogin("/userpage/create")}
                        >
                            새 작품 등록
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4 }}>
                {children}
            </Container>
        </ThemeProvider>
    );
}
