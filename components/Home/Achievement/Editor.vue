<script setup lang="ts">
//Types
import type { Achievement, PhotoUploadResponse } from '~/types'

//Variables
const API_URL = useRuntimeConfig().public.API_URL
const toast = useToast()
const newAchievement: Achievement = reactive({
  text: '',
  link: '',
  images: [],
})
const isDragged = ref<boolean>(false)
const showModalDelete = ref<boolean>(false)

//Props
const props = defineProps<{
  open: boolean
  id: number | null
}>()

//Functions

//put achievement
const uploadAchievement = async (): Promise<void> => {
  const mappedImages: string[] = newAchievement.images.map(
    (i) => i.photoFileName,
  )

  //Add new Achievement
  if (props.id === -1) {
    try {
      await $fetch(`${API_URL}/api/achievements`, {
        method: 'POST',
        body: {
          ...newAchievement,
          images: mappedImages,
        },
        credentials: 'include',
      })

      toast.add({
        icon: 'mdi:trophy',
        title: 'Success',
        description: 'Achievement added successfully.',
        color: 'success',
      })
    } catch {
      useFetchError()
      useDeleteUnusedPhotos()
    }
  } else {
    //Edit existing Achievement
    try {
      await $fetch(`${API_URL}/api/achievements/${props.id}`, {
        method: 'PUT',
        body: {
          ...newAchievement,
          images: mappedImages,
        },
        credentials: 'include',
      })

      toast.add({
        icon: 'mdi:trophy',
        title: 'Success',
        description: 'Achievement updated successfully.',
        color: 'success',
      })
    } catch {
      useFetchError()
      useDeleteUnusedPhotos()
    }
  }

  emit('refresh')
  emit('close')
}

