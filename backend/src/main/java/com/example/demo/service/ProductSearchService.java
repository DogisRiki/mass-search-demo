package com.example.demo.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.demo.dto.CursorPageResponse;
import com.example.demo.dto.ProductResponse;
import com.example.demo.entity.ProductDocument;
import com.example.demo.repository.ProductRepository;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 商品検索サービス（Elasticsearch）
 */
@Service
@RequiredArgsConstructor
public class ProductSearchService {

    /**
     * Elasticsearchクライアント
     */
    private final ElasticsearchClient elasticsearchClient;

    /**
     * 商品リポジトリ（詳細取得用）
     */
    private final ProductRepository productRepository;

    /**
     * キーワードで商品を検索する
     *
     * @param query キーワード
     * @param size 取得件数
     * @param searchAfter 前ページ最後のソート値（初回はnull）
     * @return 検索結果
     */
    @Transactional(readOnly = true)
    public CursorPageResponse<ProductResponse> search(String query, int size, String searchAfter) {

        try {
            SearchRequest.Builder builder = new SearchRequest.Builder().index("products")
                    .query(q -> q.multiMatch(m -> m.query(query).fields("name", "description")))
                    .sort(s -> s.score(sc -> sc)).sort(s -> s.field(f -> f.field("id"))).size(size);

            if (searchAfter != null) {
                String[] parts = searchAfter.split(",");
                double score = Double.parseDouble(parts[0]);
                long id = Long.parseLong(parts[1]);
                builder.searchAfter(List.of(FieldValue.of(score), FieldValue.of(id)));
            }

            SearchResponse<ProductDocument> response =
                    elasticsearchClient.search(builder.build(), ProductDocument.class);

            List<Hit<ProductDocument>> hits = response.hits().hits();

            List<Long> ids = hits.stream().map(hit -> hit.source().getId()).toList();

            List<ProductResponse> content =
                    productRepository.findAllById(ids).stream().map(ProductResponse::from).toList();

            String nextCursor = null;
            if (!hits.isEmpty()) {
                Hit<ProductDocument> lastHit = hits.get(hits.size() - 1);
                if (lastHit.sort() != null && lastHit.sort().size() >= 2) {
                    double lastScore = lastHit.sort().get(0).doubleValue();
                    long lastId = lastHit.sort().get(1).longValue();
                    nextCursor = lastScore + "," + lastId;
                }
            }

            boolean hasNext = hits.size() == size;

            return new CursorPageResponse<>(content, nextCursor, hasNext);

        } catch (IOException e) {
            throw new RuntimeException("Elasticsearch検索に失敗しました", e);
        }
    }
}
