<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useTasks } from '@/features/tasks/model/useTasks'
import { useCreateTask } from '@/features/tasks/model/useCreateTask'
import { useAcceptTask } from '@/features/tasks/model/useAcceptTask'
import { useApproveTask } from '@/features/tasks/model/useApproveTask'
import { useSubmitWork } from '@/features/tasks/model/useSubmitWork'
import { useInitiatePayment } from '@/features/payments/model/useInitiatePayment'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import type { TaskStatus } from '@/shared/types/api'

const router = useRouter()
const authStore = useAuthStore()
const isCompany = computed(() => authStore.user?.role !== 'CONTRACTOR')
const isContractor = computed(() => authStore.user?.role === 'CONTRACTOR')
const currentUserId = computed(() => authStore.user?.id)

const { data: tasks, isLoading, isError } = useTasks()
const createTask = useCreateTask()
const acceptTask = useAcceptTask()
const approveTask = useApproveTask()
const submitWork = useSubmitWork()
const initiatePayment = useInitiatePayment()

const payingId = ref<number | null>(null)

function handlePay(taskId: number) {
  payingId.value = taskId
  initiatePayment.mutate(taskId, {
    onSettled: () => { payingId.value = null },
  })
}

// --- Форма создания ---
const showForm = ref(false)
const title = ref('')
const description = ref('')
const budget = ref('')
const deadline = ref('')

function handleSubmit() {
  if (!title.value || !budget.value) return

  const payload: Record<string, unknown> = {
    title: title.value,
    description: description.value,
    budget: Number(budget.value),
  }
  if (deadline.value) payload.deadline = deadline.value

  createTask.mutate(payload as Parameters<typeof createTask.mutate>[0], {
    onSuccess: () => {
      showForm.value = false
      title.value = ''
      description.value = ''
      budget.value = ''
      deadline.value = ''
    },
  })
}

// --- Действия с задачей ---
// Храним ID задачи в процессе действия — чтобы спиннер показывался только на нужной карточке
const acceptingId = ref<number | null>(null)
const acceptErrorId = ref<number | null>(null)

function handleAccept(taskId: number) {
  acceptingId.value = taskId
  acceptErrorId.value = null
  acceptTask.mutate(taskId, {
    onError: () => { acceptErrorId.value = taskId },
    onSettled: () => { acceptingId.value = null },
  })
}

const approvingId = ref<number | null>(null)
const approveErrorId = ref<number | null>(null)

function handleApprove(taskId: number) {
  approvingId.value = taskId
  approveErrorId.value = null
  approveTask.mutate(taskId, {
    onError: () => { approveErrorId.value = taskId },
    onSettled: () => { approvingId.value = null },
  })
}

// --- Форма сдачи работы ---
const submitFormTaskId = ref<number | null>(null)
const submitContent = ref('')
const submitAttachments = ref('')

function openSubmitForm(taskId: number) {
  submitFormTaskId.value = taskId
  submitContent.value = ''
  submitAttachments.value = ''
}

function closeSubmitForm() {
  submitFormTaskId.value = null
}

function handleSubmitWork(taskId: number) {
  if (!submitContent.value.trim()) return
  const attachments = submitAttachments.value.trim() ? [submitAttachments.value.trim()] : []
  submitWork.mutate(
    { taskId, content: submitContent.value, attachments },
    { onSuccess: closeSubmitForm },
  )
}

// --- Статусы ---
type StatusConfig = { label: string; cls: string }

const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  CREATED:     { label: 'Создана',     cls: 'bg-gray-100 text-gray-600' },
  ACCEPTED:    { label: 'Принята',     cls: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'В работе',    cls: 'bg-blue-100 text-blue-700' },
  SUBMITTED:   { label: 'На проверке', cls: 'bg-yellow-100 text-yellow-700' },
  REVIEW:      { label: 'Ревью',       cls: 'bg-orange-100 text-orange-700' },
  APPROVED:    { label: 'Одобрена',    cls: 'bg-green-100 text-green-700' },
  REJECTED:    { label: 'Отклонена',   cls: 'bg-red-100 text-red-700' },
  COMPLETED:   { label: 'Завершена',   cls: 'bg-teal-100 text-teal-700' },
}

function statusConfig(status: TaskStatus): StatusConfig {
  return STATUS_CONFIG[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' }
}

function formatBudget(value: number | string): string {
  return Number(value).toLocaleString('ru-RU') + ' ₸'
}

function formatDeadline(dl: string | null): string {
  if (!dl) return ''
  return new Date(dl).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// --- Фильтры ---
const filters = reactive({
  status: '' as TaskStatus | '',
  search: '',
  budgetMin: null as number | null,
  budgetMax: null as number | null,
})

const filteredTasks = computed(() =>
  tasks.value?.filter(task => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.budgetMin !== null && task.budget < filters.budgetMin) return false
    if (filters.budgetMax !== null && task.budget > filters.budgetMax) return false
    return true
  }) ?? []
)

