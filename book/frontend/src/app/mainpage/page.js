"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Typography, Stack, CardMedia, Pagination } from "@mui/material";

export default function MainPage() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);

    const itemsPerPage = 4;

    // 🔹 기본 검색어 (원하면 수정 가능)
    const defaultKeyword = "소설";

    useEffect(() => {
        fetch(`/api/books/search?keyword=${encodeURIComponent(defaultKeyword)}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("📘 크롤링 데이터:", data);

                // 크롤링 BookDto → UI 데이터 구조로 변환
                const converted = data.map((item) => ({
                    id: item.goodsNo,             // 상세 이동용 ID
                    title: item.title,            // 제목
                    description: item.author,     // 저자 표시
                    image: item.imageUrl          // 표지 이미지 URL
                }));

                setBooks(converted);
            })
            .catch((err) => {
                console.error("❌ 크롤링 데이터 불러오기 오류:", err);
            });
    }, []);

    // 🟦 페이지네이션
    const startIndex = (page - 1) * itemsPerPage;
    const currentItems = books.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(books.length / itemsPerPage);

    return (
        <Box sx={{ width: "100%", mt: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, ml: 2 }}>
                📚 도서 목록
            </Typography>

            <Stack spacing={4} sx={{ px: 2 }}>
                {currentItems.map((item) => (
                    <Link
                        key={item.id}
                        href={`/books/${item.id}`} // 상세페이지 라우팅
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
                            {/* 이미지 */}
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

                            {/* 제목 + 저자 */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    {item.title}
                                </Typography>

                                <Typography sx={{ color: "#555", lineHeight: 1.5 }}>
                                    {item.description || "저자 정보 없음"}
                                </Typography>
                            </Box>
                        </Box>
                    </Link>
                ))}
            </Stack>

            {/* 페이지네이션 */}
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
