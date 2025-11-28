<template>
    <div class="min-h-screen flex flex-col relative bg-cover bg-center"
        :style="{ backgroundImage: `url('/assets/images/thankyou-page.png')` }">
        <!-- Overlay for better text readability if needed, currently just the image -->
        <div class="absolute inset-0 bg-black/30"></div>

        <div class="relative z-10 flex flex-col min-h-screen">
            <LogoHeader />

            <!-- Center Content -->
            <div class="flex-grow flex flex-col items-center justify-center text-center text-white px-4">
                <p class="text-xl mb-2">All Set</p>
                <h1 class="text-4xl md:text-5xl font-bold mb-4">Thank you!</h1>
                <p class="text-lg font-light mb-8 max-w-md">
                    We’ll be in touch shortly — please keep an eye out for an email from our team.
                </p>

                <button
                    class="bg-white hover:bg-white text-black font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg">
                    Done
                </button>
            </div>

            <!-- Footer -->
            <div class="pb-4">
                <Footer />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Footer from '../../components/Footer/Footer.vue'
import LogoHeader from '../../components/LogoHeader/LogoHeader.vue'

const route = useRoute()
const router = useRouter()

</script>

<style scoped>
/* Add any specific overrides if tailwind isn't enough */
</style>
