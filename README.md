# 大規模検索デモ（Mass Search Demo）

500万件の商品データを使って、ページングと検索のパフォーマンスを比較するデモアプリケーションです。

## 技術スタック

### バックエンド

- Java 25 / Spring Boot 4.0.3
- Spring Data JPA（Hibernate 7）
- Spring Data Elasticsearch
- PostgreSQL 17.8
- Elasticsearch 9.3.0
- Flyway（マイグレーション）
- Gradle

### フロントエンド

- React 19 / TypeScript 5.9
- Vite 7
- TanStack Query（サーバー状態管理）
- shadcn/ui（UIコンポーネント）
- Tailwind CSS v4

### インフラ

- Docker Compose

## 機能

### 1. LIMIT OFFSETページング

PostgreSQLの`LIMIT ... OFFSET ...`によるページネーション。ページ番号ナビゲーションUIで任意のページにジャンプ可能。後方ページほどOFFSET値に比例して遅くなる問題を体験できる。

### 2. カーソルベースページング

`WHERE id > :lastId ORDER BY id LIMIT :size`によるカーソルページング。前へ/次へボタンのみのUI。データ量に関係なく常に一定速度で動作する。

### 3. Elasticsearch全文検索

PostgreSQLをデータの正本、Elasticsearchを検索用セカンダリストアとして併用。転置インデックスによる高速全文検索とsearch_afterによる無限スクロール的なページングを実装。

### 4. SQL最適化

EXPLAIN ANALYZEを用いたインデックス設計の検証。単一カラムインデックス、複合インデックス、パーシャルインデックスの効果比較。

## パフォーマンス計測結果

### ページング比較（400万件目付近）

| 方式 | 実行時間 | 備考 |
|---|---|---|
| LIMIT OFFSET | 1,078ms | 400万行読み飛ばし |
| カーソルベース | 0.49ms | Index Condで直接ジャンプ |

### 検索比較（500万件、キーワード: モニター）

| 方式 | 実行時間 | 備考 |
|---|---|---|
| PostgreSQL LIKE（COUNT全件） | 308ms | Seq Scan（全件走査） |
| Elasticsearch単体 | 32ms | 転置インデックス使用 |

### インデックス最適化

| クエリ | Before | After | 手法 |
|---|---|---|---|
| category_id = 5 ORDER BY created_at DESC LIMIT 20 | 182ms | 0.37ms | 複合インデックス（DESC） |
| status = 'ACTIVE' AND price < 10000 LIMIT 20 | 260ms | 0.99ms | 複合インデックス |
| status = 'DISCONTINUED'（パーシャル） | 798ms | 0.044ms | パーシャルインデックス + LIMIT |

## 環境構成

DevContainer + Docker Compose構成。VSCodeのDev Containersで開発環境を起動する。

### コンテナ構成

| コンテナ | イメージ | ポート | 用途 |
|---|---|---|---|
| spring | eclipse-temurin:25-jdk | 8080 | Spring Bootバックエンド |
| react | node:24-alpine | 5173 | React フロントエンド |
| postgresql | postgres:17.8-alpine | 5432 | データベース |
| elasticsearch | elasticsearch:9.3.0 | 9200 | 全文検索エンジン |
| dind | docker:29-dind | - | Testcontainers用 |

### セットアップ手順

1. VSCodeでプロジェクトルートを開く
2. コマンドパレット（Ctrl+Shift+P）→「Dev Containers: Reopen in Container」を選択
3. backendまたはfrontendのDevContainerを選択して起動（compose.yamlの全コンテナが自動起動される）

```bash
# バックエンド（springコンテナ内で実行）
./gradlew bootRun

# フロントエンド（reactコンテナ内で実行）
pnpm install
pnpm dev

# Elasticsearchインデクシング（初回のみ、数分かかる）
curl -X POST http://localhost:8080/api/products/index
```

Flywayにより初回起動時にテーブル作成と500万件のシードデータ投入が自動実行される。

### DevContainer

- `backend/.devcontainer/devcontainer.json` → springコンテナにアタッチ
- `frontend/.devcontainer/devcontainer.json` → reactコンテナにアタッチ

バックエンドとフロントエンドを同時に開発する場合は、VSCodeのウィンドウを2つ開き、それぞれ別のDevContainerで起動する。

### 接続情報

| サービス | 接続先 |
|---|---|
| PostgreSQL | host: db / port: 5432 / user: postgres / password: postgres / db: mass |
| Elasticsearch | host: elasticsearch / port: 9200 |
| フロントエンド | http://localhost:5173 |
| バックエンドAPI | http://localhost:8080 |

