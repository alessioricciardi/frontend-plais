<script setup lang="ts">
const route = useRoute()
const toaster = { expand: false }
</script>

<template>
  <UApp :toaster="toaster">
    <div class="flex min-h-screen flex-col">
      <Navbar v-if="route.path !== '/login'" />

      <div class="flex-1">
        <div
          v-if="route.path !== '/resources' && route.path !== '/login'"
          class="mt-20"
        >
          <slot />
        </div>
        <div v-else>
          <slot />
        </div>
      </div>

      <SiteFooter
        v-if="route.path !== '/login'"
        :class="{ 'mt-20': route.path !== '/resources' }"
      />
    </div>
  </UApp>
</template>
