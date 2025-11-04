<script setup lang="ts">
//Props
defineProps<{
  open: boolean
  imageUrl: string
  description: string
}>()

//Emits
const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <UModal
    :open="open"
    :close="false"
    @update:open="
      (value) => {
        if (!value) emit('close')
      }
    "
    class="h-[92vw] min-w-[92vw] rounded-2xl"
    :ui="{
      header:
        'bg-gradient-to-r from-blue-800 from-15% to-blue-500 rounded-t-lg',
    }"
  >
    <template #header>
      <div class="flex w-full items-center justify-between py-1 text-white">
        <!-- Empty div for adjustment -->
        <div class="w-8"></div>

        <!-- Description -->
        <div
          class="flex-1 text-center text-2xl font-bold break-words whitespace-normal"
        >
          {{ description }}
        </div>

        <!-- Close Button -->
        <UButton
          icon="mdi:close"
          variant="ghost"
          color="neutral"
          class="cursor-pointer rounded-full text-2xl text-white hover:text-black"
          @click.stop="emit('close')"
        />
      </div>
    </template>
    <template #body>
      <div class="flex h-full w-full items-center justify-center">
        <img
          :src="imageUrl"
          class="max-h-full max-w-full rounded-md object-contain shadow-2xl"
        />
      </div>
    </template>
  </UModal>
</template>
