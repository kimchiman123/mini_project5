package com.aivle0102.book.controller;

import org.springframework.http.ResponseEntity;
import com.aivle0102.book.dto.ApiResponse;
import com.aivle0102.book.domain.BookInfo;
import com.aivle0102.book.service.BookInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/book")
@RequiredArgsConstructor
public class BookInfoController {

    private final BookInfoService bookInfoService;


    // 1. 도서 목록
    @GetMapping("/list")
    public List<BookInfo> getBookList() {
        return bookInfoService.getBookList();
    }

    // 1-2. 내 도서 목록 (userId 기준)
    @GetMapping("/list/my")
    public ResponseEntity<ApiResponse<List<BookInfo>>> getMyBookList(
            @RequestParam Long userId
    ) {
        List<BookInfo> list = bookInfoService.getBookListByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 2. 도서 상세
    @GetMapping("/detail/{id}")
    public BookInfo getBookDetail(@PathVariable Long id) throws IOException {
        return bookInfoService.getBookDetail(id);
    }

    // 3. 도서 등록
    @PostMapping(value = "/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BookInfo insertBook(@RequestPart("book") BookInfo book, @RequestPart(value = "file", required = false) MultipartFile file, @RequestParam Long userId) throws IOException {
        BookInfo saved = bookInfoService.insertBook(book, userId, file);
        return saved;
    }

    // 4. 도서 수정
    @PutMapping(value = "/update/{bookId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BookInfo updateBook(@PathVariable long bookId, @RequestPart("book") BookInfo bookInfo, @RequestPart(value = "file", required = false) MultipartFile file, @RequestParam Long userId) throws IOException {
        return bookInfoService.updateBook(bookId, bookInfo, userId, file);
    }

    // 5. 도서 삭제
    @DeleteMapping("/delete/{bookId}")
    public void deleteBook(@PathVariable long bookId) {
        bookInfoService.deleteBook(bookId);
    }

    // 6. AI 표지 이미지 URL 저장
    @PatchMapping("/createImg/{bookId}")
    public BookInfo updateCoverUrl(@PathVariable Long bookId, @RequestBody BookInfo book){
        return bookInfoService.updateCoverUrl(bookId, book.getCoverImageUrl());
    }

    @PostMapping("/insertByUrl")
    public BookInfo insertBookByUrl(
            @RequestBody BookInfo book,
            @RequestParam Long userId
    ) throws IOException {
        return bookInfoService.insertBookByUrl(book, userId);
    }


}
