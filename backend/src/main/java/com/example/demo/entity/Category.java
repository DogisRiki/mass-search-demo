package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * カテゴリエンティティ
 */
@Entity
@Table(name = "categories")
@Getter
@NoArgsConstructor
public class Category {

    /**
     * ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * カテゴリ名
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * 作成日時
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