//delete achievemenet
const deleteAchievement = async (): Promise<void> => {
  try {
    await $fetch(`${API_URL}/api/achievements/${props.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    toast.add({
      icon: 'mdi:trophy',
      title: 'Success',
      description: 'Achievement deleted successfully.',
      color: 'success',
    })
  } catch {
    useFetchError()
    useDeleteUnusedPhotos()
  }

  emit('refresh')
  emit('close')
}

//get achievement
const loadAchievement = async (): Promise<void> => {
  if (props.id === -1) {
    Object.assign(newAchievement, {
      text: '',
      link: '',
      images: [],
    })
    return
  }

  const data = await $fetch<Achievement>(
    `${API_URL}/api/achievements/${props.id}`,
  )

  Object.assign(newAchievement, data)
}

//post photo
const uploadPhoto = async (e: DragEvent): Promise<void> => {
  e.preventDefault()

  //Check if user uploaded a file
  if (
    !e.dataTransfer ||
    !e.dataTransfer.files ||
    e.dataTransfer.files.length === 0
  )
    return

  const file = e.dataTransfer.files[0]

  //Check if a file is an image
  if (!file.type.startsWith('image/')) {
    toast.add({
      icon: 'mdi:file-image-remove',
      title: 'Error',
      description: 'Invalid photo file type.',
      color: 'error',
    })
    isDragged.value = false
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    //Upload a photo
    const uploadResponse = await $fetch<PhotoUploadResponse>(
      `${API_URL}/api/Image/achievement`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      },
    )

    //Add uploaded photo file name to achievement photo name array
    newAchievement.images.push({
      id: Date.now(),
      photoFileName: uploadResponse.fileName,
      achievementId: -1,
    })
  } catch {
    useFetchError()
    useDeleteUnusedPhotos()
  }

  isDragged.value = false
}

//delete photo
const deletePhoto = (id: number): void => {
  newAchievement.images = newAchievement.images.filter((i) => i.id !== id)
}

//toggle modal delete
const toggleModalDelete = (): void => {
  showModalDelete.value = !showModalDelete.value
}

//toggle drag blur class
const toggleDrag = (): void => {
  isDragged.value = !isDragged.value
}

//Emits
const emit = defineEmits<{
  (e: 'refresh' | 'close'): void
}>()

//Watches
watch(
  () => props.open,
  () => loadAchievement(),
)
</script>

<template>
  <UModal
    title="Achievement Editor"
    description="Edit the necessary fields and press 'Confirm Changes' to save the changes. If you want to exit without saving, click 'Cancel changes'."
    :ui="{
      header:
        'bg-gradient-to-r from-blue-800 from-15% to-blue-500 rounded-t-lg',
      title: 'text-white border-b-2 border-white p-1 justify-center flex',
      description: 'text-white mb-1',
    }"
    :open="props.open"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-5">
        <!-- Achievement description -->
        <UFormField
          label="Description"
          size="lg"
          :ui="{
            label: 'text-blue-600 font-semibold',
          }"
        >
          <UInput
            v-model="newAchievement.text"
            color="neutral"
            spellcheck="false"
            highlight
            icon="mdi:trophy"
            size="lg"
            class="w-full text-lg"
          />
        </UFormField>

        <!-- Achievement Link -->
        <UFormField
          label="Link"
          size="lg"
          :ui="{
            label: 'text-blue-600 font-semibold',
          }"
        >
          <UInput
            v-model="newAchievement.link"
            color="neutral"
            spellcheck="false"
            highlight
            icon="mdi:link-variant"
            size="lg"
            class="w-full text-lg"
          />
        </UFormField>

        <!-- Photo Section Separator -->
        <USeparator
          label="Photo Editor"
          size="xs"
          class="mt-5"
          :ui="{
            border: 'border-gray-900',
          }"
        />

        <!-- Photos -->
        <div
          class="relative w-full"
          @dragenter="toggleDrag()"
          @dragleave="toggleDrag()"
          @drop="uploadPhoto"
          @dragover="(e: DragEvent) => e.preventDefault()"
        >
          <!-- Add Photo Icon - when user drags a photo -->
          <div v-show="isDragged">
            <UIcon
              class="absolute top-1/2 left-1/2 z-100 -translate-x-1/2 -translate-y-1/2 transform text-3xl sm:text-5xl"
              name="mdi:image-plus-outline"
            />
          </div>

          <!-- Photo Upload Instruction -->
          <div class="mb-5 text-center text-sm text-gray-900">
            Drag a photo in order to upload
          </div>

          <!-- Photo List -->
          <div class="grid grid-cols-2 gap-2" :class="{ 'blur-xs': isDragged }">
            <div
              v-for="image in newAchievement.images"
              :key="image.id"
              class="relative"
            >
              <img
                :src="`${API_URL}/uploads/achievements/${image.photoFileName}`"
                class="aspect-square w-full rounded-lg object-fill"
              />
              <div class="absolute top-0 right-0">
                <!-- Delete Photo Button -->
                <UButton
                  size="lg"
                  icon="mdi:image-remove-outline"
                  color="neutral"
                  class="absolute top-1 right-1 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 active:scale-98"
                  :ui="{ leadingIcon: 'text-lg text-white' }"
                  @click.stop="deletePhoto(image.id)"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Delete Achievement -->
        <div v-if="id && id !== -1" class="flex w-full justify-center">
          <UButton
            label="Delete Achievement"
            class="w-2/3 cursor-pointer justify-center bg-red-700 hover:bg-red-800 active:scale-99"
            @click.stop="toggleModalDelete"
          />
        </div>
        <!-- Confirm cadence delete -->
        <ModalConfirm
          :open="showModalDelete"
          @close="toggleModalDelete"
          @confirm="deleteAchievement"
        />
      </div>
    </template>
    <!-- Confirm / Cancel changes -->
    <template #footer>
      <div class="flex w-full justify-between">
        <UButton
          class="flex cursor-pointer bg-red-700 hover:bg-red-700/80 active:scale-99"
          @click.stop="emit('close')"
          >Cancel changes</UButton
        >
        <UButton
          class="flex cursor-pointer bg-blue-700 hover:bg-blue-700/80 active:scale-99"
          @click.stop="uploadAchievement"
          >Confirm changes</UButton
        >
      </div>
    </template>
  </UModal>
</template>
