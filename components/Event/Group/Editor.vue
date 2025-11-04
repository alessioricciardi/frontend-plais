<script setup lang="ts">
// Types
import type { EventGroup, PhotoUploadResponse } from '~/types'

// Props
const props = defineProps<{
  id: number
  open: boolean
}>()

// Emit
const emit = defineEmits<{
  (e: 'close' | 'update'): void
}>()

// Variables
const API_URL = useRuntimeConfig().public.API_URL
const toast = useToast()
const showModalDelete = ref<boolean>(false)
const group = reactive<EventGroup>({
  id: -1,
  title: '',
  events: [],
  photoFileName: '',
})

// Lifecycle
watch(
  () => props.open,
  (open) => {
    if (open && props.id > 0) reloadEditor()
  },
)

const reloadEditor = async () => {
  try {
    const data = await $fetch<EventGroup>(
      `${API_URL}/api/eventGroups/${props.id}`,
    )
    Object.assign(group, data)
  } catch {
    useFetchError()
  }
}

// Handlers
const updateGroup = async () => {
  try {
    await $fetch(`${API_URL}/api/eventGroups/${group.id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    toast.add({
      icon: 'mdi:calendar-check',
      title: 'Success',
      description: 'Event group updated successfully.',
      color: 'success',
    })
    emit('close')
    emit('update')
  } catch {
    useFetchError()
  }
  emit('close')
}

const deleteGroup = async () => {
  try {
    await $fetch(`${API_URL}/api/eventGroups/${group.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    toast.add({
      icon: 'mdi:file-image-remove',
      title: 'Deleted',
      description: 'Event group deleted successfully.',
      color: 'success',
    })

    // Reset before emit
    group.id = -1
    group.title = ''
    group.photoFileName = ''
    group.events = []
    showModalDelete.value = false

    emit('close')
    emit('update')
  } catch {
    useFetchError()
    emit('close')
  }
}

const toggleModalDelete = (): void => {
  showModalDelete.value = !showModalDelete.value
}

//Photo upload

const uploadedPhotosNames = ref<string[]>([])
const photoInput = ref<File | null>(null)
const handlePhotoUpload = (event: Event): void => {
  const input = event.target as HTMLInputElement
  photoInput.value =
    input.files && input.files.length > 0 ? input.files[0] : null
}
const uploadPhoto = async (): Promise<void> => {
  if (!photoInput.value) {
    toast.add({
      icon: 'mdi:file-image-remove',
      title: 'Error',
      description: 'Please select a photo before uploading.',
      color: 'error',
    })
    return
  }
  const formData = new FormData()
  formData.append('file', photoInput.value)

  try {
    const response: PhotoUploadResponse = await $fetch(
      `${API_URL}/api/Image/eventGroup`,
      { method: 'POST', body: formData, credentials: 'include' },
    )

    toast.add({
      icon: 'mdi:file-image-plus',
      title: 'Success',
      description: 'Successfully added a photo',
      color: 'success',
    })

    group.photoFileName = response.fileName
    uploadedPhotosNames.value.push(response.fileName)
  } catch {
    useFetchError()
  }
}

// Photo delete

const deleteUploadedPhotos = async (): Promise<void> => {
  if (uploadedPhotosNames.value.length === 0) return
  for (const fileName of uploadedPhotosNames.value) {
    await $fetch(`${API_URL}/api/Image/eventGroup`, {
      method: 'DELETE',
      body: { fileName },
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
  }
}

const closeModal = (): void => {
  deleteUploadedPhotos()
  emit('close')
}
</script>

<template>
  <UModal
    title="Event Group Editor"
    :open="props.open"
    :close="false"
    description="Edit the necessary fields and press 'Confirm Changes' to save the changes. If you want to exit without saving, click 'Cancel changes'."
    :ui="{
      header:
        'bg-gradient-to-r from-blue-800 from-15% to-blue-500 rounded-t-lg',
      title: 'text-white border-b-2 border-white p-1 justify-center flex',
      description: 'text-white mb-1',
    }"
  >
    <template #body>
      <div class="flex flex-col gap-5">
        <UFormField
          label="Title of group"
          :ui="{ label: 'text-blue-700 font-semibold' }"
        >
          <UInput
            v-model="group.title"
            color="neutral"
            highlight
            class="w-full"
            icon="i-mdi-format-title"
          />
        </UFormField>

        <!-- Photo -->
        <UFormField
          label="Add new photo"
          help="Please select the photo first, and then upload it."
          :ui="{ label: 'text-blue-700 font-semibold', help: 'text-gray-700' }"
        >
          <div class="flex w-full items-center">
            <UInput
              ref="photoInput"
              type="file"
              accept="image/*"
              color="neutral"
              highlight
              icon="i-mdi-image"
              class="w-full text-lg"
              @change="handlePhotoUpload"
            />
            <UButton
              type="submit"
              color="neutral"
              icon="i-material-symbols-upload-rounded"
              class="ml-2 cursor-pointer bg-blue-700 text-xl hover:bg-blue-700/80 active:bg-blue-800"
              @click.stop="uploadPhoto"
            />
          </div>
        </UFormField>

        <div class="mt-5 flex w-full justify-center">
          <UButton
            v-if="props.id"
            class="w-2/3 cursor-pointer justify-center bg-red-700 hover:bg-red-800 active:scale-99"
            label="Delete group"
            @click.stop="toggleModalDelete"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-between">
        <UButton
          class="flex cursor-pointer bg-red-700 hover:bg-red-700/80 active:scale-99"
          @click="closeModal"
          >Cancel changes</UButton
        >
        <UButton
          class="flex cursor-pointer bg-blue-700 hover:bg-blue-700/80 active:scale-99"
          @click="updateGroup"
          >Confirm changes</UButton
        >
      </div>
    </template>
  </UModal>
  <!-- Modal for Delete Confirm -->
  <ModalConfirm
    :open="showModalDelete"
    @close="toggleModalDelete"
    @confirm="deleteGroup"
  />
</template>
