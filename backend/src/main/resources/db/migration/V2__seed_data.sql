-- ------------------------------------------------------------
-- カテゴリ（20件）
-- ------------------------------------------------------------
INSERT INTO categories (name) VALUES
    ('スマートフォン'),
    ('ノートPC'),
    ('タブレット'),
    ('イヤホン・ヘッドホン'),
    ('スマートウォッチ'),
    ('カメラ'),
    ('テレビ'),
    ('ゲーム機'),
    ('キーボード'),
    ('マウス'),
    ('モニター'),
    ('スピーカー'),
    ('ルーター'),
    ('外付けSSD'),
    ('USBメモリ'),
    ('プリンター'),
    ('掃除機'),
    ('電子レンジ'),
    ('冷蔵庫'),
    ('洗濯機');

-- ------------------------------------------------------------
-- 商品（500万件）
-- ------------------------------------------------------------
-- 方針:
--   - name: カテゴリ名ベース + 連番（例: "スマートフォン #1234567"）
--   - description: 固定テンプレート + 連番
--   - category_id: 1〜20のランダム
--   - price: 100〜500,000のランダム（100円刻み）
--   - stock_quantity: 0〜1,000のランダム
--   - status: 80% ACTIVE, 15% INACTIVE, 5% DISCONTINUED
--   - created_at: 過去3年間のランダムな日時
--   - updated_at: created_at 以降のランダムな日時

-- カテゴリ名の配列を使って商品名を生成する
INSERT INTO products (name, description, category_id, price, stock_quantity, status, created_at, updated_at)
SELECT
    -- 商品名: カテゴリ名 + 連番
    (ARRAY[
        'スマートフォン','ノートPC','タブレット','イヤホン','スマートウォッチ',
        'カメラ','テレビ','ゲーム機','キーボード','マウス',
        'モニター','スピーカー','ルーター','外付けSSD','USBメモリ',
        'プリンター','掃除機','電子レンジ','冷蔵庫','洗濯機'
    ])[cat_id] || ' モデル' || series_id AS name,

    -- 説明文
    '高品質な' ||
    (ARRAY[
        'スマートフォン','ノートPC','タブレット','イヤホン','スマートウォッチ',
        'カメラ','テレビ','ゲーム機','キーボード','マウス',
        'モニター','スピーカー','ルーター','外付けSSD','USBメモリ',
        'プリンター','掃除機','電子レンジ','冷蔵庫','洗濯機'
    ])[cat_id] || 'です。最新技術を搭載し、快適な使用体験を提供します。型番: MDL-' || series_id AS description,

    -- category_id (1〜20)
    cat_id,

    -- price (100〜500,000、100円刻み)
    (floor(random() * 5000)::int + 1) * 100,

    -- stock_quantity (0〜1,000)
    floor(random() * 1001)::int,

    -- status (80% ACTIVE, 15% INACTIVE, 5% DISCONTINUED)
    CASE
        WHEN rnd_status < 0.80 THEN 'ACTIVE'
        WHEN rnd_status < 0.95 THEN 'INACTIVE'
        ELSE 'DISCONTINUED'
    END,

    -- created_at (過去3年間のランダムな日時)
    random_created_at,

    -- updated_at (created_at 〜 現在のランダムな日時)
    random_created_at + (random() * (CURRENT_TIMESTAMP - random_created_at))

FROM (
    SELECT
        series_id,
        (floor(random() * 20)::int + 1) AS cat_id,
        random() AS rnd_status,
        CURRENT_TIMESTAMP - (random() * interval '1095 days') AS random_created_at
    FROM generate_series(1, 5000000) AS series_id
) AS sub;
