package com.aivle0102.book.service;

import com.aivle0102.book.domain.BookInfo;

import java.util.List;

public interface BookInfoService {

    // 1) 도서 목록 (/book/list)
    List<BookInfo> getBookList();

    // 2) 도서 상세 (/book/detail/{id})
    BookInfo getBookDetail(Long id);

    // 3) 도서 등록 (/book/insert)
    BookInfo insertBook(BookInfo book);

    // 4) 도서 수정 (/book/update/{id})
    BookInfo updateBook(Long id, BookInfo book);

    // 5) 도서 삭제 (/book/delete/{id})
    void deleteBook(Long id);

    // 6) AI 표지 이미지 URL 저장 (/book/createImg/{id})
    BookInfo updateCoverUrl(Long bookId, String coverImageUrl);
}
