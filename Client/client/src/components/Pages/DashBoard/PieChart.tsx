// src/components/PieChart.tsx

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  };
}

const PieChart: React.FC<PieChartProps> = ({ chartData }) => {
  // Optional: Customize the options for the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0; // Using context.raw to get the value
            return `${label}: ${value}`; // Customize tooltip display
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;
