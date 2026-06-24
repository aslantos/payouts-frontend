<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useTaskDetail } from '@/features/tasks/model/useTaskDetail'
import { useTaskSubmissions } from '@/features/tasks/model/useTaskSubmissions'
import { useAcceptTask } from '@/features/tasks/model/useAcceptTask'
import { useApproveTask } from '@/features/tasks/model/useApproveTask'
import { useSubmitWork } from '@/features/tasks/model/useSubmitWork'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { TaskStatus } from '@/shared/types/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// route.params.id — строка из URL, приводим к числу
const taskId = computed(() => Number(route.params.id))

const isContractor = computed(() => authStore.user?.role === 'CONTRACTOR')
const isCompany = computed(() => !isContractor.value)
const currentUserId = computed(() => authStore.user?.id)

const { data: task, isLoading, isError } = useTaskDetail(taskId)

// Submissions — только компании, только при нужных статусах
const showSubmissions = computed(
  () => isCompany.value && task.value != null &&
    ['SUBMITTED', 'REVIEW', 'APPROVED'].includes(task.value.status)
)
const { data: submissions } = useTaskSubmissions(taskId, showSubmissions)

// Мутации — те же хуки что в TasksPage, toasty уже внутри
const acceptTask = useAcceptTask()
const approveTask = useApproveTask()
const submitWork = useSubmitWork()

const showSubmitForm = ref(false)
const submitContent = ref('')
const submitAttachments = ref('')

function handleAccept() {
  if (!task.value) return
  acceptTask.mutate(task.value.id)
}

function handleApprove() {
  if (!task.value) return
  approveTask.mutate(task.value.id)
}

function handleSubmitWork() {
  if (!task.value || !submitContent.value.trim()) return
  const attachments = submitAttachments.value.trim() ? [submitAttachments.value.trim()] : []
  submitWork.mutate(
    { taskId: task.value.id, content: submitContent.value, attachments },
    {
      onSuccess: () => {
        showSubmitForm.value = false
        submitContent.value = ''
        submitAttachments.value = ''
      },
    },
  )
}

// Конфиг статусов (те же цвета что в TasksPage)
type StatusConfig = { label: string; cls: string }

const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  CREATED:     { label: 'Создана',     cls: 'bg-gray-100 text-gray-600' },
  ACCEPTED:    { label: 'Принята',     cls: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'В работе',    cls: 'bg-blue-100 text-blue-700' },
  SUBMITTED:   { label: 'На проверке', cls: 'bg-yellow-100 text-yellow-700' },
  REVIEW:      { label: 'Ревью',       cls: 'bg-orange-100 text-orange-700' },
  APPROVED:    { label: 'Одобрена',    cls: 'bg-green-100 text-green-700' },
  REJECTED:    { label: 'Отклонена',   cls: 'bg-red-100 text-red-700' },
  COMPLETED:   { label: 'Завершена',   cls: 'bg-green-100 text-green-600' },
}

function formatBudget(value: number | string): string {
  return Number(value).toLocaleString('ru-RU') + ' ₸'
}

