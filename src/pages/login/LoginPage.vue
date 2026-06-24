<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { useLogin } from '@/features/auth/model/useLogin'
import { useRegisterContractor } from '@/features/auth/model/useRegisterContractor'
import bgImage from '@/shared/assets/auth-bg.webp'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import GoogleIcon from '@/shared/ui/icons/GoogleIcon.vue'
import LinkedinIcon from '@/shared/ui/icons/LinkedinIcon.vue'
import AppleIcon from '@/shared/ui/icons/AppleIcon.vue'

// Sign Up form
const signupUsername = ref('')
const email = ref('')
const signupPassword = ref('')
const isSelfEmployed = ref(false)
const registrationSuccess = ref(false)

// Log In form
const loginEmail = ref('')
const password = ref('')

const isLogin = ref(false)
const router = useRouter()

const loginMutation = useLogin()
const registerMutation = useRegisterContractor()

const registerErrorText = computed(() => {
  if (!registerMutation.isError.value) return ''
  const status = (registerMutation.error.value as AxiosError)?.response?.status
  if (status === 400) return 'Пользователь с такими данными уже существует'
  if (status === 422) return 'Проверьте правильность введённых данных'
  return 'Что-то пошло не так, попробуйте позже'
})

function handleLogin() {
  loginMutation.mutate(
    { email: loginEmail.value, password: password.value },
    {
      onSuccess: () => {
        router.push('/dashboard')
      },
    }
  )
}

