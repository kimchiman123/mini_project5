'use client';

import { useState } from "react";
import { Grid, TextField, Typography, Button, MenuItem, Box, Card, CardMedia, FormControl, InputLabel, Select} from "@mui/material";

export default function CreateWork() {
    const [form, setForm] = useState({
        title: "",
        author: "",
        category: "",
        content: "",
    });

    const [model, setModel] = useState("");
    const [imageUrl, setImageUrl] = useState(null);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleModelChange = (e) => {
        setModel(e.target.value);
    };

    return (
        <Grid container spacing={6}>

            {/* 왼쪽 화면: 작품 정보 입력 */}
            <Grid item xs={12} md={6}>

                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                    새 작품 등록
                </Typography>

                {/* 작품 제목 */}
                <Typography sx={{ fontWeight: 600, mb: 1 }}>작품 제목</Typography>
                <TextField
                    name="title"
                    fullWidth
                    placeholder="작품 제목을 입력하세요"
                    value={form.title}
                    onChange={handleFormChange}
                    sx={{ mb: 3 }}
                />

                {/* 작가명 */}
                <Typography sx={{ fontWeight: 600, mb: 1 }}>작가명</Typography>
                <TextField
                    name="author"
                    fullWidth
                    placeholder="작가명을 입력하세요"
                    value={form.author}
                    onChange={handleFormChange}
                    sx={{ mb: 3 }}
                />

                {/* 카테고리 */}
                <Typography sx={{ fontWeight: 600, mb: 1 }}>카테고리</Typography>
                <TextField
                    name="category"
                    fullWidth
                    placeholder="예: 동화, 소설, 에세이..."
                    value={form.category}
                    onChange={handleFormChange}
                    sx={{ mb: 3 }}
                />

                {/* 내용 */}
                <Typography sx={{ fontWeight: 600, mb: 1 }}>내용</Typography>
                <TextField
                    name="content"
                    fullWidth
                    multiline
                    minRows={6}
                    placeholder="작품 내용을 입력하세요"
                    value={form.content}
                    onChange={handleFormChange}
                    sx={{ mb: 3 }}
                />

                <Button variant="contained" size="large">
                    작품 등록하기
                </Button>
            </Grid>

            {/* 오른쪽 화면: 이미지 생성 */}
            <Grid item xs={12} md={6}>

                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                    해당 내용으로 표지 생성하기
                </Typography>

                {/* 그림 생성 모델 선택 */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="model-select-label">그림 생성 모델 선택</InputLabel>
                    <Select
                        labelId="model-select-label"
                        label="그림 생성 모델 선택"
                        value={model}
                        onChange={handleModelChange}
                    >
                        <MenuItem value="dall-e">Dall-E</MenuItem>
                        <MenuItem value="gpt-image">GPT Image</MenuItem> {/*예시로 넣어둠*/}
                        <MenuItem value="stablediffusion">Stable Diffusion</MenuItem>
                    </Select>
                </FormControl>

                {/* 이미지 생성 버튼 */}
                <Button variant="outlined" size="large">
                    이미지 생성하기
                </Button>

                {/* 생성 결과 이미지 */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    생성 결과
                </Typography>

                {imageUrl ? (
                    <Card sx={{ maxWidth: 280 }}>
                        <CardMedia component="img" src={imageUrl} />
                    </Card>
                ) : (
                    <Box
                        sx={{
                            width: 280,
                            height: 280,
                            backgroundColor: "#eeeeee",
                            borderRadius: 2,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#999",
                            mb: 2
                        }}
                    >
                        이미지 없음
                    </Box>
                )}

            </Grid>

        </Grid>
    );
}
