package com.aivle0102.book.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookCreateRequest {
    private Long userId;
    private String title;
    private String author;
    private String category;
    private String content;
}