## データ構造

### テーブル

- `categories`（20件）: カテゴリマスタ
- `products`（500万件）: 商品データ

### データ分布

- ステータス: ACTIVE 80% / INACTIVE 15% / DISCONTINUED 5%
- カテゴリ: 20種類に均等分散
- 価格: 1,000〜500,000円のランダム値

### インデックス（別途作成し、作成前とで比較する用）

```sql
-- 主キー（自動生成）
products_pkey ON products (id)

-- ステータス
idx_products_status ON products (status)

-- ステータス + 価格（複合）
idx_products_status_price ON products (status, price)

-- カテゴリ + 作成日（複合、DESC）
idx_products_category_created ON products (category_id, created_at DESC)

-- DISCONTINUED限定（パーシャル）
idx_products_discontinued ON products (id) WHERE status = 'DISCONTINUED'
```

## APIエンドポイント

| メソッド | パス | 説明 |
|---|---|---|
| GET | /api/products?page=0&size=20 | LIMIT OFFSETページング |
| GET | /api/products/cursor?lastId=0&size=20 | カーソルベースページング |
| GET | /api/products/search?q=モニター&size=20 | Elasticsearch検索 |
| POST | /api/products/index | Elasticsearchインデクシング |

## プロジェクト構成

### バックエンド

```
backend/src/main/java/com/example/demo/
├── config/          WebConfig（CORS設定）
├── controller/      ProductController, ProductSearchController
├── dto/             ProductResponse, CursorPageResponse
├── entity/          Product, Category, ProductDocument
├── repository/      ProductRepository, ProductSearchRepository
└── service/         ProductService, ProductSearchService, ProductIndexService
```

### フロントエンド（Bulletproof React構成）

```
frontend/src/
├── App.tsx
├── main.tsx
├── config/
│   └── env.ts                    環境変数管理
├── lib/
│   └── queryClient.ts            TanStack Query設定
└── features/products/
    ├── api/
    │   └── fetchProducts.ts      API関数
    ├── hooks/
    │   ├── useProductsOffset.ts  LIMIT OFFSETフック
    │   ├── useProductsCursor.ts  カーソルフック
    │   └── useProductsSearch.ts  Elasticsearch検索フック（useInfiniteQuery）
    ├── components/
    │   ├── ProductTable.tsx       テーブル（Presentational）
    │   ├── ProductTableSkeleton.tsx
    │   ├── Pagination.tsx         ページナビ（Presentational）
    │   ├── SearchBar.tsx          検索バー（Presentational）
    │   ├── ProductListOffset.tsx  LIMIT OFFSET（Container）
    │   ├── ProductListCursor.tsx  カーソル（Container）
    │   └── ProductListSearch.tsx  ES検索（Container）
    ├── types/
    │   └── index.ts              型定義
    └── index.ts                  エクスポート
```

## 学習ポイント

### LIMIT OFFSET vs カーソルベース

- LIMIT OFFSETはOFFSET値に比例してパフォーマンスが劣化する（400万件目で約1,000倍の差）
- カーソルベースはインデックスを使って直接ジャンプするため常に一定速度
- LIMIT OFFSETはデータの追加/削除時に重複・欠落が発生する
- 実務ではUIパターンに応じて使い分ける（ページ番号 → OFFSET、無限スクロール → カーソル）

### PostgreSQL LIKE vs Elasticsearch

- `LIKE '%keyword%'`はBTREEインデックスが使えずSeq Scanになる
- Elasticsearchは転置インデックスにより、キーワードの出現頻度に関係なく一定速度
- 実務ではPostgreSQLをデータの正本、Elasticsearchを検索用コピーとして併用
- データ同期は二重書き込み + 定期バッチが最も一般的

### インデックス設計

- インデックスは「追加すれば速くなる」ではなく、クエリパターンとデータ分布に基づいて設計する
- 選択性が低い（例: 80%がACTIVE）とクエリプランナーがインデックスを使わない判断をする
- 複合インデックスはカラム順序が重要（最左プレフィックスの原則）
- EXPLAIN ANALYZEで必ず効果を検証し、逆効果になっていないか確認する

### JPA/Hibernate

- Lazy LoadingはMyBatisにない概念。セッションが閉じた後にプロキシにアクセスするとLazyInitializationException
- 大量データのバッチ処理ではentityManager.clear()で永続化コンテキストを解放しないとOOM
- @Transactional(readOnly = true)でメソッド全体のセッションを維持し、ダーティチェックをスキップ