const hasActiveFilters = computed(() =>
  filters.status !== '' || filters.search !== '' || filters.budgetMin !== null || filters.budgetMax !== null
)

function resetFilters() {
  Object.assign(filters, { status: '', search: '', budgetMin: null, budgetMax: null })
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto flex flex-col gap-6">

    <!-- Заголовок -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Задачи</h1>
      <BaseButton
        v-if="isCompany && !showForm"
        @click="showForm = true"
        class="flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Создать задачу
      </BaseButton>
    </div>

    <!-- Форма создания (только для компании) -->
    <div
      v-if="showForm && isCompany"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4"
    >
      <h2 class="text-lg font-semibold text-gray-800">Новая задача</h2>

      <BaseInput label="Название" placeholder="Сверстать лендинг" v-model="title" />

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-700">Описание</label>
        <textarea
          v-model="description"
          placeholder="Подробное описание задачи"
          rows="3"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent resize-none"
        />
      </div>

      <BaseInput label="Бюджет (₸)" placeholder="150000" type="number" v-model="budget" />

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-700">Дедлайн <span class="text-gray-400 font-normal">(необязательно)</span></label>
        <input
          type="datetime-local"
          v-model="deadline"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
        />
      </div>

      <p v-if="createTask.isError.value" class="text-sm text-red-500">
        Не удалось создать задачу. Проверьте данные.
      </p>

      <div class="flex gap-3 pt-1">
        <BaseButton
          :disabled="createTask.isPending.value || !title || !budget"
          @click="handleSubmit"
        >
          {{ createTask.isPending.value ? 'Создаём...' : 'Создать' }}
        </BaseButton>
        <button
          type="button"
          @click="showForm = false"
          class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Отмена
        </button>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="isLoading" class="flex justify-center py-16 text-gray-400">
      <svg class="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

    <!-- Ошибка загрузки -->
    <div v-else-if="isError" class="bg-red-50 text-red-600 rounded-xl p-6 text-sm text-center">
      Не удалось загрузить задачи. Проверьте подключение к серверу.
    </div>

    <!-- Пусто -->
    <div
      v-else-if="!tasks || tasks.length === 0"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400 flex flex-col items-center gap-3"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12h6M9 8h6M9 16h4" />
      </svg>
      <p class="text-base">Задач пока нет</p>
      <p v-if="isCompany" class="text-sm">Нажмите «Создать задачу», чтобы добавить первую</p>
    </div>

    <!-- Фильтры + список задач -->
    <template v-else>

      <!-- Панель фильтров -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
        <div class="flex flex-col sm:flex-row flex-wrap gap-3 items-end">

          <!-- Поиск -->
          <div class="flex flex-col gap-1 flex-1 min-w-[160px]">
            <label class="text-xs font-medium text-gray-500">Поиск</label>
            <input
              v-model="filters.search"
              placeholder="Поиск по названию..."
              class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
            />
          </div>

          <!-- Статус -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-500">Статус</label>
            <select
              v-model="filters.status"
              class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent bg-white"
            >
              <option value="">Все статусы</option>
              <option value="CREATED">Создана</option>
              <option value="ACCEPTED">Принята</option>
              <option value="SUBMITTED">На проверке</option>
              <option value="APPROVED">Одобрена</option>
              <option value="COMPLETED">Завершена</option>
            </select>
          </div>

          <!-- Бюджет -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-500">Бюджет, ₸</label>
            <div class="flex gap-2">
              <input
                type="number"
                v-model.number="filters.budgetMin"
                placeholder="от"
                class="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
              />
              <input
                type="number"
                v-model.number="filters.budgetMax"
                placeholder="до"
                class="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
              />
            </div>
          </div>

          <!-- Сброс -->
          <button
            v-if="hasActiveFilters"
            @click="resetFilters"
            class="self-end px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>

        <!-- Активные фильтры-бейджи -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
          <span
            v-if="filters.status"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#01978E]/10 text-[#01978E] font-medium"
          >
            Статус: {{ statusConfig(filters.status as TaskStatus).label }}
            <button @click="filters.status = ''" class="leading-none hover:opacity-70">×</button>
          </span>
          <span
            v-if="filters.search"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#01978E]/10 text-[#01978E] font-medium"
          >
            Поиск: {{ filters.search }}
            <button @click="filters.search = ''" class="leading-none hover:opacity-70">×</button>
          </span>
          <span
            v-if="filters.budgetMin !== null"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#01978E]/10 text-[#01978E] font-medium"
          >
            От: {{ (filters.budgetMin as number).toLocaleString('ru-RU') }} ₸
            <button @click="filters.budgetMin = null" class="leading-none hover:opacity-70">×</button>
          </span>
          <span
            v-if="filters.budgetMax !== null"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#01978E]/10 text-[#01978E] font-medium"
          >
            До: {{ (filters.budgetMax as number).toLocaleString('ru-RU') }} ₸
            <button @click="filters.budgetMax = null" class="leading-none hover:opacity-70">×</button>
          </span>
        </div>

        <!-- Счётчик -->
        <p class="text-xs text-gray-400">
          Показано: {{ filteredTasks.length }} из {{ tasks?.length }}
        </p>
      </div>

      <!-- Нет результатов после фильтрации -->
      <div
        v-if="filteredTasks.length === 0"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-400"
      >
        Ни одна задача не соответствует выбранным фильтрам
      </div>

      <!-- Сетка задач -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          @click="router.push(`/tasks/${task.id}`)"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 cursor-pointer hover:border-gray-200 transition-colors"
        >
          <!-- Статус + дедлайн -->
          <div class="flex items-center justify-between">
            <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', statusConfig(task.status).cls]">
              {{ statusConfig(task.status).label }}
            </span>
            <span v-if="task.deadline" class="text-xs text-gray-400">
              до {{ formatDeadline(task.deadline) }}
            </span>
          </div>

          <!-- Название -->
          <h3 class="font-semibold text-gray-800 leading-snug">{{ task.title }}</h3>

          <!-- Описание -->
          <p class="text-sm text-gray-500 line-clamp-2">{{ task.description }}</p>

          <!-- Бюджет -->
          <p class="text-sm font-semibold text-[#01978E]">{{ formatBudget(task.budget) }}</p>

          <!-- ПОДРЯДЧИК: Принять -->
          <div
            v-if="isContractor && task.status === 'CREATED' && (task.assignedToId === null || task.assignedToId === currentUserId)"
            @click.stop
            class="border-t border-gray-100 pt-3 flex flex-col gap-1"
          >
            <BaseButton
              :disabled="acceptingId === task.id"
              @click="handleAccept(task.id)"
              class="w-full"
            >
              {{ acceptingId === task.id ? 'Принимаем...' : 'Принять' }}
            </BaseButton>
            <p v-if="acceptErrorId === task.id" class="text-xs text-red-500 text-center">
              Не удалось принять. Задача уже занята или нет прав.
            </p>
          </div>

          <!-- ПОДРЯДЧИК: Сдать работу -->
          <div
            v-if="isContractor && (task.status === 'ACCEPTED' || task.status === 'IN_PROGRESS') && task.assignedToId === currentUserId"
            @click.stop
            class="border-t border-gray-100 pt-3 flex flex-col gap-2"
          >
            <BaseButton
              v-if="submitFormTaskId !== task.id"
              @click="openSubmitForm(task.id)"
              class="w-full"
            >
              Сдать работу
            </BaseButton>

            <template v-else>
              <textarea
                v-model="submitContent"
                placeholder="Опишите выполненную работу"
                rows="3"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent resize-none"
              />
              <input
                type="text"
                v-model="submitAttachments"
                placeholder="Ссылка на результат (необязательно)"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
              />
              <p v-if="submitWork.isError.value" class="text-xs text-red-500">
                Не удалось отправить. Проверьте данные.
              </p>
              <div class="flex gap-2">
                <BaseButton
                  :disabled="submitWork.isPending.value || !submitContent.trim()"
                  @click="handleSubmitWork(task.id)"
                  class="flex-1"
                >
                  {{ submitWork.isPending.value ? 'Отправляем...' : 'Отправить' }}
                </BaseButton>
                <button
                  type="button"
                  @click="closeSubmitForm"
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
            @click.stop
            class="border-t border-gray-100 pt-3 flex flex-col gap-1"
          >
            <BaseButton
              :disabled="approvingId === task.id"
              @click="handleApprove(task.id)"
              class="w-full"
            >
              {{ approvingId === task.id ? 'Одобряем...' : 'Одобрить' }}
            </BaseButton>
            <p v-if="approveErrorId === task.id" class="text-xs text-red-500 text-center">
              Нет прав или задача в неверном статусе.
            </p>
          </div>

          <!-- КОМПАНИЯ: Выплатить -->
          <div
            v-if="isCompany && task.status === 'APPROVED'"
            @click.stop
            class="border-t border-gray-100 pt-3"
          >
            <BaseButton
              :disabled="payingId === task.id"
              @click="handlePay(task.id)"
              class="w-full"
            >
              {{ payingId === task.id ? 'Инициируем...' : 'Выплатить' }}
            </BaseButton>
          </div>

        </div>
      </div>

    </template>

  </div>
</template>
