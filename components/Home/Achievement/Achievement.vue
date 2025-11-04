<script setup lang="ts">
//Types
import type { Achievement } from '~/types'

//Variables
const loggedIn = useState('loggedIn')

//Functions
const startEditingMode = (): void => {
  emit('edit', props.id as number)
}

//Props
const props = defineProps<Achievement>()

//Emits
const emit = defineEmits<{
  (e: 'edit', id: number): void
  (e: 'bigImage', image: { imageUrl: string; description: string }): void
}>()
</script>
<template>
  <div
    class="relative flex w-full flex-col items-center gap-10 py-10 lg:flex-row lg:gap-0"
  >
    <!-- Description + Link -->
    <div class="flex w-1/2 justify-center text-lg">
      <a
        :href="link"
        :text="text"
        target="_blank"
        class="text-center font-bold hover:underline"
      ></a>
    </div>

    <!-- Image Carousel -->
    <div class="flex w-1/2 justify-center">
      <HomeAchievementCarousel
        :images="images"
        @big-image="
          (imageUrl) =>
            emit('bigImage', { imageUrl: imageUrl, description: text })
        "
      />
    </div>

    <!-- CMS - Achievement Editor Trigger Button -->
    <div v-if="loggedIn" class="absolute top-5 left-10">
      <UTooltip
        text="Edit Achievement"
        :delay-duration="0"
        :content="{ side: 'left' }"
        arrow
      >
        <UButton
          color="neutral"
          icon="mdi:text-box-edit-outline"
          size="xl"
          class="cursor-pointer active:scale-98"
          :ui="{ leadingIcon: 'text-xl' }"
          @click.stop="startEditingMode"
        />
      </UTooltip>
    </div>
  </div>
</template>
