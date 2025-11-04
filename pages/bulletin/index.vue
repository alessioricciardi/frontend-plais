<script setup lang="ts">
import ArticleEditor from '~/components/Bulletin/ArticleEditor.vue'
import type { Article, ApiResponse } from '~/types'

//URl
const API_URL = useRuntimeConfig().public.API_URL

//REfy
const articleEditorRef = ref<InstanceType<typeof ArticleEditor> | null>(null)
const loggedIn = useState('loggedIn')
const currentPage = ref<number>(1)
const totalPages = ref<number>(1)
const pageSize = 10
const cachedPages = ref(new Map<number, Article[]>())
const currentArticles = ref<Article[]>([])
const loading = ref<boolean>(false)
const showDeleteModal = ref(false)
const articleToDelete = ref<number | null>(null)
const searchPhrase = ref<string>('')
const toast = useToast()
const lastBulletinListPage = useState('lastBulletinListPage', () => 1)
const route = useRoute()


//fetch articles
async function fetchPage(page: number, forceReload = false) {
  if (!forceReload && cachedPages.value.has(page)) {
    currentArticles.value = cachedPages.value.get(page)!
    return true
  }

  currentArticles.value = []
  await nextTick()
  loading.value = true

  try {
    const response = await $fetch<ApiResponse>(`${API_URL}/api/bulletin`, {
      query: {
        PageNumber: page,
        PageSize: pageSize,
        SearchPhrase: searchPhrase.value,
      },
    })

    cachedPages.value.set(page, response.items ?? [])
    currentArticles.value = response.items
    totalPages.value = response.totalPages

    return true
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to download articles',
      color: 'error',
    })
    return false
  } finally {
    loading.value = false
  }
}

//handlery
//Change page
async function goToPage(page: number) {
  if (page === currentPage.value || loading.value) return
  const success = await fetchPage(page, true)
  if (success) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
//Delete handler
function askToDelete(id: number) {
  articleToDelete.value = id
  showDeleteModal.value = true
}
//Delete confimration
async function confirmDelete() {
  if (articleToDelete.value !== null) {
    articleEditorRef.value?.deleteArticleById(articleToDelete.value)
    articleToDelete.value = null
    showDeleteModal.value = false
  }

  await fetchPage(currentPage.value, true)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
//clear cache memory
function clearCache() {
  cachedPages.value.clear()
}

async function handleSubmitted() {
  clearCache()
  currentPage.value = 1
  await new Promise(resolve => setTimeout(resolve, 300)) // krótki delay
  await fetchPage(1, true)
}

async function resetEditor() {
  clearCache()
  currentPage.value = 1
  await fetchPage(1, true)
}
//edited article id
async function editArticle(id: number) {
  const article = currentArticles.value.find((a) => a.id === id)
  if (article && articleEditorRef.value) {
    articleEditorRef.value.startEditing(article)
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function onSearch() {
  clearCache()
  currentPage.value = 1
  await fetchPage(1, true)
}



watch(searchPhrase, async (newVal) => {
 
  if (newVal.trim() === '') {
    clearCache()
    currentPage.value = 1
    await fetchPage(1, true)
  }
})

watch(
  () => route.query.page,
  (newPage) => {
    // Zapisz numer bieżącej strony za każdym razem, gdy się zmienia
    const pageNumber = newPage ? parseInt(newPage as string) : 1
    lastBulletinListPage.value = pageNumber
    
  },
  { immediate: true }
)

//First page load
onMounted(() => {
  fetchPage(currentPage.value, true)
})

function getSnippet(content: string | undefined, maxWords: number = 30): string {
  if (!content) return ''

  
  const plainText = content.replace(/<[^>]*>?/gm, ' ')
                          
    .replace(/\s+/g, ' ') 

  const words = plainText.trim().split(' ')
  
  if (words.length === 0) {
    return ''
  }

  if (words.length <= maxWords) {
    return plainText.trim()
  }

  return words.slice(0, maxWords).join(' ') + '...'
}
</script>

<template>
  <div>
    <div class="text-center text-5xl font-bold text-gray-900">
      Bulletin of PLAIS
    </div>

    <!-- Editor -->
    <ClientOnly>
      <ArticleEditor
        v-if="loggedIn"
        ref="articleEditorRef"
        mode="full"
        @submitted="handleSubmitted"
        @cancel="resetEditor"
      />
    </ClientOnly>
    <div class="mx-auto my-8 w-full max-w-3xl px-4">
  <div class="flex items-center gap-3">
    <UInput
      v-model="searchPhrase"
      icon="mdi:search"
      color="neutral"
      placeholder="Search for bulletin"
      class="my-10 flex-1"
      @keyup.enter="onSearch"
    />
    <UButton
      class="my-10 px-6 py-1.5 text-white font-semibold cursor-pointer hover:text-black hover:bg-white border-2 border-transparent hover:border-2 hover:border-black"
      @click="onSearch"
    >
      Search
    </UButton>
  </div>
</div>


    <!-- Loading -->
    <div v-if="loading" class="my-10 text-center text-xl">Loading...</div>

    <!-- Articles -->
    <div v-else class="space-y-10">
      <BulletinArticle
        v-for="article in currentArticles"
        :id="article.id"
        :key="article.id"
        :title="article.title"
        :snippet="getSnippet(article.content)"
        :date-created="article.dateCreated"
        mode="list"
        class="article"
        @edit="editArticle(article.id)"
        @delete="askToDelete(article.id)"
      />
    </div>
    <!-- Pagination -->
    <div class="my-8 flex flex-wrap items-center justify-center gap-4">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="[
          'rounded px-4 py-2 inset-shadow-sm transition-colors duration-200',
          page === currentPage
            ? 'bg-blue-700 text-white'
            : 'bg-white text-black',
          loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ]"
        :disabled="loading"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </div>
    <!--Delete modal-->
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

<style scoped>
input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.output-group {
  margin-top: 2rem;
}

code {
  background-color: #f3f3f3;
  padding: 0.5rem;
  display: block;
  white-space: pre-wrap;
}
</style>
