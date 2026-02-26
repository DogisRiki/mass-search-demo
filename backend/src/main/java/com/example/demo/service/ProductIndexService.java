package com.example.demo.service;

import com.example.demo.entity.ProductDocument;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductSearchRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 商品インデックスサービス
 *
 * <p>
 * PostgreSQLから全商品をElasticsearchにインデクシングする
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductIndexService {

    /**
     * 商品リポジトリ
     */
    private final ProductRepository productRepository;

    /**
     * 商品検索リポジトリ
     */
    private final ProductSearchRepository productSearchRepository;

    /**
     * エンティティマネージャ
     */
    private final EntityManager entityManager;

    /**
     * 全商品をElasticsearchにインデクシングする
     *
     * @param batchSize バッチサイズ
     */
    @Transactional(readOnly = true)
    public void indexAll(int batchSize) {
        log.info("インデクシング開始");
        long totalIndexed = 0;
        int page = 0;

        while (true) {
            var products = productRepository.findAll(PageRequest.of(page, batchSize, Sort.by("id").ascending()));

            if (products.isEmpty()) {
                break;
            }

            List<ProductDocument> documents = products.getContent().stream().map(p -> new ProductDocument(p.getId(),
                    p.getName(), p.getDescription(), p.getCategory().getName(), p.getPrice(), p.getStatus())).toList();

            productSearchRepository.saveAll(documents);
            totalIndexed += documents.size();
            log.info("インデクシング進捗: {} 件完了", totalIndexed);

            // 永続化コンテキストをクリアしてメモリを解放
            entityManager.clear();
            page++;
        }

        log.info("インデクシング完了: 合計 {} 件", totalIndexed);
    }
}
