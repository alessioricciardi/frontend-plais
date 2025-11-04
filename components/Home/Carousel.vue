<script setup lang="ts">
//Types
import type { CarouselPhoto, PhotoUploadResponse } from '~/types'

//Variables
const loggedIn = useState('loggedIn')
const API_URL = useRuntimeConfig().public.API_URL
const isDragged = ref<boolean>(false)
const photos = ref<CarouselPhoto[] | null>(null)
const itemClass = ref<string>('')
const showModalDelete = ref<boolean>(false)
const selectedPhoto = ref<number>(-1)
const toast = useToast()

//Functions

//toggle modal delete
const toggleModalDelete = (): void => {
  showModalDelete.value = !showModalDelete.value
}

//get photos
const loadPhotos = async (): Promise<void> => {
  try {
    photos.value = await $fetch(`${API_URL}/api/mainPageCarouselImages`)

    //Properly display photos
    if (!photos.value) return

    if (photos.value.length === 1) {
      itemClass.value = 'basis-1/1'
      return
    }
    if (photos.value.length === 2) {
      itemClass.value = 'basis-1/2'
      return
    }

    itemClass.value = 'lg:basis-1/3 basis-1/2'
  } catch {
    useFetchError()
  }
}

//post photo
const uploadPhoto = async (e: DragEvent): Promise<void> => {
  if (!loggedIn.value) return

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
      `${API_URL}/api/Image/carousel`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      },
    )

    //Add uploaded photo file name to carousel photo array
    await $fetch(`${API_URL}/api/mainPageCarouselImages`, {
      method: 'POST',
      body: {
        photoFileName: uploadResponse.fileName,
      },
      credentials: 'include',
    })

    toast.add({
      icon: 'mdi:file-image-plus',
      title: 'Success',
      description: 'Successfully added a photo.',
      color: 'success',
    })
  } catch {
    useFetchError()
    useDeleteUnusedPhotos()
  }

  loadPhotos()
  isDragged.value = false
}

//delete photo
const deletePhoto = async (): Promise<void> => {
  if (selectedPhoto.value < 0) {
    useFetchError()
    loadPhotos()
    return
  }

  try {
    await $fetch(
      `${API_URL}/api/mainPageCarouselImages/${selectedPhoto.value}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    )

    toast.add({
      icon: 'mdi:file-image-remove',
      title: 'Success',
      description: 'Successfully deleted a photo.',
      color: 'success',
    })
  } catch {
    useFetchError()
  }

  useDeleteUnusedPhotos()
  loadPhotos()
}

//toggle drag blur class
const toggleDrag = (): void => {
  if (!loggedIn.value) return

  isDragged.value = !isDragged.value
}

onMounted(() => {
  loadPhotos()
})
</script>
<template>
  <div
    class="relative"
    @dragenter="toggleDrag()"
    @dragleave="toggleDrag()"
    @drop="uploadPhoto"
    @dragover="(e: DragEvent) => e.preventDefault()"
  >
    <div v-show="isDragged">
      <UIcon
        class="absolute top-1/2 left-1/2 z-100 -translate-x-1/2 -translate-y-1/2 transform text-3xl sm:text-5xl"
        name="mdi:image-plus-outline"
      />
    </div>

    <div v-if="loggedIn" class="mb-2 flex justify-center">
      Drag a photo in order to add new one
    </div>

    <UCarousel
      v-if="photos"
      v-slot="{ item }"
      :items="photos"
      :class="{ 'blur-xs': isDragged }"
      loop
      :dots="photos && photos.length > 3"
      :auto-scroll="{
        speed: 0.8,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
        startDelay: 0,
      }"
      :ui="{
        item: itemClass,
        dot: 'cursor-default',
      }"
    >
      <div class="relative">
        <img
          :src="`${API_URL}/uploads/carouselImages/${item.photoFileName}`"
          class="aspect-3/2 h-full max-h-150 w-full rounded-lg object-cover"
        />
        <UTooltip
          text="Delete photo"
          :delay-duration="0"
          :content="{ side: 'left' }"
        >
          <UButton
            v-if="loggedIn"
            size="xl"
            icon="mdi:image-remove-outline"
            color="neutral"
            class="absolute top-1 right-1 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 active:scale-98"
            :ui="{ leadingIcon: 'text-2xl text-white' }"
            @click.stop="(toggleModalDelete(), (selectedPhoto = item.id))"
          />
        </UTooltip>
      </div>
    </UCarousel>

    <!-- Confirm Photo Delete -->
    <ModalConfirm
      :open="showModalDelete"
      @close="toggleModalDelete"
      @confirm="deletePhoto"
    />
  </div>
</template>
