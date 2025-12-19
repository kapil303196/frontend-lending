<template>
    <div class="min-h-screen flex flex-col relative">
        <img src="/assets/images/lending-welcome.jpg" alt="Welcome Background"
            class="absolute inset-0 w-full h-full object-cover" fetchpriority="high" />
        <!-- Overlay for better text readability if needed, currently just the image -->
        <div class="absolute inset-0 bg-black/30"></div>

        <div class="relative z-10 flex flex-col min-h-screen">
            <!-- <LogoHeader logoTheme="light" /> -->

            <!-- Center Content -->
            <div class="flex-grow flex flex-col items-center justify-center text-center text-white px-4">
                <p class="text-xl mb-2">Hello,</p>
                <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ mcaData?.data?.company }}</h1>
                <p class="text-lg font-light mb-8 max-w-md">
                    Please verify business information and fill in the remaining fields
                </p>

                <button @click="startForm"
                    class="bg-white hover:bg-white text-black font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg">
                    Start
                </button>

                <div v-if="loading" class="mt-4">
                    <span class="text-sm">Loading...</span>
                </div>
                <div v-if="error" class="mt-4 text-red-300">
                    {{ error }}
                </div>
            </div>

            <!-- Footer -->
            <!-- <div class="pb-4">
                <Footer />
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MCAData } from '../../types'
import { useApi } from "../../composables/useApi"
import Footer from '../../components/Footer/Footer.vue'
import LogoHeader from '../../components/LogoHeader/LogoHeader.vue'

const route = useRoute()
const router = useRouter()
const uniqueId = route.params.uniqueId as string
const { fetchMCAData } = useApi()

const loading = ref(true)
const error = ref('')
const mcaData = ref<MCAData | null>(null)

const startForm = () => {
    if (uniqueId) {
        router.push(`/form/${uniqueId}`)
    }
}

onMounted(async () => {
    if (!uniqueId) {
        error.value = 'You are on the wrong page. Please use the link provided in your email.'
        loading.value = false
        return
    }

    try {
        // Verify the ID is valid by fetching data, though we might not display it all here
        mcaData.value = await fetchMCAData(uniqueId)
        loading.value = false
    } catch (err: any) {
        error.value = err?.message || 'Failed to load application data. Please check your link and try again.'
        loading.value = false
    }
})
</script>

<style scoped>
/* Add any specific overrides if tailwind isn't enough */
</style>
