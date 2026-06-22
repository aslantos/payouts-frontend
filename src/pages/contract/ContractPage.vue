<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useCreateContract } from '@/features/contracts/model/useCreateContract'

const contractorId = ref('')
const amount = ref('')
const subject = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const { mutate: createContract, isPending, isSuccess, isError } = useCreateContract()

const preview = computed(() => ({
  contractorId: contractorId.value || '—',
  amount: amount.value || '—',
  subject: subject.value || '—',
  dateFrom: dateFrom.value || '—',
  dateTo: dateTo.value || '—',
}))

function handleSubmit() {
  createContract({
    contractor_id: Number(contractorId.value),
    subject: subject.value,
    amount: amount.value,
  })
}
</script>

<template>
  <div class="p-6 flex gap-6 items-start">

    <!-- Левая карточка: форма + превью -->
    <div class="flex-1 bg-white border border-[#01978E] rounded-xl p-6">

      <h1 class="text-xl font-bold text-gray-900">Создание контракта</h1>

      <!-- Подзаголовок с разделителем -->
      <div class="flex items-center gap-3 mt-1 mb-6">
        <span class="text-sm text-gray-500 shrink-0">Стандартный ГПХ</span>
        <div class="flex-1 h-px bg-gray-200" />
      </div>

      <div class="flex gap-8">

        <!-- Форма -->
        <div class="flex-1 flex flex-col gap-4">
          <BaseInput
            label="Работодатель"
            placeholder="Название компании"
            :readonly="true"
          />
          <BaseInput
            label="ID Работника"
            placeholder="1"
            type="number"
            v-model="contractorId"
          />
          <BaseInput
            label="Сумма"
            placeholder="150 000 тнг"
            v-model="amount"
          />
          <BaseInput
            label="Предмет договора"
            placeholder="Landing Page на React"
            v-model="subject"
          />

          <!-- Два поля дат рядом -->
          <div class="flex gap-3">
            <BaseInput
              label="Начало"
              type="date"
              v-model="dateFrom"
              class="flex-1"
            />
            <BaseInput
              label="Конец"
              type="date"
              v-model="dateTo"
              class="flex-1"
            />
          </div>

          <p v-if="isSuccess" class="text-sm text-[#01978E] font-medium">Контракт успешно создан!</p>
          <p v-if="isError" class="text-sm text-red-500">Ошибка при создании. Проверьте данные.</p>
        </div>

        <!-- Превью контракта -->
        <div class="flex-1 bg-gray-50 rounded-xl p-5 flex flex-col gap-3">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Предварительный просмотр
          </p>
          <div class="h-px bg-gray-200" />

          <p class="text-sm font-bold text-gray-800">Договор оказания услуг</p>
          <p class="text-xs text-gray-400">№ ——</p>

          <div class="flex flex-col gap-3 mt-1">
            <div>
              <p class="text-xs text-gray-400">ID Работника</p>
              <p class="text-sm font-medium text-gray-800">{{ preview.contractorId }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Предмет договора</p>
              <p class="text-sm font-medium text-gray-800">{{ preview.subject }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Сумма</p>
              <p class="text-sm font-medium text-gray-800">{{ preview.amount }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Срок</p>
              <p class="text-sm font-medium text-gray-800">
                {{ preview.dateFrom }} — {{ preview.dateTo }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Правая панель: кнопки -->
    <div class="w-44 flex flex-col gap-3 shrink-0 pt-1">

      <BaseButton :disabled="isPending" @click="handleSubmit">
        {{ isPending ? 'Отправка...' : 'Review and sign' }}
      </BaseButton>

      <button
        @click="() => console.log('download')"
        class="flex items-center gap-2 text-sm text-gray-600 hover:text-[#01978E] transition-colors py-1"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download
      </button>

      <button
        @click="() => console.log('preview google docs')"
        class="flex items-center gap-2 text-sm text-gray-600 hover:text-[#01978E] transition-colors py-1"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Preview in Google Docs
      </button>

      <button
        @click="() => console.log('edit')"
        class="flex items-center gap-2 text-sm text-gray-600 hover:text-[#01978E] transition-colors py-1"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Edit
      </button>

    </div>
  </div>
</template>
