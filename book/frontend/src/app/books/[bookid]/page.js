"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // [1] Next.js 13+ 앱 라우터용 훅
import { 
  Box, 
  Typography, 
  CardMedia, 
  CircularProgress, 
  Button, 
  Stack, 
  Divider,
  Container 
} from "@mui/material";

export default function BookDetailPage() {
  // 1. URL에서 bookid 추출 (useParams 사용 권장)
  const params = useParams();
  const bookid = params?.bookid;

  // 2. 상태 관리
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. 데이터 가져오기
  useEffect(() => {
    if (!bookid) return;

    // 실제 백엔드 연동 전 테스트를 위한 Mock Data (백엔드 API가 준비되면 fetch로 교체하세요)
    // fetch(`http://localhost:8080/api/books/${bookid}`)...
    
    setTimeout(() => {
      // 임시 데이터 (이미지의 내용 반영)
      setBook({
        id: bookid,
        title: "엄마가 보고싶어",
        author: "김미리",
        regDate: "2000.01.02",
        image: "https://image.yes24.com/goods/987654?random=1", // 예시 이미지
        summary: "2022두60073 원인자부담금부과처분취소 (자) 상고기각 [숙박시설에 대한 상수도 원인자부담금...]",
        plot: "급수구역 내에 설치한 숙박시설에 대하여 「영암군 상수도 원인자부담금 산정·징수 등에 관한 조례」..."
      });
      setLoading(false);
    }, 500);

  }, [bookid]);

  // 4. 로딩 UI
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 5. 데이터 없음 UI
  if (!book) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5">도서 정보를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  // 6. 메인 UI (이미지 디자인 반영)
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* --- 상단 헤더 영역 (제목 + 수정/삭제 버튼) --- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        {/* 제목 및 저자 정보 */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              책 제목 : {book.title}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            저자 : {book.author} &nbsp;/&nbsp; 등록일 : {book.regDate}
          </Typography>
        </Box>

        {/* 수정/삭제 버튼 */}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="inherit" sx={{ backgroundColor: '#b0a9a9', color: '#fff' }}>
            수정
          </Button>
          <Button variant="contained" color="inherit" sx={{ backgroundColor: '#b0a9a9', color: '#fff' }}>
            삭제
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* --- 본문 영역 (좌측 이미지 | 우측 텍스트) --- */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        
        {/* 좌측: 책 표지 이미지 */}
        <Box sx={{ flex: "0 0 350px" }}> {/* 너비 고정 */}
          <CardMedia
            component="img"
            image={book.image}
            alt={book.title}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: "#f5f5f5"
            }}
          />
        </Box>

        {/* 우측: 상세 내용 (요약, 줄거리) */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={4}>
            {/* 책 요약 섹션 */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                책 요약
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                {book.summary}
              </Typography>
            </Box>

            {/* 줄거리 섹션 */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                줄거리
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                {book.plot}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
