"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Typography, Stack, CardMedia, Pagination } from "@mui/material";


// 🔹 백엔드 응답이 없을 때 fallback 데이터
const mockData = [
    {
        id: 1,
        title: "그해 여름이야기",
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 ...",
        image: "https://image.yes24.com/goods/123456?random=1",
    },
    {
        id: 2,
        title: "엄마가 보고싶어",
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 ...",
        image: "https://image.yes24.com/goods/987654?random=1",
    },
    {
        id: 3,
        title: "계속 이렇게 살아도 될까?",
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 ...",
        image: "https://image.yes24.com/goods/457812?random=1",
    },
];

export default function MainPage() {
    const [books, setBooks] = useState([]); // 전체 작품 데이터
    const [page, setPage] = useState(1); // 현재 페이지
    const itemsPerPage = 4; // 한 페이지당 4개

    // --------------------------------
    // 🟦 1) 백엔드에서 데이터 가져오기
    // --------------------------------
    useEffect(() => {
        fetch("http://localhost:8080/book/list")
            .then((res) => res.json())
            .then((data) => {
                console.log("📘 불러온 데이터:", data);

                if (!data || data.length === 0) {
                    // 데이터가 없으면 mockData 사용
                    setBooks(mockData);
                    return;
                }

                const sorted = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                // 🔹 백엔드 데이터 형태 통일 (mockData 스타일로 매핑)
                const converted = sorted.map((item) => ({
                    id: item.bookId,
                    title: item.title,
                    description: item.content,
                    image: item.coverImageUrl
                        ? `http://localhost:8080${item.coverImageUrl}`  // 🔹 백엔드 도메인 붙이기
                        : null,
                }));





                setBooks(converted);
            })
            .catch((err) => {
                console.error("도서 불러오기 오류:", err);
                setBooks(mockData); // 오류 발생 시 mockData 보여줌
            });
    }, []);

    // --------------------------------
    // 🟦 2) 페이지네이션 처리
    // --------------------------------
    const startIndex = (page - 1) * itemsPerPage;
    const currentItems = books.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(books.length / itemsPerPage);

    return (
        <Box sx={{ width: "100%", mt: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, ml: 2 }}>
                작품 목록
            </Typography>

            {/* -------------------------------- */}
            {/* 🟦 3) 작품 리스트 (디자인 mock 버전 유지) */}
            {/* -------------------------------- */}
            <Stack spacing={4} sx={{ px: 2 }}>
                {currentItems.map((item) => (
                    <Link
                        key={item.id}
                        href={`/books/${item.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 3,
                                alignItems: "center",
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#f8f4f2",
                                transition: "transform 0.2s",
                                cursor: "pointer",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: 3,
                                },
                            }}
                        >
                            {/* ------------------------ */}
                            {/* 이미지 렌더링 */}
                            {/* ------------------------ */}
                            {item.image ? (
                                <CardMedia
                                    component="img"
                                    image={item.image}
                                    alt={item.title}
                                    sx={{
                                        width: 130,
                                        height: 190,
                                        borderRadius: 2,
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: 130,
                                        height: 190,
                                        borderRadius: 2,
                                        backgroundColor: "#e0e0e0",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#777",
                                    }}
                                >
                                    이미지 없음
                                </Box>
                            )}

                            {/* ------------------------ */}
                            {/* 제목 + 내용 */}
                            {/* ------------------------ */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    {item.title}
                                </Typography>

                                <Typography sx={{ color: "#555", lineHeight: 1.5 }}>
                                    {item.description?.slice(0, 80) || "내용 없음"}...
                                </Typography>
                            </Box>
                        </Box>
                    </Link>
                ))}
            </Stack>

            {/* -------------------------------- */}
            {/* 🟦 4) 페이지네이션 */}
            {/* -------------------------------- */}
            <Stack alignItems="center" sx={{ mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, v) => setPage(v)}
                    color="primary"
                    shape="rounded"
                />
            </Stack>
        </Box>
    );
}
