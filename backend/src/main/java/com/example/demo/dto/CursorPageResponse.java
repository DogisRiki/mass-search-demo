package com.example.demo.dto;

/**
 * カーソルページングレスポンス
 *
 * @param content コンテンツ
 * @param nextCursor 次ページカーソル
 * @param hasNext 次ページ有無
 * @param <T> コンテンツの型
 */
public record CursorPageResponse<T>(java.util.List<T> content, String nextCursor, boolean hasNext) {
}
