package com.aivle0102.book.service;

import com.aivle0102.book.domain.BookInfo;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BookInfoService {

    // 1) 도서 목록 (/book/list)
    List<BookInfo> getBookList();

    // 1-2) 특정 사용자 도서 목록 (/book/list/my)
    List<BookInfo> getBookListByUser(Long userId);

    // 2) 도서 상세 (/book/detail/{id})
    BookInfo getBookDetail(Long id) throws IOException;

    // 3) 도서 등록 (/book/insert)
    BookInfo insertBook(BookInfo book, Long userId, MultipartFile file) throws IOException;

    // 4) 도서 수정 (/book/update/{id})
    BookInfo updateBook(Long id, BookInfo book, Long userId, MultipartFile file) throws IOException;

    // 5) 도서 삭제 (/book/delete/{id})
    void deleteBook(Long id);

    // 6) AI 표지 이미지 URL 저장 (/book/createImg/{id})
    BookInfo updateCoverUrl(Long bookId, String coverImageUrl);

    //이미지 url 처리
    BookInfo insertBookByUrl(BookInfo book, Long userId) throws IOException;


}