function handleRegister() {
  registerMutation.mutate(
    {
      userame: signupUsername.value,
      email: email.value,
      password: signupPassword.value,
      selfEmployed: isSelfEmployed.value,
    },
    {
      onSuccess: () => {
        registrationSuccess.value = true
        setTimeout(() => {
          isLogin.value = true
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
    <!-- Карточка-->
    <div class="relative w-[1000px] max-w-[95%] h-[700px] max-h-[90vh] bg-white rounded-[30px] shadow-xl">

      <!-- Бирюзовая панель-->
      <div
          class="absolute top-0 left-0 h-full w-[43%] bg-[#01978E] rounded-[30px] z-10 flex flex-col items-center justify-center text-center px-10 gap-4 transition-transform duration-500 ease-in-out"
          :class="isLogin ? 'translate-x-[133%]' : 'translate-x-0'"
        >
        <h2 class="text-3xl font-bold text-white font-['Nunito']">
          {{ isLogin ? 'New here?' : 'Already Signed up?' }}
        </h2>
        <p class="text-sm text-white">
          {{ isLogin
              ? 'Let’s get you all set up so you can start creating your first onboarding experience'
              : 'Log in to your account so you can continue building and editing your onboarding flows' }}
        </p>
        <button
          type="button"
          @click="isLogin = !isLogin"
          class="text-lg text-white font-['Nunito'] mt-2 px-12.5 py-1 border-2 border-white font-bold rounded-md hover:bg-white/10 transition-colors"
        >
          {{ isLogin ? 'SIGN UP' : 'LOG IN' }}
        </button>
      </div>

      <!-- Область формы: справа -->
      <div
          class="absolute top-0 h-full w-[57%] flex items-center justify-center transition-all duration-500 ease-in-out"
          :class="isLogin ? 'left-0' : 'left-[43%]'"
        >
        <form v-if="!isLogin" class="w-[75%] flex flex-col gap-5" @submit.prevent="handleRegister">

          <h1 class="text-[40px] font-bold text-center">Sign Up</h1>

          <BaseInput label="Username" placeholder="Enter your username" v-model="signupUsername" />
          <BaseInput label="Email" placeholder="Enter your email address" v-model="email" />
          <BaseInput label="Password" placeholder="Enter your password" type="password" v-model="signupPassword" />

          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="isSelfEmployed" class="w-4 h-4 accent-[#01978E]" />
            <span class="text-sm">I am self-employed</span>
          </label>

          <BaseButton
            type="submit"
            class="mt-2 w-full flex items-center justify-center gap-4"
            :disabled="registerMutation.isPending.value"
          >
            <span class="text-2xl">{{ registerMutation.isPending.value ? 'Регистрируем...' : 'Sign up' }}</span>
            <svg v-if="!registerMutation.isPending.value" viewBox="0 0 29 23" fill="none" class="w-6 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.2684 12.1066C28.8542 11.5208 28.8542 10.5711 28.2684 9.9853L18.7225 0.439358C18.1367 -0.146429 17.187 -0.146429 16.6012 0.439358C16.0154 1.02514 16.0154 1.97489 16.6012 2.56068L25.0865 11.046L16.6012 19.5312C16.0154 20.117 16.0154 21.0668 16.6012 21.6526C17.187 22.2383 18.1367 22.2383 18.7225 21.6526L28.2684 12.1066ZM0 11.046V12.546H27.2078V11.046V9.54596H0V11.046Z" fill="currentColor"/>
            </svg>
          </BaseButton>

          <p v-if="registerMutation.isError.value" class="text-sm text-red-500 text-center">
            {{ registerErrorText }}
          </p>

          <div class="flex items-center gap-3">
            <span class="flex-1 h-0.5 bg-black"></span>
            <span class="text-lg font-bold text-black">OR</span>
            <span class="flex-1 h-0.5 bg-black"></span>
          </div>

          <div class="flex items-center justify-center gap-10">
            <button type="button" class="w-11 h-11 border-3 border-[#A3A3A3] rounded-lg flex items-center justify-center">
              <GoogleIcon/>
            </button>
            <button type="button" class="w-11 h-11 border-3 border-[#A3A3A3] rounded-lg flex items-center justify-center">
              <LinkedinIcon/>
            </button>
            <button type="button" class="w-11 h-11 border-3 border-[#A3A3A3] rounded-lg flex items-center justify-center">
              <AppleIcon/>
            </button>
          </div>

          <p class="text-center text-sm text-gray-500">
            Registering a company?
            <router-link to="/register-company" class="text-[#01978E] font-semibold hover:underline">
              Register here
            </router-link>
          </p>

        </form>
        <!-- if: Log In -->
        <form v-else class="w-[75%] flex flex-col gap-5" @submit.prevent="handleLogin">
          <h1 class="text-[40px] font-black text-center">Log In</h1>

          <p v-if="registrationSuccess" class="text-sm text-green-600 text-center bg-green-50 rounded-lg p-3">
            Аккаунт успешно создан! Войдите в систему.
          </p>

          <BaseInput label="Email" placeholder="Enter your email" v-model="loginEmail" />
          <BaseInput label="Password" placeholder="Enter your password" type="password" v-model="password" />

          <div class="flex justify-between">
            <label class="flex gap-1 cursor-pointer accent-[#01978E]">
              <input type="checkbox">
              <span>Remember Me</span>
            </label>
            <a href="#" class="text-[#01978E]">Forgot Password?</a>
          </div>

          <BaseButton
            type="submit"
            class="mt-2 w-full flex items-center justify-center gap-4"
            :disabled="loginMutation.isPending.value"
          >
            <span class="text-2xl">{{ loginMutation.isPending.value ? 'Logging in...' : 'Log In' }}</span>
            <svg v-if="!loginMutation.isPending.value" viewBox="0 0 29 23" fill="none" class="w-6 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.2684 12.1066C28.8542 11.5208 28.8542 10.5711 28.2684 9.9853L18.7225 0.439358C18.1367 -0.146429 17.187 -0.146429 16.6012 0.439358C16.0154 1.02514 16.0154 1.97489 16.6012 2.56068L25.0865 11.046L16.6012 19.5312C16.0154 20.117 16.0154 21.0668 16.6012 21.6526C17.187 22.2383 18.1367 22.2383 18.7225 21.6526L28.2684 12.1066ZM0 11.046V12.546H27.2078V11.046V9.54596H0V11.046Z" fill="currentColor"/>
            </svg>
          </BaseButton>

          <p v-if="loginMutation.isError.value" class="text-sm text-red-500 text-center">
            Неверный логин или пароль
          </p>

          <div class="flex items-center gap-3">
            <span class="flex-1 h-0.5 bg-black"></span>
            <span class="text-lg font-bold text-black">OR</span>
            <span class="flex-1 h-0.5 bg-black"></span>
          </div>
          
          <div class="flex items-center justify-center gap-10">
            <button type="button" class="w-11 h-11 border-3 border-[#A3A3A3] rounded-lg flex items-center justify-center">
              <GoogleIcon/>
            </button>
            <button type="button" class="w-11 h-11 border-3 border-[#A3A3A3] rounded-lg flex items-center justify-center">
              <LinkedinIcon/>
            </button>
            <button type="button" class="w-11 h-11 border-3 border-[#A3A3A3] rounded-lg flex items-center justify-center">
              <AppleIcon/>
            </button>
          </div>


        </form>
      </div>

    </div>
  </div>
</template>