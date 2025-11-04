<script setup lang="ts">
//Types
import type { latestBulletin, latestEvent } from '~/types'

//Variables
const API_URL = useRuntimeConfig().public.API_URL
const events = ref<latestEvent[] | null>(null)
const bulletins = ref<latestBulletin[] | null>(null)
const router = useRouter()

//Functions
const loadBulletin = async (): Promise<void> => {
  bulletins.value = await $fetch<latestBulletin[]>(
    `${API_URL}/api/bulletin/latestFour`,
  )
}

const loadEvents = async (): Promise<void> => {
  events.value = await $fetch<latestEvent[]>(`${API_URL}/api/events/latestFour`)
}

//onMounted
onMounted(() => {
  loadBulletin()
  loadEvents()
})
</script>
<template>
  <div class="flex w-full">
    <!-- Latest Events -->
    <div class="w-1/2">
      <div class="flex w-full flex-col gap-5 px-2 text-center">
        <div
          v-for="event in events"
          :key="event.dateCreated"
          class="flex cursor-pointer flex-col gap-1"
          @click.stop="router.push('/events')"
        >
          <div class="text-2xl font-bold text-blue-600 sm:text-3xl md:text-4xl">
            {{ event.name }}
          </div>
          <div class="text-xs text-gray-400 sm:text-sm">
            Posted on: {{ event.dateCreated.slice(0, 10) }}
          </div>
        </div>
      </div>
    </div>
    <!-- Separator -->
    <div class="mx-1 rounded-xl border-[1.4px] border-gray-300 sm:mx-2"></div>
    <!-- Latest Bulletins -->
    <div class="w-1/2">
      <div class="flex w-full flex-col gap-5 px-2 text-center">
        <div
          v-for="bulletin in bulletins"
          :key="bulletin.id"
          class="flex cursor-pointer flex-col gap-1"
          @click.stop="router.push(`/bulletin/${bulletin.id}`)"
        >
          <div class="text-2xl font-bold text-blue-600 sm:text-3xl md:text-4xl">
            {{ bulletin.title }}
          </div>
          <div class="text-xs text-gray-400 sm:text-sm">
            Posted on: {{ bulletin.dateCreated.slice(0, 10) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
