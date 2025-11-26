<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-shadow hover:shadow-md" @click="handleChartClick">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Application Status Overview</h3>
    <div class="h-64 relative">
      <Doughnut 
        ref="chartRef"
        :data="chartData" 
        :options="chartOptions" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const router = useRouter();
const chartRef = ref(null);

interface Props {
  stats: {
    total: number;
    byStatus: {
      pending: number;
      submitted: number;
      approved: number;
      rejected: number;
    };
  };
}

const props = defineProps<Props>();

const handleChartClick = (event: MouseEvent, elements: any[]) => {
  // Check if chartRef is available and has data
  if (!chartRef.value || !chartRef.value.chart) return;
  
  const chart = chartRef.value.chart;
  const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

  if (points.length) {
    const firstPoint = points[0];
    const label = chart.data.labels[firstPoint.index];
    
    if (label) {
      // Navigate to applications page with status filter
      router.push({
        path: '/admin/applications',
        query: { status: label.toLowerCase() }
      });
    }
  } else {
    // If clicked on chart background, go to all applications
    router.push('/admin/applications');
  }
};

const chartData = computed(() => ({
  labels: ['Pending', 'Submitted', 'Approved', 'Rejected'],
  datasets: [
    {
      data: [
        props.stats.byStatus.pending,
        props.stats.byStatus.submitted,
        props.stats.byStatus.approved,
        props.stats.byStatus.rejected
      ],
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)',  // Yellow for pending
        'rgba(59, 130, 246, 0.8)',   // Blue for submitted
        'rgba(34, 197, 94, 0.8)',    // Green for approved
        'rgba(239, 68, 68, 0.8)'     // Red for rejected
      ],
      borderColor: [
        'rgb(251, 191, 36)',
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 2
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  onClick: (event: any, elements: any[], chart: any) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chart.data.labels[index];
      // Emit event or navigate directly (we'll use the wrapper click for simplicity but this enables chart click)
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 15,
        font: {
          size: 12
        }
      },
      onClick: (e: any, legendItem: any, legend: any) => {
        // Handle legend click to navigate
        const status = legendItem.text.toLowerCase();
        router.push({
          path: '/admin/applications',
          query: { status }
        });
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = props.stats.total;
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
};
</script>

