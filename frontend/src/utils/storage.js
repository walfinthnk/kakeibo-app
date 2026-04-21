const STORAGE_KEY = 'kakeibo-receipts';

// レシートデータをローカルストレージに保存
export const saveReceipts = (receipts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
};

// ローカルストレージからレシートデータを読み込む
export const loadReceipts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
