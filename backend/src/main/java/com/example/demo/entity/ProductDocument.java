package com.example.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * 商品Elasticsearchドキュメント
 */
@Document(indexName = "products")
public class ProductDocument {

    /**
     * ID
     */
    @Id
    private Long id;

    /**
     * 商品名
     */
    @Field(type = FieldType.Text)
    private String name;

    /**
     * 説明文
     */
    @Field(type = FieldType.Text)
    private String description;

    /**
     * カテゴリ名
     */
    @Field(type = FieldType.Keyword)
    private String categoryName;

    /**
     * 価格
     */
    @Field(type = FieldType.Integer)
    private Integer price;

    /**
     * ステータス
     */
    @Field(type = FieldType.Keyword)
    private String status;

    /**
     * デフォルトコンストラクタ
     */
    public ProductDocument() {}

    /**
     * コンストラクタ
     *
     * @param id ID
     * @param name 商品名
     * @param description 説明文
     * @param categoryName カテゴリ名
     * @param price 価格
     * @param status ステータス
     */
    public ProductDocument(Long id, String name, String description, String categoryName, Integer price,
            String status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryName = categoryName;
        this.price = price;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Integer getPrice() {
        return price;
    }

    public String getStatus() {
        return status;
    }
}
