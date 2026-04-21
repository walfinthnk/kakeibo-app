import React from 'react';
import { CATEGORY_COLORS } from '../utils/constants';

// レシート一覧を表示するコンポーネント
const ExpenseList = ({ receipts, onDelete }) => {
  if (receipts.length === 0) {
    return (
      <div className="empty-state">
        レシートがありません。上のフォームからレシートを追加してください。
      </div>
    );
  }

  return (
    <div className="expense-list">
      {receipts.map((receipt) => (
        <div key={receipt.id} className="receipt-card">
          <div className="receipt-header">
            <div className="receipt-info">
              <span className="receipt-store">{receipt.store || '店舗不明'}</span>
              <span className="receipt-date">{receipt.date}</span>
            </div>
            <div className="receipt-actions">
              <span className="receipt-total">
                ¥{(receipt.total ?? 0).toLocaleString()}
              </span>
              <button className="delete-btn" onClick={() => onDelete(receipt.id)}>
                削除
              </button>
            </div>
          </div>
          <div className="receipt-items">
            {(receipt.items ?? []).map((item, idx) => (
              <div key={idx} className="receipt-item">
                <span
                  className="item-category-badge"
                  style={{ backgroundColor: CATEGORY_COLORS[item.category] ?? '#C9CBCF' }}
                >
                  {item.category ?? 'その他'}
                </span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">¥{(item.price ?? 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
