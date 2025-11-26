<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full cursor-pointer transition-shadow hover:shadow-md" @click="handleClick">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Approval Status by Amount</h3>
    <div class="h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const router = useRouter();

interface Props {
  data: {
    totalAsked: number;
    totalApproved: number;
    totalRejected: number;
  };
}

const props = defineProps<Props>();

const handleClick = () => {
  // Navigate to applications sorted by amount
  router.push({
    path: '/admin/applications',
    query: { sortBy: 'amount' }
  });
};

const chartData = computed(() => ({
  labels: ['Total Requested', 'Approved', 'Rejected'],
  datasets: [
    {
      label: 'Amount',
      data: [props.data.totalAsked, props.data.totalApproved, props.data.totalRejected],
      backgroundColor: [
        'rgba(79, 70, 229, 0.8)',  // Indigo for Total
        'rgba(34, 197, 94, 0.8)',  // Green for Approved
        'rgba(239, 68, 68, 0.8)'   // Red for Rejected
      ],
      borderRadius: 6
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

