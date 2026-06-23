<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { useRegister } from '@/features/auth/model/useRegister'
import bgImage from '@/shared/assets/auth-bg.webp'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const companyName = ref('')
const bin = ref('')
const email = ref('')
const password = ref('')

const router = useRouter()
const registerMutation = useRegister()

const registerErrorText = computed(() => {
  if (!registerMutation.isError.value) return ''
  const status = (registerMutation.error.value as AxiosError)?.response?.status
  if (status === 400) return 'Пользователь с такими данными уже существует'
  if (status === 422) return 'Проверьте правильность введённых данных'
  return 'Что-то пошло не так, попробуйте позже'
})

function handleRegister() {
  registerMutation.mutate(
    {
      companyName: companyName.value,
      bin: bin.value,
      email: email.value,
      password: password.value,
    },
    {
      onSuccess: () => {
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      },
    }
  )
}
</script>

<template>
  <div
    class="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div class="w-[520px] max-w-[95%] bg-white rounded-[30px] shadow-xl px-12 py-10 flex flex-col gap-5">

      <h1 class="text-[36px] font-bold text-center">Register Company</h1>

      <BaseInput label="Company Name" placeholder="Enter your company name" v-model="companyName" />
      <BaseInput label="BIN" placeholder="Enter BIN (12 digits)" v-model="bin" />
      <BaseInput label="Email" placeholder="Enter email address" v-model="email" />
      <BaseInput label="Password" placeholder="Enter password" type="password" v-model="password" />

      <BaseButton
        class="mt-2 w-full flex items-center justify-center gap-4"
        :disabled="registerMutation.isPending.value"
        @click="handleRegister"
      >
        <span class="text-2xl">{{ registerMutation.isPending.value ? 'Регистрируем...' : 'Register' }}</span>
        <svg v-if="!registerMutation.isPending.value" viewBox="0 0 29 23" fill="none" class="w-6 h-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M28.2684 12.1066C28.8542 11.5208 28.8542 10.5711 28.2684 9.9853L18.7225 0.439358C18.1367 -0.146429 17.187 -0.146429 16.6012 0.439358C16.0154 1.02514 16.0154 1.97489 16.6012 2.56068L25.0865 11.046L16.6012 19.5312C16.0154 20.117 16.0154 21.0668 16.6012 21.6526C17.187 22.2383 18.1367 22.2383 18.7225 21.6526L28.2684 12.1066ZM0 11.046V12.546H27.2078V11.046V9.54596H0V11.046Z" fill="currentColor"/>
        </svg>
      </BaseButton>

      <p v-if="registerMutation.isSuccess.value" class="text-sm text-green-600 text-center bg-green-50 rounded-lg p-3">
        Аккаунт успешно создан! Войдите в систему.
      </p>

      <p v-if="registerMutation.isError.value" class="text-sm text-red-500 text-center">
        {{ registerErrorText }}
      </p>

      <p class="text-center text-sm text-gray-500">
        Уже есть аккаунт?
        <router-link to="/login" class="text-[#01978E] font-semibold hover:underline">Войти</router-link>
      </p>

    </div>
  </div>
</template>
