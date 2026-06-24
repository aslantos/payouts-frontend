<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useContracts } from '@/features/contracts/model/useContracts'
import { useContractDetail } from '@/features/contracts/model/useContractDetail'
import { useSignContract } from '@/features/contracts/model/useSignContract'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { ContractStatus } from '@/shared/types/api'

const authStore = useAuthStore()
const isContractor = computed(() => authStore.user?.role === 'CONTRACTOR')

const { data: contracts, isLoading, isError } = useContracts()
const selectedId = ref<number | null>(null)
const { data: detail, isLoading: detailLoading, isError: detailError } = useContractDetail(selectedId)
const signContract = useSignContract()

function handleSign(contractId: number) {
  signContract.mutate(contractId)
}

// Цвета и подписи статусов
type StatusConfig = { label: string; cls: string }

const STATUS_CONFIG: Record<ContractStatus, StatusConfig> = {
  DRAFT:     { label: 'Черновик',  cls: 'bg-gray-100 text-gray-600' },
  SENT:      { label: 'Отправлен', cls: 'bg-blue-100 text-blue-700' },
  SIGNED:    { label: 'Подписан',  cls: 'bg-green-100 text-green-700' },
  ACTIVE:    { label: 'Активен',   cls: 'bg-[#01978E]/10 text-[#01978E]' },
  CLOSED:    { label: 'Закрыт',    cls: 'bg-gray-200 text-gray-700' },
  CANCELLED: { label: 'Отменён',   cls: 'bg-red-100 text-red-700' },
}

