<script setup lang="ts">
import { computed } from 'vue'
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

    <!-- Список выплат -->
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="payment in payments"
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

  </div>
</template>
