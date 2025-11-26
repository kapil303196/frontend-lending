<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full cursor-pointer transition-shadow hover:shadow-md" @click="handleClick">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue vs. Lending Volume</h3>
    <div class="h-64">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const router = useRouter();

interface Props {
  data: {
    totalRevenue: number;
    totalLending: number;
  };
}

const props = defineProps<Props>();

const handleClick = () => {
  // Navigate to applications sorted by revenue
  router.push({
    path: '/admin/applications',
    query: { sortBy: 'revenue' }
  });
};

const chartData = computed(() => ({
  labels: ['Total Monthly Revenue', 'Total Lending Requested'],
  datasets: [
    {
      data: [props.data.totalRevenue, props.data.totalLending],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',  // Emerald for Revenue
        'rgba(99, 102, 241, 0.8)'   // Indigo for Lending
      ],
      borderColor: [
        'rgb(16, 185, 129)',
        'rgb(99, 102, 241)'
      ],
      borderWidth: 1
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || '';
          const value = context.parsed || 0;
          const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
          return `${label}: ${formattedValue}`;
        }
      }
    }
  }
};
</script>

