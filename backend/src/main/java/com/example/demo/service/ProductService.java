package com.example.demo.service;

import com.example.demo.dto.CursorPageResponse;
import com.example.demo.dto.ProductResponse;
import com.example.demo.repository.ProductRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 商品サービス
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    /**
     * 商品リポジトリ
     */
    private final ProductRepository productRepository;

    /**
     * LIMIT OFFSETページングで商品一覧を取得する
     *
     * @param page ページ番号（0始まり）
     * @param size 1ページあたりの件数
     * @return 商品ページ
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> findAllWithOffset(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").ascending());
        return productRepository.findAll(pageRequest).map(ProductResponse::from);
    }

    /**
     * カーソルページングで商品一覧を取得する
     *
     * @param lastId 前回取得した最後のID（初回は0）
     * @param size 1ページあたりの件数
     * @return カーソルページングレスポンス
     */
    @Transactional(readOnly = true)
    public CursorPageResponse<ProductResponse> findAllWithCursor(long lastId, int size) {
        // size + 1件取得して次ページの有無を判定
        List<ProductResponse> fetched =
                productRepository.findByCursor(lastId, size + 1).stream().map(ProductResponse::from).toList();

        boolean hasNext = fetched.size() > size;
        List<ProductResponse> content = hasNext ? fetched.subList(0, size) : fetched;
        String nextCursor = content.isEmpty() ? null : String.valueOf(content.getLast().id());

        return new CursorPageResponse<>(content, nextCursor, hasNext);
    }
}
