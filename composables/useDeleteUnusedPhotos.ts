const API_URL = useRuntimeConfig().public.API_URL

export const useDeleteUnusedPhotos = async (): Promise<void> => {
  await $fetch(`${API_URL}/api/Image/unused-images`, {
    method: 'DELETE',
    credentials: 'include',
  })
}