function formatDate(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto flex flex-col gap-6">

    <!-- Кнопка назад -->
    <button
      @click="router.back()"
      class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M5 12l7 7M5 12l7-7" />
      </svg>
      Назад
    </button>

    <!-- Загрузка -->
    <div v-if="isLoading" class="flex justify-center py-16 text-gray-400">
      <svg class="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

    <!-- Ошибка -->
    <div v-else-if="isError" class="bg-red-50 text-red-600 rounded-xl p-6 text-sm text-center">
      Не удалось загрузить задачу.
    </div>

    <!-- Содержимое -->
    <template v-else-if="task">

      <!-- Основная карточка -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">

        <!-- Заголовок + статус -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3 flex-wrap">
            <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', STATUS_CONFIG[task.status]?.cls]">
              {{ STATUS_CONFIG[task.status]?.label ?? task.status }}
            </span>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 leading-tight">{{ task.title }}</h1>
        </div>

        <!-- Описание -->
        <div v-if="task.description" class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {{ task.description }}
        </div>

        <!-- Детали: бюджет, дедлайн, дата -->
        <div class="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Бюджет</p>
            <p class="font-semibold text-[#01978E] text-base">{{ formatBudget(task.budget) }}</p>
          </div>
          <div v-if="task.deadline">
            <p class="text-xs text-gray-400 mb-0.5">Дедлайн</p>
            <p class="text-gray-700">{{ formatDate(task.deadline) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Создана</p>
            <p class="text-gray-700">{{ formatDate(task.createdAt) }}</p>
          </div>
        </div>

        <!-- ПОДРЯДЧИК: Принять -->
        <div
          v-if="isContractor && task.status === 'CREATED' && (task.assignedToId === null || task.assignedToId === currentUserId)"
          class="border-t border-gray-100 pt-4"
        >
          <BaseButton
            :disabled="acceptTask.isPending.value"
            @click="handleAccept"
            class="w-full"
          >
            {{ acceptTask.isPending.value ? 'Принимаем...' : 'Принять задачу' }}
          </BaseButton>
        </div>

        <!-- ПОДРЯДЧИК: Сдать работу -->
        <div
          v-if="isContractor && (task.status === 'ACCEPTED' || task.status === 'IN_PROGRESS') && task.assignedToId === currentUserId"
          class="border-t border-gray-100 pt-4 flex flex-col gap-3"
        >
          <BaseButton
            v-if="!showSubmitForm"
            @click="showSubmitForm = true"
            class="w-full"
          >
            Сдать работу
          </BaseButton>

          <template v-else>
            <h3 class="text-sm font-semibold text-gray-700">Описание выполненной работы</h3>
            <textarea
              v-model="submitContent"
              placeholder="Опишите что было сделано..."
              rows="4"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent resize-none"
            />
            <input
              type="text"
              v-model="submitAttachments"
              placeholder="Ссылка на результат (необязательно)"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
            />
            <div class="flex gap-2">
              <BaseButton
                :disabled="submitWork.isPending.value || !submitContent.trim()"
                @click="handleSubmitWork"
                class="flex-1"
              >
                {{ submitWork.isPending.value ? 'Отправляем...' : 'Отправить на проверку' }}
              </BaseButton>
              <button
                type="button"
                @click="showSubmitForm = false"
                class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Отмена
              </button>
            </div>
          </template>
        </div>

        <!-- КОМПАНИЯ: Одобрить -->
        <div
          v-if="isCompany && (task.status === 'SUBMITTED' || task.status === 'REVIEW')"
          class="border-t border-gray-100 pt-4"
        >
          <BaseButton
            :disabled="approveTask.isPending.value"
            @click="handleApprove"
            class="w-full"
          >
            {{ approveTask.isPending.value ? 'Одобряем...' : 'Одобрить задачу' }}
          </BaseButton>
        </div>

      </div>

      <!-- Сданная работа (только для компании, только при нужных статусах) -->
      <div
        v-if="showSubmissions && submissions && submissions.length > 0"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4"
      >
        <h2 class="text-base font-semibold text-gray-700">Сданная работа</h2>
        <div
          v-for="submission in submissions"
          :key="submission.id"
          class="flex flex-col gap-3"
        >
          <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{{ submission.content }}</p>
          <div v-if="submission.attachments.length > 0" class="flex flex-col gap-1">
            <p class="text-xs text-gray-400">Вложения</p>
            <a
              v-for="url in submission.attachments"
              :key="url"
              :href="url"
              target="_blank"
              rel="noopener"
              class="text-sm text-[#01978E] underline underline-offset-2 hover:opacity-80 w-fit"
            >
              {{ url }}
            </a>
          </div>
        </div>
      </div>

    </template>

  </div>
</template>
