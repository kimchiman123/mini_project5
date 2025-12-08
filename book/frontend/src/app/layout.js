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

export default function RootLayout({ children }) {
    const [isLogin, setIsLogin] = useState(false);

    // 페이지 로드 시 localStorage에서 로그인 여부 확인
    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLogin(!!user);
    }, []);

    // 로그아웃 함수
    const handleLogout = () => {
        const ok = window.confirm("정말 로그아웃 하시겠습니까?");
        if (!ok) return; // 취소하면 아무 일도 하지 않음

        localStorage.removeItem("user");
        setIsLogin(false);
        window.location.href = "/mainpage";
    };


    return (
        <html lang="ko">
        <body>
        <ThemeProvider theme={theme}>
            <AppBar position="static" sx={{ boxShadow: 2 }}>
                <Toolbar
                    sx={{
                        minHeight: 80,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    {/* 왼쪽 타이틀 */}
                    <Link href="/mainpage" passHref>
                        <Button color="inherit" sx={{ fontSize: 18, fontWeight: 700 }}>
                            도서 관리 시스템
                        </Button>
                    </Link>

                    {/* 오른쪽 메뉴 버튼들 */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {/* 로그인 여부에 따라 버튼 변경 */}
                        {!isLogin ? (
                            <Link href="/login" passHref>
                                <Button color="inherit">로그인</Button>
                            </Link>
                        ) : (
                            <Button color="inherit" onClick={handleLogout}>
                                로그아웃
                            </Button>
                        )}

                        <Link href="/userpage/view" passHref>
                            <Button color="inherit">내 작품 관리</Button>
                        </Link>

                        <Link href="/userpage/create" passHref>
                            <Button color="inherit">새 작품 등록</Button>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* 기존 UI 그대로 */}
            <Container maxWidth="md" sx={{ mt: 4 }}>
                {children}
            </Container>
        </ThemeProvider>
        </body>
        </html>
    );
}
