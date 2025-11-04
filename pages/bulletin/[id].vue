<script setup lang="ts">
import ArticleEditor from '~/components/Bulletin/ArticleEditor.vue'
import type { Article } from '~/types'


const loggedIn = useState('loggedIn')

const API_URL = useRuntimeConfig().public.API_URL
const route = useRoute()
const router = useRouter()
const article = ref<Article | null>(null)
const loading = ref(true)
const articleToDelete = ref<number | null>(null)
const showDeleteModal = ref(false)
const articleEditorRef = ref<InstanceType<typeof ArticleEditor> | null>(null)
  const lastBulletinListPage = useState('lastBulletinListPage')



async function fetchArticle() {
  loading.value = true
  try {
    article.value = await $fetch<Article>(`${API_URL}/api/bulletin/${route.params.id}`)
  } catch (err) {
    // ... (Twoja obsługa błędów) ...
    const error = err as { status?: number; message?: string }
    if (error?.status === 404) {
      showError({
        statusCode: 404,
        statusMessage: 'Bulletin not found',
        message: `The bulletin with ID ${route.params.id} does not exist.`,
      })
    } else {
      showError({
        statusCode: error?.status ?? 500,
        statusMessage: 'Unexpected error',
        message: error?.message ?? 'Something went wrong while loading the bulletin.',
      })
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})

function refreshArticle(){
  fetchArticle()
}

function askToDelete(id: number) {
  articleToDelete.value = id
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (articleToDelete.value !== null) {
    articleEditorRef.value?.deleteArticleById(articleToDelete.value)
    articleToDelete.value = null
    showDeleteModal.value = false
  }

  router.push("/bulletin")
}

async function editArticle(_id: number) {
  if (article.value && articleEditorRef.value) {
    articleEditorRef.value.startEditing(article.value)
  }
}

function goBack() {
  
  const lastPage = lastBulletinListPage.value

  if (window.history.length > 1) {
   
    router.back()
  } else {
    

    router.push({
      path: '/bulletin',
      query: { page: String(lastPage) } // Użyj zapamiętanego numeru strony
    })
    

  }
}


</script>

<template>

  
  <div>
    <!-- Ładowanie -->
    <div v-if="loading" class="mt-20 text-center text-gray-500 text-xl">
      Loading article...
    </div>


      <UButton
    color="neutral"
    variant="soft"
    icon="mdi:arrow-left"
    class="flex w-full cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200/60 px-7 py-3 text-xl text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-blue-800 hover:from-20% hover:to-blue-500 hover:text-white active:scale-99 sm:w-auto"
    @click="goBack"
  >
    Back
  </UButton>
    <ClientOnly>
      <ArticleEditor
        v-if="loggedIn"
        ref="articleEditorRef"
        mode="edit"
        @submitted="refreshArticle"
       
      />
    </ClientOnly>
    <BulletinArticle
        v-if="article"
        :id="article.id"
        :key="article.id"
        :title="article.title"
        :date-created="article.dateCreated"
        :content="article.content"
        mode="full"
        class="article"
        @edit="editArticle(article.id)"
        @delete="askToDelete(article.id)"
         
      />

      <div
      v-if="showDeleteModal"
      class="color bg-opacity-50 fixed inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div class="w-full max-w-md rounded-lg bg-gray-50 p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-bold">Confirm delete</h2>
        <p class="mb-6">Are u sure u want to delete article?</p>
        <div class="flex justify-end gap-2">
          <button
            class="flex cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200/60 px-7 py-7 text-xl text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-blue-800 hover:from-20% hover:to-blue-500 hover:text-white active:scale-99"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>
          <button
            class="flex cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200/60 px-7 py-7 text-xl text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-red-800 hover:from-20% hover:to-red-500 hover:text-white active:scale-99"
            @click="confirmDelete"
          >
            Delete
            <UIcon name="mdi:book-remove" size="22" class="ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>

      
</template>
