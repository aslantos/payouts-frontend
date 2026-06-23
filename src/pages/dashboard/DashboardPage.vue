<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useTasks } from '@/features/tasks/model/useTasks'
import { useContracts } from '@/features/contracts/model/useContracts'
import type { TaskStatus, ContractStatus } from '@/shared/types/api'

const authStore = useAuthStore()
const isContractor = computed(() => authStore.user?.role === 'CONTRACTOR')
const currentUserId = computed(() => authStore.user?.id)

const { data: tasks, isLoading: tasksLoading } = useTasks()
const { data: contracts, isLoading: contractsLoading } = useContracts()

const isLoading = computed(() => tasksLoading.value || contractsLoading.value)

// ── Статистика для компании ──────────────────────────────────────────────
const totalTasks = computed(() => tasks.value?.length ?? 0)
const submittedTasks = computed(() =>
  tasks.value?.filter(t => t.status === 'SUBMITTED' || t.status === 'REVIEW').length ?? 0
)
const approvedTasks = computed(() =>
  tasks.value?.filter(t => t.status === 'APPROVED').length ?? 0
)
const totalContracts = computed(() => contracts.value?.length ?? 0)

// ── Статистика для подрядчика ────────────────────────────────────────────
const availableTasks = computed(() =>
  tasks.value?.filter(t => t.status === 'CREATED' && t.assignedToId === null).length ?? 0
)
const myTasksCount = computed(() =>
  tasks.value?.filter(t => t.assignedToId === currentUserId.value).length ?? 0
)
const signedContracts = computed(() =>
  contracts.value?.filter(c => c.status === 'SIGNED').length ?? 0
)

