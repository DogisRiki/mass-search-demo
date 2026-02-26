package com.example.demo.repository;

import com.example.demo.entity.Product;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * 商品リポジトリ
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * 全商品をページングで取得する
     *
     * @param pageable ページング情報
     * @return 商品ページ
     */
    Page<Product> findAll(Pageable pageable);

    /**
     * カーソルページングで商品を取得する
     *
     * @param lastId 前回取得した最後のID
     * @param limit 取得件数
     * @return 商品リスト
     */
    @Query("SELECT p FROM Product p WHERE p.id > :lastId ORDER BY p.id ASC LIMIT :limit")
    List<Product> findByCursor(@Param("lastId") Long lastId, @Param("limit") int limit);
}
