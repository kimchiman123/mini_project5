"use client";

import { Box, Typography, Stack, CardMedia } from "@mui/material";

const mockData = [ //나중에 백엔드에서 데이터 가져와야함
    {
        id: 1,
        title: "그해 여름이야기",
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 ..."
        ,
        image:
            "https://image.yes24.com/goods/123456?random=1", // 예시 이미지 (넣고 싶은 이미지로 교체)
    },
    {
        id: 2,
        title: "엄마가 보고싶어",
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 ..."
        ,
        image:
            "https://image.yes24.com/goods/987654?random=1",
    },
    {
        id: 3,
        title: "계속 이렇게 살아도 될까?",
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 ..."
        ,
        image:
            "https://image.yes24.com/goods/457812?random=1",
    },
];

export default function MainPage() {
    return (
        <Box sx={{ width: "100%", mt: 5 }}>

            {/* 페이지 제목 */}
            <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 4, ml: 2 }}
            >
                작품 목록
            </Typography>

            {/* 작품 리스트 전체 감싸기 */}
            <Stack spacing={4} sx={{ px: 2 }}>
                {mockData.map((item) => (
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
                        {/* 왼쪽 이미지 */}
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

                        {/* 오른쪽 텍스트 */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                {item.title}
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#555",
                                    lineHeight: 1.5,
                                }}
                            >
                                {item.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>

        </Box>
    );
}
