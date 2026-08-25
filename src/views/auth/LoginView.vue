<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Gradient Accents -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/20 border border-white/20 space-y-6">
      <!-- Header / Brand -->
      <div class="text-center space-y-2">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/25">
          <font-awesome-icon icon="fa-solid fa-ticket" />
        </div>
        <h1 class="text-2xl font-black tracking-tight text-gray-900">
          Nex<span class="text-blue-600">Tix</span> Helpdesk
        </h1>
        <p class="text-xs text-gray-500">
          Silakan masuk ke akun Anda untuk mengakses sistem tiket & bantuan
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="login" class="space-y-4">
        <div class="space-y-1.5">
          <label for="email" class="block text-xs font-bold text-gray-700">Email Pengguna</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <font-awesome-icon icon="fa-solid fa-envelope" class="text-xs" />
            </div>
            <input
              v-model="email"
              id="email"
              type="email"
              placeholder="nama@email.com"
              required
              class="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="password" class="block text-xs font-bold text-gray-700">Kata Sandi</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <font-awesome-icon icon="fa-solid fa-lock" class="text-xs" />
            </div>
            <input
              v-model="password"
              id="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all duration-150 flex items-center justify-center space-x-2 mt-2"
        >
          <font-awesome-icon v-if="submitting" icon="fa-solid fa-spinner" class="animate-spin text-xs" />
          <span>{{ submitting ? 'Memproses Masuk...' : 'Masuk ke Akun' }}</span>
        </button>
      </form>

      <!-- Informative hint box -->
      <div class="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-center text-[11px] text-blue-800 leading-relaxed">
        <p class="font-semibold">💡 Layanan Pengaduan Terpadu</p>
        <p class="text-blue-700/80 mt-0.5">Ajukan kendala teknis dan pantau respon teknisi langsung dari dashboard Anda.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

const email = ref("");
const password = ref("");
const submitting = ref(false);
const authStore = useAuthStore();

const login = async () => {
  submitting.value = true;
  try {
    await authStore.login({ email: email.value, password: password.value });
  } catch (error) {
    console.error("Login failed", error);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* Scoped styles */
</style>
