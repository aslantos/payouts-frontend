<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    class="bg-[#01978E] text-white font-bold py-1 w-full hover:bg-[#017d75] transition-colors"
  >
    <slot />
  </button>
</template>