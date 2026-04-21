import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// メモリ上に画像を一時保存（ディスクに書き出さない）
const upload = multer({ storage: multer.memoryStorage() });
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// レシート画像をClaude APIで解析するエンドポイント
app.post('/api/analyze-receipt', upload.single('receipt'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '画像ファイルがありません' });
  }

  // 対応MIMEタイプチェック
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'JPEG・PNG・GIF・WebP形式の画像を使用してください' });
  }

  try {
    const imageData = req.file.buffer.toString('base64');
    // multerのmimetypeをAnthropicのmedia_type型にキャスト
    const mediaType = req.file.mimetype;

    const today = new Date().toISOString().split('T')[0];

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageData,
              },
            },
            {
              type: 'text',
              text: `このレシート画像を解析して、以下のJSON形式のみを返してください。説明文や前置きは不要です。

{
  "date": "YYYY-MM-DD形式の日付（レシートに日付がなければ「${today}」を使用）",
  "store": "店舗名（不明な場合は「店舗不明」）",
  "items": [
    {
      "name": "商品名",
      "price": 金額（整数・税込）,
      "category": "以下のいずれか：食費／外食／日用品／交通費／娯楽／医療費／その他"
    }
  ],
  "total": 合計金額（整数）
}

カテゴリの判断基準：
- 食費：スーパー・コンビニ等での食料品・飲み物
- 外食：レストラン・カフェ・ファストフード等での飲食
- 日用品：洗剤・シャンプー・文房具・生活用品等
- 交通費：電車・バス・タクシー・ガソリン等
- 娯楽：書籍・映画・ゲーム・趣味用品等
- 医療費：病院・薬局・医薬品等
- その他：上記以外`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;

    // レスポンスからJSON部分を抽出
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('レシートの解析結果を取得できませんでした');
    }

    const receiptData = JSON.parse(jsonMatch[0]);
    res.json(receiptData);
  } catch (error) {
    console.error('レシート解析エラー:', error.message);
    res.status(500).json({ error: error.message || 'サーバーエラーが発生しました' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`バックエンドサーバー起動: http://localhost:${PORT}`);
});
