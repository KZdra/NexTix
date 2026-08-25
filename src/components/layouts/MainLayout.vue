<template>
  <div class="min-h-screen bg-slate-50 flex selection:bg-blue-500 selection:text-white">
    <!-- 1. Left Sidebar (Fixed on Desktop, Off-canvas Drawer on Mobile) -->
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- 2. Main Wrapper with Left Padding for Desktop Sidebar -->
    <div class="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
      <!-- Top Header Navbar -->
      <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-2xs h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Left: Mobile Toggle & Page Context -->
        <div class="flex items-center space-x-3 sm:space-x-4">
          <!-- Mobile Hamburger Toggle -->
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <font-awesome-icon icon="fa-solid fa-bars" class="text-base" />
          </button>

          <!-- Breadcrumb Title -->
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">NexTix Portal</span>
            <span class="text-gray-300 hidden sm:inline">/</span>
            <span class="text-sm font-black text-gray-900 capitalize">{{ pageTitle }}</span>
          </div>
        </div>

        <!-- Right: Profile Dropdown & Quick Links -->
        <div class="flex items-center space-x-3">
          <!-- Quick Ticket Button for Client -->
          <router-link
            to="/ticket"
            class="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all"
          >
            <font-awesome-icon icon="fa-solid fa-ticket" class="text-[11px]" />
            <span>{{ isClient ? 'Tiket Saya' : 'Kelola Tiket' }}</span>
          </router-link>

          <!-- User Profile Dropdown -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="profileMenuOpen = !profileMenuOpen"
              class="flex items-center space-x-2.5 py-1 px-2 sm:px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              :class="{ 'ring-2 ring-blue-500/20 border-blue-300 bg-blue-50/50': profileMenuOpen }"
            >
              <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white uppercase shadow-xs flex-shrink-0" :class="avatarBgClass">
                {{ userInitial }}
              </div>
              <div class="hidden sm:flex flex-col text-left">
                <span class="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                  {{ authStore.user?.name || 'Pengguna' }}
                </span>
                <span class="text-[9px] font-semibold uppercase tracking-wider text-gray-400 leading-none mt-0.5">
                  {{ roleLabel }}
                </span>
              </div>
              <font-awesome-icon
                icon="fa-solid fa-chevron-down"
                class="text-[10px] text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180 text-blue-600': profileMenuOpen }"
              />
            </button>

            <!-- Dropdown Menu Card -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="transform scale-95 opacity-0 -translate-y-1"
              enter-to-class="transform scale-100 opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="transform scale-100 opacity-100 translate-y-0"
              leave-to-class="transform scale-95 opacity-0 -translate-y-1"
            >
              <div
                v-show="profileMenuOpen"
                class="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-gray-200 shadow-xl shadow-gray-200/50 py-2 z-50 overflow-hidden"
              >
                <!-- User info header -->
                <div class="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white uppercase shadow-xs" :class="avatarBgClass">
                      {{ userInitial }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-bold text-gray-900 truncate">{{ authStore.user?.name || 'Pengguna' }}</p>
                      <p class="text-[11px] text-gray-400 truncate">{{ authStore.user?.email || 'Akun Pengguna' }}</p>
                      <span class="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-blue-600">
                        {{ roleLabel }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Menu items -->
                <div class="p-1.5 space-y-0.5 text-xs">
                  <router-link
                    to="/home"
                    @click="profileMenuOpen = false"
                    class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                  >
                    <font-awesome-icon icon="fa-solid fa-house" class="text-gray-400 text-xs w-4" />
                    <span>Dashboard Utama</span>
                  </router-link>

                  <router-link
                    to="/faq"
                    @click="profileMenuOpen = false"
                    class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                  >
                    <font-awesome-icon icon="fa-solid fa-circle-question" class="text-gray-400 text-xs w-4" />
                    <span>Pusat Bantuan / FAQ</span>
                  </router-link>
                </div>

                <!-- Logout -->
                <div class="p-1.5 border-t border-gray-100">
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" class="text-red-500 text-xs w-4" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Main Slot Content -->
      <main class="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const route = useRoute();

const sidebarOpen = ref(false);
const profileMenuOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    profileMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});

const userRole = computed(() => authStore.user?.role || "client");
const isClient = computed(() => userRole.value === "client");

const userInitial = computed(() => {
  const name = authStore.user?.name || "U";
  return name.charAt(0).toUpperCase();
});

const roleLabel = computed(() => {
  switch (userRole.value) {
    case "admin":
      return "Administrator";
    case "support":
      return "Teknisi / Support";
    case "client":
    default:
      return "User / Client";
  }
});

const avatarBgClass = computed(() => {
  switch (userRole.value) {
    case "admin":
      return "bg-gradient-to-tr from-purple-600 to-indigo-600";
    case "support":
      return "bg-gradient-to-tr from-amber-500 to-orange-600";
    case "client":
    default:
      return "bg-gradient-to-tr from-blue-500 to-teal-500";
  }
});

const pageTitle = computed(() => {
  switch (route.name) {
    case "home":
      return "Dashboard";
    case "ticket":
      return isClient.value ? "Tiket Saya" : "Kelola Tiket";
    case "detailticket":
      return "Detail Penanganan Tiket";
    case "departments":
      return "Unit Kerja & OPD";
    case "kategori":
      return "Kategori Kendala";
    case "usermanagement":
      return "Manajemen Pengguna";
    case "report":
      return "Laporan & Survei CSAT";
    case "auditlogs":
      return "Log Audit SPBE";
    case "faq":
      return "Pusat Bantuan (FAQ)";
    default:
      return "Portal Helpdesk";
  }
});

const handleLogout = async () => {
  profileMenuOpen.value = false;
  const result = await Swal.fire({
    title: "Konfirmasi Logout",
    text: "Apakah Anda yakin ingin keluar dari sistem?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Logout",
    cancelButtonText: "Batal",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
  });

  if (result.isConfirmed) {
    try {
      await authStore.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
};
</script>