// ── Последние записи (сортировка по createdAt desc) ──────────────────────
const recentTasks = computed(() =>
  [...(tasks.value ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
)
const recentContracts = computed(() =>
  [...(contracts.value ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
)
const activeTasks = computed(() =>
  (tasks.value ?? []).filter(t =>
    (t.status === 'ACCEPTED' || t.status === 'IN_PROGRESS') &&
    t.assignedToId === currentUserId.value
  )
)

// ── Форматирование ───────────────────────────────────────────────────────
function formatBudget(value: number | string): string {
  return Number(value).toLocaleString('ru-RU') + ' ₸'
}
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Конфиги статусов ─────────────────────────────────────────────────────
type StatusConfig = { label: string; cls: string }

const TASK_STATUS: Record<TaskStatus, StatusConfig> = {
  CREATED:     { label: 'Создана',     cls: 'bg-gray-100 text-gray-600' },
  ACCEPTED:    { label: 'Принята',     cls: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'В работе',    cls: 'bg-blue-100 text-blue-700' },
  SUBMITTED:   { label: 'На проверке', cls: 'bg-yellow-100 text-yellow-700' },
  REVIEW:      { label: 'Ревью',       cls: 'bg-orange-100 text-orange-700' },
  APPROVED:    { label: 'Одобрена',    cls: 'bg-green-100 text-green-700' },
  REJECTED:    { label: 'Отклонена',   cls: 'bg-red-100 text-red-700' },
  COMPLETED:   { label: 'Завершена',   cls: 'bg-green-100 text-green-600' },
}

const CONTRACT_STATUS: Record<ContractStatus, StatusConfig> = {
  DRAFT:     { label: 'Черновик',  cls: 'bg-gray-100 text-gray-600' },
  SENT:      { label: 'Отправлен', cls: 'bg-blue-100 text-blue-700' },
  SIGNED:    { label: 'Подписан',  cls: 'bg-green-100 text-green-700' },
  ACTIVE:    { label: 'Активен',   cls: 'bg-[#01978E]/10 text-[#01978E]' },
  CLOSED:    { label: 'Закрыт',    cls: 'bg-gray-200 text-gray-700' },
  CANCELLED: { label: 'Отменён',   cls: 'bg-red-100 text-red-700' },
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto flex flex-col gap-8">

    <!-- Приветствие -->
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Дашборд</h1>
      <p v-if="authStore.user" class="text-sm text-gray-400 mt-0.5">{{ authStore.user.email }}</p>
    </div>

    <!-- Загрузка -->
    <div v-if="isLoading" class="flex justify-center py-16 text-gray-400">
      <svg class="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

    <!-- ─── КОМПАНИЯ ─────────────────────────────────────────────────── -->
    <template v-else-if="!isContractor">

      <!-- Счётчики -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <p class="text-3xl font-bold text-[#01978E]">{{ totalTasks }}</p>
          <p class="text-sm text-gray-500">Всего задач</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <p class="text-3xl font-bold text-yellow-500">{{ submittedTasks }}</p>
          <p class="text-sm text-gray-500">На проверке</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <p class="text-3xl font-bold text-green-600">{{ approvedTasks }}</p>
          <p class="text-sm text-gray-500">Одобрено</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <p class="text-3xl font-bold text-[#01978E]">{{ totalContracts }}</p>
          <p class="text-sm text-gray-500">Договоров</p>
        </div>
      </div>

      <!-- Последние задачи -->
      <section class="flex flex-col gap-3">
        <h2 class="text-lg font-semibold text-gray-700">Последние задачи</h2>
        <div v-if="recentTasks.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400 text-sm">
          Задач пока нет
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="task in recentTasks"
            :key="task.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2"
          >
            <div class="flex items-center justify-between">
              <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', TASK_STATUS[task.status]?.cls ?? 'bg-gray-100 text-gray-600']">
                {{ TASK_STATUS[task.status]?.label ?? task.status }}
              </span>
              <span v-if="task.deadline" class="text-xs text-gray-400">
                до {{ formatDate(task.deadline) }}
              </span>
            </div>
            <p class="font-semibold text-gray-800 text-sm leading-snug">{{ task.title }}</p>
            <p class="text-sm font-semibold text-[#01978E]">{{ formatBudget(task.budget) }}</p>
          </div>
        </div>
      </section>

      <!-- Последние договоры -->
      <section class="flex flex-col gap-3">
        <h2 class="text-lg font-semibold text-gray-700">Последние договоры</h2>
        <div v-if="recentContracts.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400 text-sm">
          Договоров пока нет
        </div>
        <div v-else class="flex flex-col gap-2">
          <div
            v-for="contract in recentContracts"
            :key="contract.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span :class="['shrink-0 text-xs font-medium px-2.5 py-1 rounded-full', CONTRACT_STATUS[contract.status]?.cls ?? 'bg-gray-100 text-gray-600']">
                {{ CONTRACT_STATUS[contract.status]?.label ?? contract.status }}
              </span>
              <span class="text-sm text-gray-500 font-mono truncate">{{ contract.contractNumber }}</span>
            </div>
            <div class="flex items-center gap-4 shrink-0">
              <span class="text-sm font-semibold text-[#01978E]">{{ formatBudget(contract.amount) }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(contract.createdAt) }}</span>
            </div>
          </div>
        </div>
      </section>

    </template>

    <!-- ─── ПОДРЯДЧИК ────────────────────────────────────────────────── -->
    <template v-else>

      <!-- Счётчики -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <p class="text-3xl font-bold text-[#01978E]">{{ availableTasks }}</p>
          <p class="text-sm text-gray-500">Доступных задач</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <p class="text-3xl font-bold text-blue-600">{{ myTasksCount }}</p>
          <p class="text-sm text-gray-500">Моих задач</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <p class="text-3xl font-bold text-[#01978E]">{{ totalContracts }}</p>
          <p class="text-sm text-gray-500">Моих договоров</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <p class="text-3xl font-bold text-green-600">{{ signedContracts }}</p>
          <p class="text-sm text-gray-500">Подписано</p>
        </div>
      </div>

      <!-- Активные задачи -->
      <section class="flex flex-col gap-3">
        <h2 class="text-lg font-semibold text-gray-700">Активные задачи</h2>

        <div v-if="activeTasks.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center gap-2 text-gray-400">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <p class="text-sm">Активных задач нет</p>
          <p class="text-xs">Перейдите в «Доступные задачи» чтобы принять новую</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="task in activeTasks"
            :key="task.id"
            class="bg-white rounded-xl shadow-sm border border-[#01978E]/20 p-4 flex flex-col gap-2"
          >
            <div class="flex items-center justify-between">
              <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', TASK_STATUS[task.status]?.cls ?? 'bg-gray-100 text-gray-600']">
                {{ TASK_STATUS[task.status]?.label ?? task.status }}
              </span>
              <span v-if="task.deadline" class="text-xs text-gray-400">
                до {{ formatDate(task.deadline) }}
              </span>
            </div>
            <p class="font-semibold text-gray-800 text-sm">{{ task.title }}</p>
            <p class="text-xs text-gray-500 line-clamp-2">{{ task.description }}</p>
            <p class="text-sm font-semibold text-[#01978E]">{{ formatBudget(task.budget) }}</p>
          </div>
        </div>
      </section>

    </template>

  </div>
</template>
