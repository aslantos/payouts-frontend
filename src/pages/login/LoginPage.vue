<script setup lang="ts">
import { ref } from 'vue'
import bgImage from '@/shared/assets/auth-bg.webp'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const fullName = ref('')
const email = ref('')
const password = ref('')
</script>

<template>
  <div
    class="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <!-- Карточка: подложка с наложением слоёв -->
    <div class="relative w-[1000px] max-w-[95%] h-[700px] max-h-[90vh] bg-white rounded-[30px] shadow-xl">

      <!-- Бирюзовая панель: отдельный слой поверх, слева -->
      <div class="absolute top-0 left-0 h-full w-[43%] bg-[#01978E] rounded-[30px]"></div>

      <!-- Область формы: справа -->
      <div class="absolute top-0 right-0 h-full w-[57%] flex items-center justify-center">
        <div class="w-[75%] flex flex-col gap-5">

          <h1 class="text-3xl font-bold text-center text-black">Sign Up</h1>

          <BaseInput label="Full Name" placeholder="Enter your full name" v-model="fullName" />
          <BaseInput label="Email" placeholder="Enter your email address" v-model="email" />
          <BaseInput label="Password" placeholder="Enter your password" type="password" v-model="password" />

          <BaseButton class="mt-2">SIGN UP</BaseButton>

          <div class="flex items-center gap-3">
            <span class="flex-1 h-0.5 bg-black"></span>
            <span class="text-lg font-bold text-black">OR</span>
            <span class="flex-1 h-0.5 bg-black"></span>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>