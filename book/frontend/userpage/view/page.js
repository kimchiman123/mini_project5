"use client";

import { useState } from "react";
import { Box, Typography, Stack, CardMedia, Button } from "@mui/material";

const mockMyWorks = [ //나중에 백엔드에서 user가 등록한 작품 목록 가져와야함. 현재는 임시 데이터
    {
        id: 1,
        title: "그해 여름이야기",
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 깨끗한 물 공급 시설 짓는 비용으로 내야 하는지...",
        image: "https://image.yes24.com/goods/123456?random=1",
    },
    {
        id: 2,
        title: "엄마가 보고 싶어",
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 깨끗한 물 공급 시설 짓는 비용으로 내야 하는지...",
        image: "https://image.yes24.com/goods/987654?random=1",
    },
    {
        id: 3,
        title: "계속 이렇게 살아도 될까?",
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이...",
        image: "https://image.yes24.com/goods/457812?random=1",
    }
];

export default function MyPageView() {
    const [works] = useState(mockMyWorks);

    return (
        <Box sx={{ width: "100%", mt: 6, mb: 10 }}>

            {/* 제목 */}
            <Typography
                variant="h4"
                sx={{ fontWeight: 700, textAlign: "center", mb: 6 }}
            >
                내 작품 관리
            </Typography>

            {/* 작품 리스트 */}
            <Stack spacing={5} sx={{ px: 6 }}>
                {works.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 4,
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: "#f7f4f2",
                        }}
                    >
                        {/* 표지 이미지 */}
                        <CardMedia
                            component="img"
                            image={item.image}
                            alt={item.title}
                            sx={{
                                width: 140,
                                height: 200,
                                borderRadius: 2,
                                objectFit: "cover",
                            }}
                        />

                        {/* 텍스트 + 버튼 */}
                        <Box sx={{ flex: 1 }}>

                            {/* 제목 + 버튼 (가로 정렬) */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {item.title}
                                </Typography>

                                {/* 수정/삭제 버튼 */}
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Button variant="text" size="small" sx={{ color: "#555" }}>
                                        수정
                                    </Button>
                                    <Typography>|</Typography>
                                    <Button variant="text" size="small" sx={{ color: "#555" }}>
                                        삭제
                                    </Button>
                                </Box>
                            </Box>

                            {/* 설명 */}
                            <Typography sx={{ color: "#555", lineHeight: 1.6 }}>
                                {item.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>

        </Box>
    );
}
