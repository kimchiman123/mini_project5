"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  CardMedia,
  CircularProgress,
  Button,
  Stack,
  Divider,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function BookDetailPage() {
  // 1. URL에서 bookid 추출
  const params = useParams();
  const bookid = params?.bookid; // /books/3 → "3"

  const router = useRouter();

  // 2. 상태 관리
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // 수정 모달용 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // 3. 백엔드에서 도서 상세 가져오기
  useEffect(() => {
    if (!bookid) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/book/detail/${bookid}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            text || `HTTP error! status: ${res.status}`
          );
        }

        const result = await res.json();
        console.log("📗 /book/detail 응답:", result);

        let data;
        if (result.bookId) {
          // BookInfo 직접 반환된 경우
          data = result;
        } else if (Array.isArray(result)) {
          // 배열로 반환된 경우
          data = result[0];
        } else if (result.data) {
          // ApiResponse 형태로 반환된 경우
          data = result.data;
        }
        if (!data) {
          throw new Error("도서 정보를 찾을 수 없습니다.");
        }

        // 백엔드 BookInfo → 화면에서 쓸 형태로 매핑
        setBook({
          id: data.bookId,
          title: data.title,
          author: data.author || "알 수 없음",
          regDate: data.createdAt
            ? data.createdAt.substring(0, 10)
            : "알 수 없음",
          image:
            data.coverImageUrl
              ? `${data.coverImageUrl}`
              : "https://via.placeholder.com/200x300?text=No+Image",
          // content를 요약/줄거리 둘 다에 재사용
          summary: data.content || "요약 정보가 없습니다.",
          plot: data.content || "줄거리 정보가 없습니다.",
        });
      } catch (err) {
        console.error("도서 상세 불러오기 오류:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
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
        <Typography variant="h5">
          도서 정보를 찾을 수 없습니다.
        </Typography>
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

        {/*/!* 수정/삭제 버튼 *!/*/}
        {/*<Stack direction="row" spacing={1}>*/}
        {/*  <Button variant="contained" color="inherit" sx={{ backgroundColor: '#b0a9a9', color: '#fff' }}>*/}
        {/*    수정*/}
        {/*  </Button>*/}
        {/*  <Button variant="contained" color="inherit" sx={{ backgroundColor: '#b0a9a9', color: '#fff' }}>*/}
        {/*    삭제*/}
        {/*  </Button>*/}
        {/*</Stack>*/}
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

        {/* 우측: 요약/줄거리 */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={4}>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                책 요약
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#333" }}
              >
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