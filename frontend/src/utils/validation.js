// 金額が負の値の商品・合計をチェックし、警告メッセージを返す（問題なければ null）
export const checkNegativeAmounts = (receipt) => {
  const negativeItems = (receipt.items ?? []).filter((item) => (item.price ?? 0) < 0);

  if (negativeItems.length > 0) {
    const names = negativeItems.map((i) => i.name).join('、');
    return `金額が負の値の商品があります（${names}）`;
  }

  if ((receipt.total ?? 0) < 0) {
    return `合計金額が負の値です（¥${receipt.total.toLocaleString()}）`;
  }

  return null;
};

// 同一の日付・合計金額のレシートが既に存在するかチェックし、警告メッセージを返す（なければ null）
export const checkDuplicate = (receipt, existingReceipts) => {
  const duplicate = existingReceipts.find(
    (r) => r.date === receipt.date && r.total === receipt.total
  );

  if (duplicate) {
    return `同じ日付（${receipt.date}）・金額（¥${(receipt.total ?? 0).toLocaleString()}）のレシートが既に登録されています`;
  }

  return null;
};
