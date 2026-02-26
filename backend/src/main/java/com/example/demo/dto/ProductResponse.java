package com.example.demo.dto;

import com.example.demo.entity.Product;
import java.time.LocalDateTime;

/**
 * 商品レスポンスDTO
 *
 * @param id 商品ID
 * @param name 商品名
 * @param description 説明文
 * @param categoryName カテゴリ名
 * @param price 価格
 * @param stockQuantity 在庫数
 * @param status ステータス
 * @param createdAt 作成日時
 */
public record ProductResponse(Long id, String name, String description, String categoryName, Integer price,
        Integer stockQuantity, String status, LocalDateTime createdAt) {

    /**
     * EntityからDTOに変換する
     *
     * @param product 商品エンティティ
     * @return 商品レスポンスDTO
     */
    public static ProductResponse from(Product product) {
        return new ProductResponse(product.getId(), product.getName(), product.getDescription(),
                product.getCategory().getName(), product.getPrice(), product.getStockQuantity(), product.getStatus(),
                product.getCreatedAt());
    }
}
