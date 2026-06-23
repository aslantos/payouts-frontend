<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useTemplates } from '@/features/contracts/model/useTemplates'
import { useCreateTemplate } from '@/features/contracts/model/useCreateTemplate'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const authStore = useAuthStore()
const isCompany = computed(() => authStore.user?.role !== 'CONTRACTOR')

const { data: templates, isLoading, isError } = useTemplates()
const createTemplate = useCreateTemplate()

const name = ref('')
const bodyTemplate = ref('')

function handleSubmit() {
  if (!name.value || !bodyTemplate.value) return
  createTemplate.mutate(
    { name: name.value, bodyTemplate: bodyTemplate.value },
    {
      onSuccess: () => {
        name.value = ''
        bodyTemplate.value = ''
      },
    },
  )
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto flex flex-col gap-6">

    <!-- Доступ закрыт для подрядчика -->
    <div
      v-if="!isCompany"
      class="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-8 text-center text-sm"
    >
      Шаблоны договоров доступны только для компаний.
    </div>

    <template v-else>
      <h1 class="text-2xl font-bold text-gray-800">Шаблоны договоров</h1>

      <!-- Форма создания нового шаблона -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
        <h2 class="text-lg font-semibold text-gray-800">Новый шаблон</h2>

        <BaseInput
          label="Название шаблона"
          placeholder="Стандартный ГПХ"
          v-model="name"
        />

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-gray-700">Текст шаблона</label>
          <textarea
            v-model="bodyTemplate"
            placeholder="Настоящий договор заключён между..."
            rows="7"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent resize-none"
          />
        </div>

        <p v-if="createTemplate.isError.value" class="text-sm text-red-500">
          Не удалось создать шаблон. Проверьте данные.
        </p>

        <BaseButton
          :disabled="createTemplate.isPending.value || !name || !bodyTemplate"
          @click="handleSubmit"
          class="self-start"
        >
          {{ createTemplate.isPending.value ? 'Создаём...' : 'Создать шаблон' }}
        </BaseButton>
      </div>

      <!-- Загрузка -->
      <div v-if="isLoading" class="flex justify-center py-10 text-gray-400">
        <svg class="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>

      <!-- Ошибка -->
      <div v-else-if="isError" class="bg-red-50 text-red-600 rounded-xl p-6 text-sm text-center">
        Не удалось загрузить шаблоны. Проверьте подключение к серверу.
      </div>

      <!-- Пусто -->
      <div
        v-else-if="!templates || templates.length === 0"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-400"
      >
        Шаблонов пока нет — создайте первый выше.
      </div>

      <!-- Список шаблонов -->
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="tpl in templates"
          :key="tpl.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-800">{{ tpl.name }}</h3>
            <span class="text-xs text-gray-400 shrink-0 ml-4">{{ formatDate(tpl.createdAt) }}</span>
          </div>
          <p class="text-sm text-gray-500 line-clamp-3 whitespace-pre-line">{{ tpl.bodyTemplate }}</p>
        </div>
      </div>
    </template>

  </div>
</template>
