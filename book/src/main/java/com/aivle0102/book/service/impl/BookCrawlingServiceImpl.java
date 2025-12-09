package com.aivle0102.book.service.impl;

import com.aivle0102.book.dto.BookDto;
import com.aivle0102.book.service.BookCrawlingService;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;

import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.jsoup.nodes.Element;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookCrawlingServiceImpl implements BookCrawlingService {

    @Override
    public List<BookDto> searchBooks(String keyword) throws IOException {

        String url = "https://m.yes24.com/Search?query=" +
                URLEncoder.encode(keyword, StandardCharsets.UTF_8);

        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0")
                .timeout(5000)
                .referrer("https://www.google.com")
                .get();

        Elements books = doc.select("li.item[data-goods-no]");

        System.out.println(doc);
        System.out.println("모야.." + books);

        List<BookDto> result = new ArrayList<>();

        for (Element item : books) {

            // 제목
            String title = item.select(".info_name").text()
                    .replace("[도서] ", "")
                    .trim();

            // 저자(복수일 수 있음 → join)
            List<String> authors = item.select(".info_pubGrp .info_auth .auth")
                    .eachText();
            String author = String.join(", ", authors);

            // 출판사
            String publisher = item.select(".info_pubGrp .info_pub").text().trim();

            // 이미지
            String imageUrl = item.select("img.lazy").attr("data-original");

            // 상품번호
            String goodsNo = item.attr("data-goods-no");


            if (!title.isEmpty()) {
                result.add(new BookDto(
                        goodsNo,
                        title,
                        author,
                        imageUrl
                ));
            }
        }

        return result;
    }
}