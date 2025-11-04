<template>
  <div v-if="mode === 'full'">
    <div class="m-10 flex items-center justify-center">
      <div
        class="flex h-24 w-1/2 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-gray-200/60 text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-blue-800 hover:from-20% hover:to-blue-500 hover:text-white active:scale-99"
        @click="toggleEditor"
      >
        {{
          showEditor
            ? 'Hide editor'
            : isEditing
              ? 'Edit article'
              : 'Add article'
        }}
        <UIcon
          :name="
            showEditor
              ? 'mdi:eye-off'
              : isEditing
                ? 'mdi:book-edit'
                : 'mdi:book-open-page-variant'
          "
          size="22"
          class="ml-1"
        />
      </div>
    </div>
    <div
      v-show="showEditor"
      class="editor-container mx-auto mb-6 w-[96%] rounded border p-4 shadow"
    >
      <input
        v-model="title"
        placeholder="Tytuł bloga"
        class="mb-4 w-full rounded border px-2 py-1"
      >
      <!--Edytor-->
      <TiptapEditor ref="editorRef" v-model="content" :show-image="true" />
      <div
        class="mt-4 flex flex-col items-stretch justify-between gap-4 sm:flex-row"
      >
        <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            class="flex w-full cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200/60 px-7 py-7 text-xl text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-red-800 hover:from-20% hover:to-red-500 hover:text-white active:scale-99 sm:w-auto"
            @click="cancelEdit"
          >
            Cancel
          </button>
          <button
            class="flex w-full cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200/60 px-7 py-7 text-xl text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-blue-800 hover:from-20% hover:to-blue-500 hover:text-white active:scale-99 sm:w-auto"
            @click="saveArticle"
          >
            {{ isEditing ? 'Save changes' : 'Send article' }}
            <UIcon name="mdi:book-plus" h-12 class="ml-1" />
          </button>
        </div>
        <div v-if="isEditing" class="mt-3 w-full sm:mt-0 sm:w-auto">
          <button
            class="flex w-full cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200/60 px-7 py-7 text-xl text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-red-800 hover:from-20% hover:to-red-500 hover:text-white active:scale-99 sm:w-auto"
            @click="deleteArticleById(editingId!)"
          >
            Delete article
            <UIcon name="mdi:book-remove" size="22" class="ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="mode === 'edit'">
    <div
      v-show="showEditor"
      class="editor-container mx-auto mb-6 w-[95%] rounded border p-4 shadow"
    >
      <input
        v-model="title"
        placeholder="Tytuł bloga"
        class="mb-4 w-full rounded border px-2 py-1"
      >
      <!--Edytor-->
      <TiptapEditor ref="editorRef" v-model="content" :show-image="true" />
      <div
        class="mt-4 flex flex-col items-stretch justify-between gap-4 sm:flex-row"
      >
        <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            class="flex w-full cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200/60 px-7 py-7 text-xl text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-red-800 hover:from-20% hover:to-red-500 hover:text-white active:scale-99 sm:w-auto"
            @click="cancelEdit"
          >
            Cancel
          </button>
          <button
            class="flex w-full cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200/60 px-7 py-7 text-xl text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-blue-800 hover:from-20% hover:to-blue-500 hover:text-white active:scale-99 sm:w-auto"
            @click="saveArticle"
          >
            {{ isEditing ? 'Save changes' : 'Send article' }}
            <UIcon name="mdi:book-plus" h-12 class="ml-1" />
          </button>
        </div>
        <div v-if="isEditing" class="mt-3 w-full sm:mt-0 sm:w-auto">
          <button
            class="flex w-full cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200/60 px-7 py-7 text-xl text-gray-900 shadow-xl transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-red-800 hover:from-20% hover:to-red-500 hover:text-white active:scale-99 sm:w-auto"
            @click="deleteArticleById(editingId!)"
          >
            Delete article
            <UIcon name="mdi:book-remove" size="22" class="ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EditorData, Article } from '~/types'
//props
const props = defineProps<{
  article?: Article
  mode?: 'full' | 'edit'
}>()
//emits
const emit = defineEmits<{
  (event: 'submitted'): void
  (event: 'cancel'): void
}>()

//refs
const title = ref<string>('')
const showEditor = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const editingId = ref<number | null>()
const API_URL = useRuntimeConfig().public.API_URL
const toast = useToast()
const content = ref<EditorData>({
  html: '',
  images: [],
})
const editorRef = ref()
//log state
const loggedIn = useState('loggedIn')

//watches
watch(
  () => props.article,
  (newArticle) => {
    if (newArticle) {
      title.value = newArticle.title
      content.value = {
        html: newArticle.content,
        images: [...(newArticle.content || [])],
      }
      editingId.value = newArticle.id
      isEditing.value = true
      showEditor.value = true
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

//toggle editor
function toggleEditor() {
  showEditor.value = !showEditor.value
  if (!showEditor.value) resetForm()
}
//save article
async function saveArticle() {
  if (!loggedIn) {
    alert('You must be logged in to save article.')
    return
  }

  if (!title.value.trim()) {
    toast.add({
      icon: 'mdi:book-sync',
      title: 'Warning',
      description: 'A title is required to save the article.',
      color: 'error',
    })
    return
  }
  //send content
  const payload = {
    title: title.value,
    content: content.value.html,
    photoFileNames: [...(content.value.images || [])],
  }

  try {
    if (isEditing.value && editingId.value !== null) {
      //update article
      await $fetch(`${API_URL}/api/bulletin/${editingId.value}`, {
        method: 'PUT',
        body: payload,
        credentials: 'include',
      })

      toast.add({
        icon: 'mdi:book-check',
        title: 'Success',
        description: 'Article edited successfully.',
        color: 'success',
      })
    } else {
      //post article
       await $fetch<Article>(`${API_URL}/api/bulletin`, {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })
      toast.add({
        icon: 'mdi:book-check',
        title: 'Success',
        description: 'Article created successfully.',
        color: 'success',
      })
    }

   emit('submitted' )
    resetForm()
    showEditor.value = false
  } catch {
    useFetchError()
  }
}

//editing function
function startEditing(article: Article) {
  title.value = article.title
  content.value = {
    html:
      typeof article.content === 'string' ? article.content : article.content,
    images: [...(article.photos ?? [])],
  }
  editingId.value = article.id
  isEditing.value = true
  showEditor.value = true
}
//exposed functions
defineExpose({
  startEditing,
  deleteArticleById,
})
//delete article
async function deleteArticleById(id: number) {
  try {
    await $fetch(`${API_URL}/api/bulletin/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    toast.add({
      icon: 'mdi:book-cancel',
      title: 'Success',
      description: 'Article deleted successfully.',
      color: 'success',
    })

    if (editingId.value === id || editingId.value === null) resetForm()
    showEditor.value = false
    emit('submitted')
  } catch {
    useFetchError()
  }
}
//cancel edit
function cancelEdit() {
  emit('cancel')
  resetForm()
  showEditor.value = false
}
//reset editor value
function resetForm() {
  title.value = ''
  content.value = { html: '', images: [] }
  editingId.value = null
  isEditing.value = false
}


</script>
