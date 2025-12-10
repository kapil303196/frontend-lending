<template>
    <header>
        <div class="p-8 w-100 flex justify-center">
            <!-- Placeholder for logo, replace with actual logo path if available -->
            <div class="text-white text-2xl font-bold">
                <img v-if="logoTheme === 'light'" src="/assets/images/lender-logo-dark.svg" style="width: 180px;"
                    alt="">
                <img v-else src="/assets/images/lender-logo-light-2.svg" style="width: 180px;" alt="">
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    logoTheme: {
        type: String,
        default: 'dark'
    }
})
</script>