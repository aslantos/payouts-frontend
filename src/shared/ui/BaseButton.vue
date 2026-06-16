<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit'
  disabled?: boolean
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled"
    class="bg-[#01978E] text-white font-bold py-1 w-full hover:bg-[#017d75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot />
  </button>
</template>