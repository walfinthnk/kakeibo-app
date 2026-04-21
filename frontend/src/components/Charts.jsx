import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { CATEGORY_COLORS } from '../utils/constants';

// Chart.jsに必要なコンポーネントを登録
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// カテゴリ別円グラフ・月別棒グラフを表示するコンポーネント
const Charts = ({ categoryTotals, monthlyTotals }) => {
  const categories = Object.keys(categoryTotals);
  const months = Object.keys(monthlyTotals).sort();

  if (categories.length === 0 && months.length === 0) {
    return (
      <div className="charts-empty">
        データがありません。レシートを読み込むとグラフが表示されます。
      </div>
    );
  }

  // 円グラフ用データ
  const pieData = {
    labels: categories,
    datasets: [
      {
        data: categories.map((c) => categoryTotals[c]),
        backgroundColor: categories.map((c) => CATEGORY_COLORS[c] ?? '#C9CBCF'),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: 'カテゴリ別支出',
        font: { size: 15 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return `${ctx.label}: ¥${ctx.parsed.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  // 棒グラフ用データ
  const barData = {
    labels: months,
    datasets: [
      {
        label: '支出合計',
        data: months.map((m) => monthlyTotals[m]),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '月別支出推移',
        font: { size: 15 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `¥${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) => `¥${v.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="charts">
      {categories.length > 0 && (
        <div className="chart-container">
          <Pie data={pieData} options={pieOptions} />
        </div>
      )}
      {months.length > 0 && (
        <div className="chart-container">
          <Bar data={barData} options={barOptions} />
        </div>
      )}
    </div>
  );
};

export default Charts;
