"use client";

// useState 외에 필요한 컴포넌트들을 mui에서 import 합니다.
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { 
    Box, Typography, Stack, CardMedia, Button, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress // For loading indicator when fetching list
} from "@mui/material";

// TODO: 로그인 구현 후 실제 accessToken으로 교체해야 합니다.
const FAKE_ACCESS_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"; 

const MOCK_MY_WORKS = [ //나중에 백엔드에서 user가 등록한 작품 목록 가져와야함. 현재는 임시 데이터
    {
        id: 1,
        title: "그해 여름이야기",
        author: "작가 A", // '저자' 필드 추가
        createdAt: "2023-01-01", // '등록일' 필드 추가
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 깨끗한 물 공급 시설 짓는 비용으로 내야 하는지...",
        image: "https://image.yes24.com/goods/123456?random=1",
    },
    {
        id: 2,
        title: "엄마가 보고 싶어",
        author: "작가 B",
        createdAt: "2023-02-15", // Ensure date format matches YYYY-MM-DD
        description:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 깨끗한 물 공급 시설 짓는 비용으로 내야 하는지...",
        image: "https://image.yes24.com/goods/987654?random=1",
    },
    {
        id: 3,
        title: "엄마가 안보고 싶어",
        author: "작가 C",
        createdAt: "2025-11-15", // Ensure date format matches YYYY-MM-DD
        description:
            "안녕하세요",
        image: "https://image.yes24.com/goods/987655?random=1",
    },
];

export default function MyPageView() {
    const router = useRouter();
    const [works, setWorks] = useState([]); // 초기 상태를 빈 배열로 변경
    const [loading, setLoading] = useState(true); // 목록 로딩 상태 추가
    
    // --- 모달 관련 상태 추가 ---
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [editingWork, setEditingWork] = useState(null); 
    const alertShown = useRef(false);

    // --- 작품 목록 불러오기 (GET /book/list) ---
    useEffect(() => {
        const isLoggedIn = false; // 현재 테스트이므로, True로 변경, 실행 시 False로 변경 

        if (!isLoggedIn) {
            if (!alertShown.current) {
                alert("로그인이 필요한 서비스입니다.");
                alertShown.current = true;
            }
            router.push('/login');
            return; // 이후 코드(작품 목록 조회) 실행 중단
        }
        // --- 로그인 확인 끝 ---

        const fetchWorks = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/book/list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': FAKE_ACCESS_TOKEN, 
                    },
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    let errorMessage = `HTTP error! status: ${response.status}`;
                    try {
                        const errorJson = JSON.parse(errorBody);
                        errorMessage = errorJson.message || JSON.stringify(errorJson);
                    } catch (e) {
                        errorMessage = errorBody || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                if (result.status === 'success') {
                    const fetchedWorks = result.data.map(item => ({
                        id: item.bookId,
                        title: item.title,
                        author: item.author || "알 수 없음",
                        createdAt: item.createdAt ? item.createdAt.substring(0, 10) : "알 수 없음",
                        description: item.content,
                        image: item.coverImageUrl || "https://via.placeholder.com/140x200?text=No+Image",
                    }));
                    setWorks(fetchedWorks);
                } else {
                    throw new Error(result.message || '작품 목록 조회 실패');
                }
            } catch (error) {
                console.error("작품 목록 불러오기 오류:", error);
                if (!alertShown.current) {
                    alert('작품 목록을 불러오지 못했습니다. 목업 데이터를 표시합니다.');
                    alertShown.current = true;
                }
                setWorks(MOCK_MY_WORKS);
            } finally {
                setLoading(false);
            }
        };

        fetchWorks();
    }, [router]);

    // 삭제 처리 함수
    const handleDelete = async (idToDelete) => {
        if (!window.confirm(`'${works.find(w => w.id === idToDelete)?.title}' 작품을 정말 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/book/delete?bookId=${idToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': FAKE_ACCESS_TOKEN,
                },
            });

            if (!response.ok) {
                const errorBody = await response.text();
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorBody);
                    errorMessage = errorJson.message || JSON.stringify(errorJson);
                } catch (e) {
                    errorMessage = errorBody || errorMessage;
                }
                throw new Error(errorMessage);
            }

            if (response.status === 204 || response.status === 200) {
                setWorks(currentWorks => currentWorks.filter(work => work.id !== idToDelete));
                alert("작품이 삭제되었습니다.");
            } else {
                 const result = await response.json();
                 throw new Error(result.message || '작품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error("삭제 처리 중 오류:", error);
            alert(`삭제 처리 중 오류: ${error.message}`);
        }
    };

    // 수정 버튼 클릭 시 모달 열기
    const handleOpenEditModal = (work) => {
        setEditingWork({ ...work });
        setIsModalOpen(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingWork(null);
    };

    // 모달 내 폼 필드 변경 시 호출될 함수
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditingWork(prev => ({ ...prev, [name]: value }));
    };

    // '저장' 버튼 클릭 시
    const handleSaveChanges = async () => {
        if (!editingWork) return;

        try {
            const response = await fetch(`/api/book/update`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': FAKE_ACCESS_TOKEN,
                },
                body: JSON.stringify({
                    bookId: editingWork.id,
                    title: editingWork.title,
                    content: editingWork.description,
                    author: editingWork.author,
                    coverImageUrl: editingWork.image,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorBody);
                    errorMessage = errorJson.message || JSON.stringify(errorJson);
                } catch (e) {
                    errorMessage = errorBody || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            if (result.status === 'success') {
                setWorks(currentWorks => 
                    currentWorks.map(work => 
                        work.id === editingWork.id ? { ...editingWork, createdAt: work.createdAt } : work
                    )
                );
                alert("변경사항이 저장되었습니다.");
                handleCloseModal();
            } else {
                throw new Error(result.message || '작품 수정 실패');
            }
        } catch (error) {
            console.error("수정 중 오류:", error);
            alert(`수정 중 오류: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (works.length === 0 && !loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 10 }}>
                <Typography variant="h5">등록된 작품이 없습니다.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", mt: 6, mb: 10 }}>

            <Typography
                variant="h4"
                sx={{ fontWeight: 700, textAlign: "center", mb: 6 }}
            >
                내 작품 관리
            </Typography>

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

                        <Box sx={{ flex: 1 }}>

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

                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Button variant="text" size="small" sx={{ color: "#555" }} onClick={() => handleOpenEditModal(item)}>
                                        수정
                                    </Button>
                                    <Typography>|</Typography>
                                    <Button variant="text" size="small" sx={{ color: "#555" }} onClick={() => handleDelete(item.id)}>
                                        삭제
                                    </Button>
                                </Box>
                            </Box>

                            <Typography sx={{ color: "#555", lineHeight: 1.6 }}>
                                {item.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
            
            {editingWork && (
                <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ fontWeight: 700 }}>작품 정보 수정</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="작품 제목"
                            value={editingWork.title}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            name="author"
                            label="저자"
                            value={editingWork.author}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="등록일"
                            value={editingWork.createdAt}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            name="image"
                            label="책 표지 URL"
                            value={editingWork.image}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            name="description"
                            label="책 요약 / 줄거리"
                            value={editingWork.description}
                            onChange={handleFormChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleCloseModal}>취소</Button>
                        <Button onClick={handleSaveChanges} variant="contained">저장</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
}
