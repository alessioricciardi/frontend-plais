<script setup lang="ts">
//Types
import type { AchievementImage } from '~/types'

//Variables
const API_URL = useRuntimeConfig().public.API_URL
const photoIndex = ref<number>(0)

//Functions
const swipeImages = (direction: 'left' | 'right'): void => {
  if (!props.images || props.images.length < 2) return

  if (direction == 'left') {
    photoIndex.value =
      (photoIndex.value - 1 + props.images.length) % props.images.length
  } else if (direction == 'right')
    photoIndex.value = (photoIndex.value + 1) % props.images.length
}

const loadBigImage = () => {
  emit('bigImage', props.images[photoIndex.value].photoFileName)
}

//Props
const props = defineProps<{
  images: AchievementImage[]
}>()

//Emits
const emit = defineEmits<{
  (e: 'bigImage', imageUrl: string): void
}>()
</script>
<template>
  <div v-if="images && images.length >= 1" class="flex flex-row items-center">
    <!-- Swipe Left -->
    <div v-if="images && images.length > 1">
      <UIcon
        name="material-symbols:chevron-left-rounded"
        class="mr-15 cursor-pointer text-3xl hover:scale-120"
        @click.stop="swipeImages('left')"
      />
    </div>

    <!-- Images -->
    <div class="relative h-48 w-72">
      <!-- Left Image -->
      <div
        v-if="images && images.length >= 2"
        class="absolute top-0 right-12 z-0 flex h-full w-full cursor-pointer items-center hover:scale-102"
        @click.stop="swipeImages('left')"
      >
        <div
          class="relative h-[90%] w-full overflow-hidden rounded-md border-4 border-blue-700"
        >
          <img
            :src="`${API_URL}/uploads/achievements/${images[(photoIndex - 1 + images.length) % images.length].photoFileName}`"
            class="h-full w-full object-cover brightness-40"
          />
        </div>
      </div>
      <!-- Main Image -->
      <div
        class="w-ful relative z-10 h-full cursor-pointer hover:scale-102"
        @click.stop="loadBigImage"
      >
        <img
          :src="`${API_URL}/uploads/achievements/${images[photoIndex].photoFileName}`"
          class="h-full w-full rounded-md border-4 border-blue-700 object-cover"
        />
      </div>

      <!-- Right Image -->
      <div
        v-if="images && images.length >= 2"
        class="absolute top-0 left-12 z-0 flex h-full w-full cursor-pointer items-center hover:scale-102"
        @click.stop="swipeImages('right')"
      >
        <div
          class="h-[90%] w-full overflow-hidden rounded-md border-4 border-blue-700"
        >
          <img
            :src="`${API_URL}/uploads/achievements/${images[(photoIndex + 1) % images.length].photoFileName}`"
            class="h-full w-full object-cover brightness-40"
          />
        </div>
      </div>
    </div>

    <!-- Swipe Right -->
    <div v-if="images && images.length > 1">
      <UIcon
        name="material-symbols:chevron-right-rounded"
        class="ml-15 cursor-pointer text-3xl hover:scale-120"
        @click.stop="swipeImages('right')"
      />
    </div>
  </div>
</template>
