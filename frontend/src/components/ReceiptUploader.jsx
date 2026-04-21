import React, { useState } from 'react';

// レシート画像をアップロードしてバックエンドAPIに送信するコンポーネント
const ReceiptUploader = ({ onReceiptAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // ファイルを受け取ってAPIに送信
  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await fetch('/api/analyze-receipt', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'APIエラーが発生しました');
      }

      onReceiptAdded(data);
    } catch (err) {
      setError(`エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleClick = () => {
    if (!loading) {
      document.getElementById('receipt-input').click();
    }
  };

  return (
    <div className="uploader card">
      <h2>レシートを読み込む</h2>
      <div
        className={`drop-zone${dragOver ? ' drag-over' : ''}${loading ? ' loading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Claude AIがレシートを解析しています...</p>
          </div>
        ) : (
          <div>
            <div className="upload-icon">🧾</div>
            <p>クリックまたはドラッグ＆ドロップで画像を選択</p>
            <p className="file-hint">JPEG・PNG・GIF・WebP 対応</p>
          </div>
        )}
      </div>
      <input
        id="receipt-input"
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ReceiptUploader;
