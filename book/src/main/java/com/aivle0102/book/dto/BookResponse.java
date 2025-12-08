package com.aivle0102.book.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BookResponse {
    private Long bookId;
    private Long userId;
    private String title;
    private String author;
    private String category;
    private String content;
    private String coverImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}