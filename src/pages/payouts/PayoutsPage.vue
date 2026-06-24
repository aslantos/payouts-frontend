<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useAuthStore } from '@/features/auth/model/authStore'
import { usePayments } from '@/features/payments/model/usePayments'
import type { PaymentStatus } from '@/shared/types/api'

const authStore = useAuthStore()
const isContractor = computed(() => authStore.user?.role === 'CONTRACTOR')

const { data: payments, isLoading, isError } = usePayments()

type StatusConfig = { label: string; cls: string }

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  PENDING: { label: 'Ожидает',  cls: 'bg-amber-100 text-amber-700' },
  PAID:    { label: 'Выплачено', cls: 'bg-green-100 text-green-700' },
  FAILED:  { label: 'Ошибка',   cls: 'bg-red-100 text-red-700' },
}

function formatAmount(value: number): string {
  return value.toLocaleString('ru-RU') + ' ₸'
}

function formatDate(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// --- Фильтры ---
const filters = reactive({
  status: '' as PaymentStatus | '',
  amountMin: null as number | null,
  amountMax: null as number | null,
  dateFrom: '',
  dateTo: '',
})

const filteredPayments = computed(() =>
  payments.value?.filter(p => {
    if (filters.status && p.status !== filters.status) return false
    if (filters.amountMin !== null && p.amount < filters.amountMin) return false
    if (filters.amountMax !== null && p.amount > filters.amountMax) return false
    if (filters.dateFrom && new Date(p.createdAt) < new Date(filters.dateFrom)) return false
    if (filters.dateTo) {
      const to = new Date(filters.dateTo)
      to.setHours(23, 59, 59, 999)
      if (new Date(p.createdAt) > to) return false
    }
    return true
  }) ?? []
)

const hasActiveFilters = computed(() =>
  filters.status !== '' || filters.amountMin !== null || filters.amountMax !== null ||
  filters.dateFrom !== '' || filters.dateTo !== ''
)

function resetFilters() {
  Object.assign(filters, { status: '', amountMin: null, amountMax: null, dateFrom: '', dateTo: '' })
}
</script>

<template>
  <!-- Страница доступна только компании -->
  <div v-if="isContractor" class="p-6 max-w-4xl mx-auto">
    <div class="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-6 text-sm text-center">
      Раздел выплат доступен только администраторам компании.
    </div>
  </div>

  <div v-else class="p-6 max-w-4xl mx-auto flex flex-col gap-6">

    <!-- Заголовок -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Выплаты</h1>
    </div>

    <!-- Загрузка -->
    <div v-if="isLoading" class="flex justify-center py-16 text-gray-400">
      <svg class="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

    <!-- Ошибка -->
    <div v-else-if="isError" class="bg-red-50 text-red-600 rounded-xl p-6 text-sm text-center">
      Не удалось загрузить выплаты. Проверьте подключение к серверу.
    </div>

    <!-- Пусто -->
    <div
      v-else-if="!payments || payments.length === 0"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400 flex flex-col items-center gap-3"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
      <p class="text-base">Выплат пока нет</p>
      <p class="text-sm">Выплаты появятся после одобрения задач и нажатия «Выплатить»</p>
    </div>

    <!-- Фильтры + список выплат -->
    <template v-else>

      <!-- Панель фильтров -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
        <div class="flex flex-col sm:flex-row flex-wrap gap-3 items-end">

          <!-- Статус -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-500">Статус</label>
            <select
              v-model="filters.status"
              class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent bg-white"
            >
              <option value="">Все</option>
              <option value="PENDING">Ожидает</option>
              <option value="PAID">Выплачено</option>
              <option value="FAILED">Ошибка</option>
            </select>
          </div>

          <!-- Сумма -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-500">Сумма, ₸</label>
            <div class="flex gap-2">
              <input
                type="number"
                v-model.number="filters.amountMin"
                placeholder="от"
                class="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
              />
              <input
                type="number"
                v-model.number="filters.amountMax"
                placeholder="до"
                class="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
              />
            </div>
          </div>

          <!-- Дата создания -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-500">Дата создания</label>
            <div class="flex gap-2">
              <input
                type="date"
                v-model="filters.dateFrom"
                class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
              />
              <input
                type="date"
                v-model="filters.dateTo"
                class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01978E] focus:border-transparent"
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
            Статус: {{ PAYMENT_STATUS_CONFIG[filters.status as PaymentStatus].label }}
            <button @click="filters.status = ''" class="leading-none hover:opacity-70">×</button>
          </span>
          <span
            v-if="filters.amountMin !== null"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#01978E]/10 text-[#01978E] font-medium"
          >
            От: {{ (filters.amountMin as number).toLocaleString('ru-RU') }} ₸
            <button @click="filters.amountMin = null" class="leading-none hover:opacity-70">×</button>
          </span>
          <span
            v-if="filters.amountMax !== null"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#01978E]/10 text-[#01978E] font-medium"
          >
            До: {{ (filters.amountMax as number).toLocaleString('ru-RU') }} ₸
            <button @click="filters.amountMax = null" class="leading-none hover:opacity-70">×</button>
          </span>
          <span
            v-if="filters.dateFrom"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#01978E]/10 text-[#01978E] font-medium"
          >
            С: {{ new Date(filters.dateFrom).toLocaleDateString('ru-RU') }}
            <button @click="filters.dateFrom = ''" class="leading-none hover:opacity-70">×</button>
          </span>
          <span
            v-if="filters.dateTo"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#01978E]/10 text-[#01978E] font-medium"
          >
            По: {{ new Date(filters.dateTo).toLocaleDateString('ru-RU') }}
            <button @click="filters.dateTo = ''" class="leading-none hover:opacity-70">×</button>
          </span>
        </div>

        <!-- Счётчик -->
        <p class="text-xs text-gray-400">
          Показано: {{ filteredPayments.length }} из {{ payments?.length }}
        </p>
      </div>

      <!-- Нет результатов после фильтрации -->
      <div
        v-if="filteredPayments.length === 0"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-400"
      >
        Ни одна выплата не соответствует выбранным фильтрам
      </div>

      <!-- Список выплат -->
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="payment in filteredPayments"
          :key="payment.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3"
        >
          <!-- Верхняя строка: TX-номер + статус -->
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex flex-col gap-0.5">
              <p class="text-xs text-gray-400">ID транзакции</p>
              <p class="font-mono text-sm font-semibold text-gray-800">{{ payment.providerTxId }}</p>
            </div>
            <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', PAYMENT_STATUS_CONFIG[payment.status].cls]">
              {{ PAYMENT_STATUS_CONFIG[payment.status].label }}
            </span>
          </div>

          <!-- Сумма -->
          <p class="text-2xl font-bold text-[#01978E]">{{ formatAmount(payment.amount) }}</p>

          <!-- Даты -->
          <div class="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-3">
            <div>
              <p class="text-xs text-gray-400 mb-0.5">Создана</p>
              <p class="text-gray-700">{{ formatDate(payment.createdAt) }}</p>
            </div>
            <div v-if="payment.paidAt">
              <p class="text-xs text-gray-400 mb-0.5">Выплачено</p>
              <p class="text-gray-700">{{ formatDate(payment.paidAt) }}</p>
            </div>
          </div>
        </div>
      </div>

    </template>

  </div>
</template>
