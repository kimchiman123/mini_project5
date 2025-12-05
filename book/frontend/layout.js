'use client';


import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 나중에 css 파일 만들어서 적용해도 됨.
// Google Fonts
import "@fontsource/nanum-gothic/700.css";   // Bold for AppBar/Button
import "@fontsource/gowun-dodum/400.css";    // Detail text

// MUI Theme 설정
const theme = createTheme({
    typography: {
        fontFamily: "Gowun Dodum, sans-serif", // 기본 텍스트
        h6: {
            fontFamily: "Nanum Gothic, sans-serif",
            fontWeight: 700,
        },
        button: {
            fontFamily: "Nanum Gothic, sans-serif",
            fontWeight: 700,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    fontFamily: "Nanum Gothic, sans-serif",
                    fontWeight: 700,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: "Nanum Gothic, sans-serif",
                    fontWeight: 700,
                },
            },
        },
    },
});


// 공통 구조
export default function Layout({ children }) {
    return (
        <html lang="ko">
        <head>
            <meta charSet="utf-8" />
        </head>

        <body>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                {/* 상단 공용 AppBar */}
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">도서 관리 시스템</Typography>
                    </Toolbar>
                </AppBar>

                {/* 페이지 공통 컨테이너 */}
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    {children}
                </Container>
            </ThemeProvider>
        </Provider>
        </body>
        </html>
    );
}
