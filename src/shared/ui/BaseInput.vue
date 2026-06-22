<script setup lang="ts">
defineProps<{
    label: string
    placeholder?: string
    type?: string
    readonly?: boolean
}>()

const model = defineModel<string>()
</script>

<template>
    <div class="flex flex-col gap-1">
        <label class="text-sm font-bold text-black">{{ label }}</label>
        <input
            v-model="model"
            :type="type ?? 'text'"
            :placeholder="placeholder"
            :readonly="readonly"
            class="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500 read-only:bg-gray-50 read-only:text-gray-400 read-only:cursor-default"
        />
    </div>
</template>