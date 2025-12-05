"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Stack, CardMedia } from "@mui/material";

const mockData = [ //백엔드에서 안가져와지면 임시 데이터 쓰게함
    {
        id: 1,
        title: "그해 여름이야기",
        description: "임시 설명 텍스트...",
        image: "https://image.yes24.com/goods/123456?random=1",
    },
    {
        id: 2,
        title: "엄마가 보고싶어",
        description: "임시 설명 텍스트...",
        image: "https://image.yes24.com/goods/987654?random=1",
    },
];

export default function MainPage() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/book/list")
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    setBooks(data.data);
                } else {
                    setBooks(mockData); // API 실패 → 임시 데이터 사용
                }
            })
            .catch(() => {
                setBooks(mockData); // 서버 연결 안 되면 mockData로 대체
            });
    }, []);

    return (
        <Box sx={{ width: "100%", mt: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, ml: 2 }}>
                작품 목록
            </Typography>

            <Stack spacing={4} sx={{ px: 2 }}>
                {books.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                            alignItems: "center",
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#f8f4f2",
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={item.image || "https://placehold.co/130x190"} // 이미지 없으면 기본 이미지
                            alt={item.title}
                            sx={{
                                width: 130,
                                height: 190,
                                borderRadius: 2,
                                objectFit: "cover",
                            }}
                        />

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                {item.title}
                            </Typography>

                            <Typography sx={{ color: "#555", lineHeight: 1.5 }}>
                                {item.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
