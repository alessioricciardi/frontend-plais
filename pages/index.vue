<script setup lang="ts">
//Types
import type { Achievement } from '~/types'

//Variables
const API_URL = useRuntimeConfig().public.API_URL
const loggedIn = useState('loggedIn')
const achievements = ref<Achievement[] | null>(null)
const selectedAchievement = ref<number | null>(null)
const selectedBigImageDescription = ref<string>('')
const selectedBigImageUrl = ref<string>('')
const showModalEdit = ref<boolean>(false)
const showModalBigImage = ref<boolean>(false)

//Functions

//toggle modal for achievement edit
const toggleModalEdit = (): void => {
  showModalEdit.value = !showModalEdit.value
}

//toggle modal for achievement picture
const toggleModalBigImage = (): void => {
  showModalBigImage.value = !showModalBigImage.value
}

//toggle modal for achievement editor
const startEditingMode = (id: number): void => {
  selectedAchievement.value = id

  if (!selectedAchievement.value) return

  toggleModalEdit()
}

//load achievements
const loadAchievements = async (): Promise<void> => {
  try {
    achievements.value = await $fetch(`${API_URL}/api/achievements`)
  } catch {
    useFetchError()
  }
}

//load big image
const loadBigImage = (payload: {
  imageUrl: string
  description: string
}): void => {
  if (!payload.imageUrl) return

  selectedBigImageDescription.value = payload.description
  selectedBigImageUrl.value = `${API_URL}/uploads/achievements/${payload.imageUrl}`
  toggleModalBigImage()
}

//onMounted
onMounted(() => {
  loadAchievements()
})
</script>

<template>
  <div>
    <div
      class="mt-20 mb-20 px-0 text-center text-2xl font-bold text-gray-900 sm:text-3xl md:px-30 md:text-4xl lg:px-50 lg:text-5xl"
    >
      The Polish Chapter of Association for Information Systems
    </div>

    <HomeCarousel class="mt-20 mb-20" />

    <!-- Plais description -->

    <div
      class="flex flex-col gap-5 bg-gradient-to-r from-blue-700 from-40% to-blue-500 px-5 py-10 text-white shadow-2xl md:flex-row md:gap-0 md:text-lg lg:px-15 xl:mx-30 xl:rounded-4xl"
    >
      <div
        class="flex w-full items-center justify-center md:w-1/3 md:justify-start"
      >
        <img src="/img/logo-transparent.png" class="size-40 md:size-50" />
      </div>
      <HomeTextEdit
        :id="1"
        :text="`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently`"
        class="w-full text-justify md:w-2/3"
      />
    </div>

    <!-- Latest Events and Bulletin -->
    <div>
      <div class="mt-20 mb-15 w-full text-center text-4xl font-bold">
        Latest Announcements
      </div>
      <HomeNews />
    </div>

    <!-- Wrycza Memorial -->
    <div class="mt-20 w-full text-center text-4xl font-bold">
      In Memory of Prof. Stanisław Wrycza
    </div>
    <div
      class="flex flex-col gap-5 px-5 py-10 md:flex-row md:gap-0 md:text-lg lg:px-15 xl:px-30"
    >
      <HomeTextEdit
        :id="2"
        :text="`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently`"
        class="order-2 w-full text-justify md:order-1 md:w-2/3"
      />
      <div
        class="order-1 flex w-full items-center justify-center md:order-2 md:w-1/3 md:justify-end"
      >
        <img src="/img/wrycza.jpg" class="size-65 rounded-xl object-cover" />
      </div>
    </div>

    <!-- Achievements -->

    <!-- Header -->
    <div
      class="mt-20 mb-10 flex justify-center gap-2 text-center text-4xl font-bold text-gray-900"
    >
      <div>Achievements</div>
      <UIcon name="mdi:trophy-outline" />
    </div>

    <!-- Add new Achievement -->
    <div v-if="loggedIn" class="mb-5 flex w-full justify-center">
      <div
        class="flex h-24 w-1/2 cursor-pointer flex-row items-center justify-center rounded-lg border border-gray-200 bg-gray-200/60 text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-blue-800 hover:from-20% hover:to-blue-500 hover:text-white active:scale-99"
        @click.stop="startEditingMode(-1)"
      >
        Add new Achievement
        <UIcon name="mdi:trophy-outline" size="22" class="ml-1" />
      </div>
    </div>

    <!-- Content -->
    <template v-if="achievements && achievements?.length > 0">
      <div
        v-for="(achievement, index) in achievements"
        :key="achievement.id"
        :class="index % 2 === 1 ? '' : 'bg-gray-100'"
      >
        <HomeAchievement
          v-bind="achievement"
          @edit="startEditingMode"
          @big-image="loadBigImage"
        />
      </div>
    </template>

    <!-- Achievement Big Picture -->
    <HomeAchievementBigImage
      :open="showModalBigImage"
      :image-url="selectedBigImageUrl"
      :description="selectedBigImageDescription"
      @close="toggleModalBigImage"
    />

    <!-- Achievement Editor -->
    <HomeAchievementEditor
      :id="selectedAchievement"
      :open="showModalEdit"
      @close="toggleModalEdit"
      @refresh="loadAchievements"
    />
  </div>
</template>
