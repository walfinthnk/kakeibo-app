import React from 'react';
import { CATEGORY_COLORS } from '../utils/constants';

// カテゴリ別集計を表示するコンポーネント
const Summary = ({ categoryTotals }) => {
  const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  if (total === 0) return null;

  return (
    <div className="summary card">
      <h2>カテゴリ別集計</h2>
      <div className="summary-total">合計: ¥{total.toLocaleString()}</div>
      <div className="summary-categories">
        {Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .map(([category, amount]) => (
            <div key={category} className="summary-category">
              <span
                className="category-dot"
                style={{ backgroundColor: CATEGORY_COLORS[category] ?? '#C9CBCF' }}
              />
              <span className="category-name">{category}</span>
              <span className="category-amount">¥{amount.toLocaleString()}</span>
              <span className="category-percent">
                {((amount / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Summary;
