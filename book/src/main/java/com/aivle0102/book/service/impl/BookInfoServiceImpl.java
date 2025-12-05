package com.aivle0102.book.service.impl;

import com.aivle0102.book.domain.BookInfo;
import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.repository.BookInfoRepository;
import com.aivle0102.book.repository.UserInfoRepository;
import com.aivle0102.book.service.BookInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookInfoServiceImpl implements BookInfoService {

    public final BookInfoRepository bookInfoRepository;
    public final UserInfoRepository userInfoRepository;


    // 1) 도서 목록 조회
    @Override
    public List<BookInfo> getBookList() {
        return bookInfoRepository.findAll();
    }

    // 2) 도서 상세 조회
    @Override
    public BookInfo getBookDetail(Long id) {
        return bookInfoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 ID의 도서를 찾을 수 없습니다. id=" + id));
    }

    // 3) 도서 등록
    @Override
    public BookInfo insertBook(BookInfo book) {
//        UserInfo user = userInfoRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User Not Found"));

        LocalDateTime now = LocalDateTime.now();
        book.setCreatedAt(now);
        book.setUpdatedAt(now);
        return bookInfoRepository.save(book);
    }

    // 4) 도서 수정
    @Override
    public BookInfo updateBook(Long id, BookInfo update) {
        BookInfo book = bookInfoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 ID의 도서를 찾을 수 없습니다. id=" + id));

        book.setTitle(update.getTitle());
        book.setAuthor(update.getAuthor());
        book.setContent(update.getContent());
        book.setCoverImageUrl(update.getCoverImageUrl());
        book.setUpdatedAt(LocalDateTime.now());

        return bookInfoRepository.save(book);
    }

    // 5) 도서 삭제
    @Override
    public void deleteBook(Long id) {
        bookInfoRepository.deleteById(id);
    }

    // 6) AI 표지 이미지 URL 업데이트
    @Override
    public BookInfo updateCoverUrl(Long bookId, String coverImageUrl) {
        BookInfo book = bookInfoRepository.findById(bookId)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 ID의 도서를 찾을 수 없습니다. bookId=" + bookId));

        book.setCoverImageUrl(coverImageUrl);
        book.setUpdatedAt(LocalDateTime.now());

        return bookInfoRepository.save(book);
    }
}
