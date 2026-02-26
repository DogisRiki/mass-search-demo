package com.example.demo.controller;

import com.example.demo.dto.CursorPageResponse;
import com.example.demo.dto.ProductResponse;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 商品コントローラ
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    /**
     * 商品サービス
     */
    private final ProductService productService;

    /**
     * LIMIT OFFSETページングで商品一覧を取得する
     *
     * @param page ページ番号（0始まり、デフォルト0）
     * @param size 1ページあたりの件数（デフォルト20）
     * @return 商品ページ
     */
    @GetMapping
    public Page<ProductResponse> findAll(@RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return productService.findAllWithOffset(page, size);
    }

    /**
     * カーソルページングで商品一覧を取得する
     *
     * @param lastId 前回取得した最後のID（デフォルト0）
     * @param size 1ページあたりの件数（デフォルト20）
     * @return カーソルページングレスポンス
     */
    @GetMapping("/cursor")
    public CursorPageResponse<ProductResponse> findAllWithCursor(
            @RequestParam(name = "lastId", defaultValue = "0") long lastId,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return productService.findAllWithCursor(lastId, size);
    }
}
