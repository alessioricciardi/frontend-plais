<script setup lang="ts">
//Types
import type { HomeText } from '~/types'

//Variables
const loggedIn = useState('loggedIn')
const isEditing = ref<boolean>(false)
const text = ref<string>('')
const API_URL = useRuntimeConfig().public.API_URL

//Functions
const toggleIsEditing = (): void => {
  isEditing.value = !isEditing.value
}

const loadText = async (): Promise<void> => {
  try {
    const data = await $fetch<HomeText>(
      `${API_URL}/api/mainPageText/${props.id}`,
    )

    text.value = data.text
  } catch {
    useFetchError()
  }
}

const uploadText = async (): Promise<void> => {
  toggleIsEditing()

  try {
    await $fetch(`${API_URL}/api/mainPageText/${props.id}`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        text: text.value,
      },
    })

    useToast().add({
      icon: 'mdi:text-box-check-outline',
      title: 'Success',
      description: 'Text updated successfully.',
      color: 'success',
    })
  } catch {
    useFetchError()
  }
}

//Props
const props = defineProps<{
  id: number
}>()

//onMounted
onMounted(() => {
  loadText()
})
</script>

<template>
  <div>
    <div v-if="!loggedIn">
      {{ text }}
    </div>
    <div
      v-if="loggedIn && !isEditing"
      class="cursor-pointer hover:underline"
      @click.stop="toggleIsEditing"
    >
      {{ text }}
    </div>
    <div v-if="loggedIn && isEditing" class="flex w-full">
      <UTextarea
        v-model="text"
        autoresize
        spellcheck="false"
        color="neutral"
        class="flex-1"
        :ui="{ base: 'rounded-r-none' }"
      />

      <UButton
        icon="mdi:text-box-check-outline"
        class="cursor-pointer"
        color="neutral"
        :ui="{ leadingIcon: 'text-xl', base: 'rounded-l-none' }"
        @click.stop="uploadText"
      />
    </div>
  </div>
</template>
