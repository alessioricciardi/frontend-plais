<script setup lang="ts">
//Types
import type { NuxtError } from '#app'

//Variables
const router = useRouter()

//Props
const props = defineProps({
  error: Object as () => NuxtError,
})
</script>

<template>
  <Navbar />

  <div class="mt-20 flex w-full items-center justify-center">
    <!-- Icon -->
    <div class="= mr-5">
      <UIcon name="mdi:alert" class="text-[7em] text-blue-700" />
    </div>
    <!-- Message -->
    <div class="text-center">
      <div class="text-4xl font-bold">Error {{ error?.statusCode }}</div>
      <div
        class="mt-3 cursor-pointer text-2xl underline"
        @click.stop="router.push('/')"
      >
        Go back to the homepage
      </div>
    </div>
  </div>
</template>
