import React, { useState, useEffect } from 'react';
import ReceiptUploader from './components/ReceiptUploader';
import ExpenseList from './components/ExpenseList';
import Charts from './components/Charts';
import Summary from './components/Summary';
import { saveReceipts, loadReceipts } from './utils/storage';
import { checkNegativeAmounts, checkDuplicate } from './utils/validation';

const App = () => {
  // ローカルストレージから初期データを読み込む
  const [receipts, setReceipts] = useState(() => loadReceipts());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  // バリデーション警告メッセージ一覧
  const [warnings, setWarnings] = useState([]);

  // レシートが変更されるたびにローカルストレージへ保存
  useEffect(() => {
    saveReceipts(receipts);
  }, [receipts]);

  // 新しいレシートを追加（バリデーション後に先頭へ追加）
  const addReceipt = (receiptData) => {
    const newWarnings = [];

    const negativeWarning = checkNegativeAmounts(receiptData);
    if (negativeWarning) newWarnings.push(negativeWarning);

    const duplicateWarning = checkDuplicate(receiptData, receipts);
    if (duplicateWarning) newWarnings.push(duplicateWarning);

    setWarnings(newWarnings);

    const receipt = {
      ...receiptData,
      id: `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    setReceipts((prev) => [receipt, ...prev]);
  };

  const deleteReceipt = (id) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  };

  // 選択中の月でフィルタリング
  const filteredReceipts = selectedMonth
    ? receipts.filter((r) => r.date?.startsWith(selectedMonth))
    : receipts;

  // フィルタ後のデータでカテゴリ別合計を集計
  const categoryTotals = filteredReceipts
    .flatMap((r) => r.items ?? [])
    .reduce((acc, item) => {
      const cat = item.category ?? 'その他';
      acc[cat] = (acc[cat] ?? 0) + (item.price ?? 0);
      return acc;
    }, {});

  // 全レシートで月別合計を集計（月フィルターに関わらず全期間を表示）
  const monthlyTotals = receipts.reduce((acc, r) => {
    if (!r.date) return acc;
    const month = r.date.slice(0, 7);
    acc[month] = (acc[month] ?? 0) + (r.total ?? 0);
    return acc;
  }, {});

  // フィルター用の月一覧を新しい順で生成
  const availableMonths = [
    ...new Set(receipts.map((r) => r.date?.slice(0, 7)).filter(Boolean)),
  ].sort().reverse();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧾 レシート家計簿</h1>
        <p className="app-subtitle">レシートを読み込んで家計をかんたん管理</p>
      </header>

      <main className="app-main">
        {/* レシートアップロード */}
        <ReceiptUploader onReceiptAdded={addReceipt} />

        {/* バリデーション警告 */}
        {warnings.length > 0 && (
          <div className="warnings-box">
            <div className="warnings-header">
              <span>⚠️ 登録時の警告</span>
              <button className="warnings-close" onClick={() => setWarnings([])}>✕</button>
            </div>
            <ul className="warnings-list">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 月フィルター */}
        {availableMonths.length > 0 && (
          <div className="month-filter">
            <label htmlFor="month-select">月を絞り込む：</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">すべての月</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* カテゴリ別集計 */}
        <Summary categoryTotals={categoryTotals} />

        {/* タブ切り替え */}
        {receipts.length > 0 && (
          <>
            <div className="tabs">
              <button
                className={`tab${activeTab === 'list' ? ' active' : ''}`}
                onClick={() => setActiveTab('list')}
              >
                明細一覧
              </button>
              <button
                className={`tab${activeTab === 'charts' ? ' active' : ''}`}
                onClick={() => setActiveTab('charts')}
              >
                グラフ
              </button>
            </div>

            {activeTab === 'list' && (
              <ExpenseList receipts={filteredReceipts} onDelete={deleteReceipt} />
            )}
            {activeTab === 'charts' && (
              <Charts
                categoryTotals={categoryTotals}
                monthlyTotals={monthlyTotals}
              />
            )}
          </>
        )}

        {/* 初期状態のメッセージ */}
        {receipts.length === 0 && (
          <div className="empty-state">
            まだレシートがありません。上のフォームから画像をアップロードしてください。
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
