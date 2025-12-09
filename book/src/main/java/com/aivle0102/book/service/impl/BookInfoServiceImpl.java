package com.aivle0102.book.service.impl;

import java.awt.print.Book;
import java.net.URL;
import java.io.InputStream;

import com.aivle0102.book.dto.BookDto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.mock.web.MockMultipartFile;

import com.aivle0102.book.domain.BookInfo;
import com.aivle0102.book.domain.ImgInfo;
import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.repository.BookInfoRepository;
import com.aivle0102.book.repository.ImgInfoRepository;
import com.aivle0102.book.repository.UserInfoRepository;
import com.aivle0102.book.service.BookInfoService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookInfoServiceImpl implements BookInfoService {

    public final BookInfoRepository bookInfoRepository;
    public final UserInfoRepository userInfoRepository;
    public final ImgInfoRepository imgInfoRepository;

    // 1) 도서 목록 조회
    @Transactional(readOnly = true)
    @Override
    public List<BookInfo> getBookList() {
        return bookInfoRepository.findAll();
    }

    // 1-2) userId별 도서 목록 조회
    @Transactional(readOnly = true)
    @Override
    public List<BookInfo> getBookListByUser(Long userId) {
        return bookInfoRepository.findByUser_UserId(userId);
    }

    // 2) 도서 상세 조회
    @Transactional(readOnly = true)
    @Override
    public BookInfo getBookDetail(Long id) throws IOException{
        BookInfo book;

        if(id > 1000){
            book = searchBook(String.valueOf(id));

        } else{
            book = bookInfoRepository.findById(id)
                    .orElseThrow(() ->
                            new IllegalArgumentException("해당 ID의 도서를 찾을 수 없습니다. id=" + id));
        }

        return book;
    }

    // 3) 도서 등록
    @Transactional
    @Override
    public BookInfo insertBook(BookInfo book, Long userId, MultipartFile file) throws IOException {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        LocalDateTime now = LocalDateTime.now();
        book.setUser(user);
        book.setCreatedAt(now);
        book.setUpdatedAt(now);

        BookInfo savedBook = bookInfoRepository.save(book);

        if (file != null && !file.isEmpty()) {
            ImgInfo newImg = uploadBookImage(savedBook.getBookId(), userId, file);
            book.setCoverImageUrl(newImg.getImgUrl());
            bookInfoRepository.save(book);
        } else{
            System.out.println("여기냐..");
        }


        return savedBook;
    }


    // 4) 도서 수정
    @Override
    @Transactional
    public BookInfo updateBook(Long bookId, BookInfo update, Long userId, MultipartFile file) throws IOException {
        BookInfo book = bookInfoRepository.findById(bookId)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 ID의 도서를 찾을 수 없습니다. id=" + bookId));

        book.setTitle(update.getTitle());
        book.setAuthor(update.getAuthor());
        book.setContent(update.getContent());
        book.setUpdatedAt(LocalDateTime.now());

        // 기존 이미지 목록 조회
        List<ImgInfo> oldImgs = imgInfoRepository.findByBook_BookIdAndState(bookId, "O");

        if (file != null && !file.isEmpty()) {
            String oriImgName = file.getOriginalFilename();

            boolean sameImage = oldImgs.stream()
                    .anyMatch(img -> img.getOrigImgName().equals(oriImgName));

            if (!sameImage) {
                deleteOldImage(bookId);  

                ImgInfo newImg = uploadBookImage(bookId, userId, file);
                book.setCoverImageUrl(newImg.getImgUrl());
            }
        } else {
            if (!oldImgs.isEmpty()) {
                deleteOldImage(bookId);
                book.setCoverImageUrl(null);
            }
        }

        return bookInfoRepository.save(book);
    }


    // 5) 도서 삭제
    //@Override
    //@Transactional
    //public void deleteBook(Long id) {
    //    bookInfoRepository.deleteById(id);
    //}

    //삭제 관련 추가
    @Override
        @Transactional
        public void deleteBook(Long id) {
            // 1) 자식(이미지) 먼저 삭제
            imgInfoRepository.deleteByBook_BookId(id);

            // 2) 부모(Book) 삭제
            bookInfoRepository.deleteById(id);
        }

    // 6) AI 표지 이미지 URL 업데이트
    @Override
    @Transactional
    public BookInfo updateCoverUrl(Long bookId, String coverImageUrl) {
        BookInfo book = bookInfoRepository.findById(bookId)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 ID의 도서를 찾을 수 없습니다. bookId=" + bookId));

        book.setCoverImageUrl(coverImageUrl);
        book.setUpdatedAt(LocalDateTime.now());

        return bookInfoRepository.save(book);
    }

    @Override
        @Transactional
        public BookInfo insertBookByUrl(BookInfo book, Long userId) throws IOException {

            UserInfo user = userInfoRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User Not Found"));

            LocalDateTime now = LocalDateTime.now();
            book.setUser(user);
            book.setCreatedAt(now);
            book.setUpdatedAt(now);

            // 1) 우선 BookInfo만 저장하여 bookId 확보
            BookInfo savedBook = bookInfoRepository.save(book);

            // 2) 이미지 URL이 존재하면 다운로드 진행
            if (book.getCoverImageUrl() != null && !book.getCoverImageUrl().isEmpty()) {

                MultipartFile file = downloadImageAsMultipart(book.getCoverImageUrl());

                // 서버에 이미지 저장
                ImgInfo uploadedImg = uploadBookImage(savedBook.getBookId(), userId, file);

                savedBook.setCoverImageUrl(uploadedImg.getImgUrl());
                bookInfoRepository.save(savedBook);
            }

            return savedBook;
        }


        // -----------------------------
        // URL → MultipartFile 변환
        // -----------------------------
        private MultipartFile downloadImageAsMultipart(String imageUrl) throws IOException {

            URL url = new URL(imageUrl);

            try (InputStream is = url.openStream()) {

                byte[] bytes = is.readAllBytes();
                String fileName = UUID.randomUUID().toString() + ".png";

                return new MockMultipartFile(
                        fileName, fileName,
                        "image/png",
                        bytes
                );
            }
        }




    @Transactional
    public ImgInfo uploadBookImage(Long bookId, Long userId, MultipartFile file) throws IOException {

        // 유효성 체크
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        BookInfo book = bookInfoRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));


        // 저장할 디렉터리 설정
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "book";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 파일명 생성
        String oriImgName = file.getOriginalFilename();
        String ext = oriImgName.substring(oriImgName.lastIndexOf("."));
        String imgName = UUID.randomUUID().toString() + ext;

        File saveFile = new File(dir, imgName);

        // 파일 저장 현재 프로젝트에서 book 바로 밑에 uploads 폴더 생겼을거에요 확인하세여
        try {
            file.transferTo(saveFile);
            System.out.println(" 이미지 저장 완료 → " + saveFile.getAbsolutePath());
        } catch (Exception e) {
            System.out.println("이미지 저장 실패");
            e.printStackTrace();
        }

        // URL 저장
        String imgUrl = "/uploads/" + imgName;

        LocalDateTime now = LocalDateTime.now();

        ImgInfo imgInfo = ImgInfo.builder()
                .user(user)
                .book(book)
                .origImgName(oriImgName)
                .imgName(imgName)
                .imgUrl(imgUrl)
                .state("O")
                .startDate(now)
                .endDate(now.plusYears(99))
                .regDate(now)
                .build();

        return imgInfoRepository.save(imgInfo);
    }

    private void deleteOldImage(Long bookId) {
        List<ImgInfo> imgs = imgInfoRepository.findByBook_BookId(bookId);
        imgs.forEach(img -> img.setState("D"));
    }

    private BookInfo searchBook(String goodsNo) throws IOException {

        BookInfo book = new BookInfo();
        String detailUrl = "https://www.yes24.com/Product/Goods/" + goodsNo;

        Document doc = Jsoup.connect(detailUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36")
                .timeout(7000)
                .get();

        // 제목
        String title = doc.select("meta[name=title]").attr("content");

        // 저자
        String author = doc.select("meta[name=author]").attr("content");

        // 요약 설명
        String description = doc.select("meta[name=description]").attr("content");

        // 이미지
        String imageUrl = doc.select("meta[property=og:image]").attr("content");

        book.setBookId(Long.parseLong(goodsNo));
        book.setTitle(title);
        book.setAuthor(author);
        book.setContent(description);
        book.setCoverImageUrl(imageUrl);
        book.setUser(new UserInfo(9999L, "admin@naver.com", "1234", "관리자", "01012345678"));
        book.setCategory("");
        book.setCreatedAt(LocalDateTime.now());
        book.setUpdatedAt(LocalDateTime.now());

        System.out.println(book.getTitle());
        System.out.println(book.getAuthor());
        System.out.println(book.getContent());
        System.out.println(book.getCoverImageUrl());
        System.out.println(book.getTitle());
        System.out.println(book.getTitle());

        return book;
    }
}
