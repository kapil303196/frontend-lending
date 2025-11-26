<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Funding Requested (Last 30 Days)</h3>
    <div class="h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  data: Array<{ _id: string; totalAmount: number }>;
}

const props = defineProps<Props>();

const chartData = computed(() => ({
  labels: props.data.map(item => {
    const date = new Date(item._id);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }),
  datasets: [
    {
      label: 'Amount Requested',
      data: props.data.map(item => item.totalAmount),
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4F46E5',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4F46E5'
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => {
          if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
          if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
          return '$' + value;
        }
      }
    }
  }
};
</script>