function statusConfig(status: ContractStatus): StatusConfig {
  return STATUS_CONFIG[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' }
}

function formatAmount(value: number | string): string {
  return Number(value).toLocaleString('ru-RU') + ' ₸'
}

function formatDate(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// --- Фильтры ---
const filters = reactive({
  status: '' as ContractStatus | '',
  search: '',
})

const filteredContracts = computed(() =>
  contracts.value?.filter(c => {
    if (filters.status && c.status !== filters.status) return false
    if (filters.search && !c.contractNumber.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  }) ?? []
)

const hasActiveFilters = computed(() =>
  filters.status !== '' || filters.search !== ''
)

function resetFilters() {
  Object.assign(filters, { status: '', search: '' })
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto flex flex-col gap-6">

    <h1 class="text-2xl font-bold text-gray-800">Договоры</h1>

    <!-- Загрузка -->
    <div v-if="isLoading" class="flex justify-center py-16 text-gray-400">
      <svg class="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

    <!-- Ошибка загрузки -->
    <div v-else-if="isError" class="bg-red-50 text-red-600 rounded-xl p-6 text-sm text-center">
      Не удалось загрузить договоры. Проверьте подключение к серверу.
    </div>

    <!-- Пусто -->
    <div
      v-else-if="!contracts || contracts.length === 0"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400 flex flex-col items-center gap-3"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
      <p class="text-base">Договоров пока нет</p>
    </div>

    <!-- Фильтры + список договоров -->
    <template v-else>

      <!-- Панель фильтров -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
        <div class="flex flex-col sm:flex-row flex-wrap gap-3 items-end">

          <!-- Поиск по номеру -->
          <div class="flex flex-col gap-1 flex-1 min-w-[160px]">
            <label class="text-xs font-medium text-gray-500">Номер договора</label>
            <input
              v-model="filters.search"
              placeholder="Поиск по номеру..."
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
              <option value="DRAFT">Черновик</option>
              <option value="SENT">Отправлен</option>
              <option value="SIGNED">Подписан</option>
              <option value="ACTIVE">Активен</option>
              <option value="CLOSED">Закрыт</option>
              <option value="CANCELLED">Отменён</option>
            </select>
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
            Статус: {{ statusConfig(filters.status as ContractStatus).label }}
            <button @click="filters.status = ''" class="leading-none hover:opacity-70">×</button>
          </span>
          <span
            v-if="filters.search"
            class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#01978E]/10 text-[#01978E] font-medium"
          >
            Номер: {{ filters.search }}
            <button @click="filters.search = ''" class="leading-none hover:opacity-70">×</button>
          </span>
        </div>

        <!-- Счётчик -->
        <p class="text-xs text-gray-400">
          Показано: {{ filteredContracts.length }} из {{ contracts?.length }}
        </p>
      </div>

      <!-- Нет результатов после фильтрации -->
      <div
        v-if="filteredContracts.length === 0"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-400"
      >
        Ни один договор не соответствует выбранным фильтрам
      </div>

      <!-- Сетка договоров -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="contract in filteredContracts"
          :key="contract.id"
          @click="selectedId = selectedId === contract.id ? null : contract.id"
          :class="[
            'bg-white rounded-xl shadow-sm border p-5 flex flex-col gap-3 cursor-pointer transition-all',
            selectedId === contract.id
              ? 'border-[#01978E] ring-2 ring-[#01978E]/20'
              : 'border-gray-100 hover:border-gray-200',
          ]"
        >
          <!-- Статус + номер -->
          <div class="flex items-center justify-between">
            <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', statusConfig(contract.status).cls]">
              {{ statusConfig(contract.status).label }}
            </span>
            <span class="text-xs text-gray-400 font-mono">{{ contract.contractNumber }}</span>
          </div>

          <!-- Предмет -->
          <h3 class="font-semibold text-gray-800 leading-snug line-clamp-2">{{ contract.subject }}</h3>

          <!-- Сумма + дата -->
          <div class="flex items-center justify-between mt-auto">
            <p class="text-sm font-semibold text-[#01978E]">{{ formatAmount(contract.amount) }}</p>
            <p class="text-xs text-gray-400">{{ formatDate(contract.createdAt) }}</p>
          </div>
        </div>
      </div>

    </template>

    <!-- Детали выбранного договора -->
    <div
      v-if="selectedId !== null"
      class="bg-white rounded-xl shadow-sm border border-[#01978E]/20 p-6 flex flex-col gap-4"
    >
      <!-- Заголовок + закрыть -->
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">
          Договор <span class="font-mono text-gray-500">{{ detail?.contractNumber ?? '...' }}</span>
        </h2>
        <button
          @click="selectedId = null"
          class="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Загрузка деталей -->
      <div v-if="detailLoading" class="flex justify-center py-8 text-gray-400">
        <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>

      <!-- Ошибка деталей -->
      <div v-else-if="detailError" class="text-sm text-red-500 text-center py-4">
        Не удалось загрузить детали договора.
      </div>

      <!-- Содержимое -->
      <div v-else-if="detail" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Предмет договора</p>
            <p class="text-gray-800 font-medium">{{ detail.subject }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Сумма</p>
            <p class="text-[#01978E] font-semibold">{{ formatAmount(detail.amount) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Статус</p>
            <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', statusConfig(detail.status).cls]">
              {{ statusConfig(detail.status).label }}
            </span>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Дата создания</p>
            <p class="text-gray-800">{{ formatDate(detail.createdAt) }}</p>
          </div>
          <div v-if="detail.signedAt">
            <p class="text-xs text-gray-400 mb-0.5">Дата подписания</p>
            <p class="text-gray-800">{{ formatDate(detail.signedAt) }}</p>
          </div>
          <div v-if="detail.fileUrl">
            <p class="text-xs text-gray-400 mb-0.5">Файл договора</p>
            <a
              :href="detail.fileUrl"
              target="_blank"
              rel="noopener"
              class="text-[#01978E] text-sm underline underline-offset-2 hover:opacity-80"
            >
              Открыть файл
            </a>
          </div>
        </div>

        <!-- Кнопка подписания — только подрядчику, только DRAFT или SENT -->
        <div
          v-if="isContractor && (detail.status === 'DRAFT' || detail.status === 'SENT')"
          class="border-t border-gray-100 pt-4 flex flex-col gap-1"
        >
          <BaseButton
            :disabled="signContract.isPending.value"
            @click="handleSign(detail.id)"
            class="self-start"
          >
            {{ signContract.isPending.value ? 'Подписываем...' : 'Подписать договор' }}
          </BaseButton>
          <p v-if="signContract.isError.value" class="text-sm text-red-500">
            Не удалось подписать. Проверьте статус договора.
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
