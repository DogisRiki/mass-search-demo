package com.example.demo.controller;

import com.example.demo.dto.CursorPageResponse;
import com.example.demo.dto.ProductResponse;
import com.example.demo.service.ProductIndexService;
import com.example.demo.service.ProductSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 商品検索コントローラ（Elasticsearch）
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductSearchController {

    /**
     * 商品検索サービス
     */
    private final ProductSearchService productSearchService;

    /**
     * 商品インデックスサービス
     */
    private final ProductIndexService productIndexService;

    /**
     * キーワードで商品を検索する
     *
     * @param q 検索キーワード
     * @param size 取得件数（デフォルト20）
     * @param searchAfter 前ページ最後のソート値（初回は省略）
     * @return 検索結果
     */
    @GetMapping("/search")
    public CursorPageResponse<ProductResponse> search(@RequestParam(name = "q") String q,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "searchAfter", required = false) String searchAfter) {
        return productSearchService.search(q, size, searchAfter);
    }

    /**
     * 全商品をElasticsearchにインデクシングする
     *
     * @return 完了メッセージ
     */
    @PostMapping("/index")
    public ResponseEntity<String> indexAll() {
        productIndexService.indexAll(10000);
        return ResponseEntity.ok("インデクシング完了");
    }
}
