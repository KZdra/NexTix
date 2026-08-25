<template>
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left: Logo & Navigation Links -->
        <div class="flex items-center space-x-4 lg:space-x-8">
          <!-- Logo -->
          <router-link to="/home" class="flex items-center space-x-2.5 group">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <font-awesome-icon icon="fa-solid fa-headset" class="text-base" />
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-black tracking-tight text-gray-900 leading-none">
                Nex<span class="text-blue-600">Tix</span>
              </span>
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                Helpdesk Portal
              </span>
            </div>
          </router-link>

          <!-- Desktop Nav items -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link
              to="/home"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5"
              :class="$route.name === 'home' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'"
            >
              <font-awesome-icon icon="fa-solid fa-house" class="text-xs" />
              <span>Dashboard</span>
            </router-link>

            <router-link
              to="/ticket"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5"
              :class="$route.name === 'ticket' || $route.name === 'detailticket' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'"
            >
              <font-awesome-icon icon="fa-solid fa-ticket" class="text-xs" />
              <span>{{ isClient ? 'Tiket Saya' : 'Kelola Tiket' }}</span>
            </router-link>

            <router-link
              v-if="canAccessDepartment"
              to="/departments"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5"
              :class="$route.name === 'departments' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'"
            >
              <font-awesome-icon icon="fa-solid fa-building" class="text-xs" />
              <span>Departemen</span>
            </router-link>

            <router-link
              v-if="canAccessCategory"
              to="/kategori"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5"
              :class="$route.name === 'kategori' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'"
            >
              <font-awesome-icon icon="fa-solid fa-list-check" class="text-xs" />
              <span>Kategori</span>
            </router-link>

            <router-link
              v-if="canAccessReport"
              to="/report"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5"
              :class="$route.name === 'report' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'"
            >
              <font-awesome-icon icon="fa-solid fa-chart-line" class="text-xs" />
              <span>Laporan</span>
            </router-link>

            <router-link
              v-if="canAccessUserManagement"
              to="/manageuser"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5"
              :class="$route.name === 'usermanagement' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'"
            >
              <font-awesome-icon icon="fa-solid fa-users-gear" class="text-xs" />
              <span>Pengguna</span>
            </router-link>

            <router-link
              v-if="canAccessAuditLog"
              to="/audit-logs"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5"
              :class="$route.name === 'auditlogs' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'"
            >
              <font-awesome-icon icon="fa-solid fa-shield-halved" class="text-xs" />
              <span>Audit Log</span>
            </router-link>

            <router-link
              to="/faq"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5"
              :class="$route.name === 'faq' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'"
            >
              <font-awesome-icon icon="fa-solid fa-circle-question" class="text-xs" />
              <span>FAQ</span>
            </router-link>
          </div>
        </div>

        <!-- Right: User Info with Dropdown Menu & Mobile Toggle -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <template v-if="isLoggedIn">
            <!-- Profile Dropdown Menu Trigger -->
            <div class="relative" ref="profileDropdownRef">
              <button
                type="button"
                @click="profileMenuOpen = !profileMenuOpen"
                class="flex items-center space-x-2.5 py-1.5 px-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                :class="{ 'ring-2 ring-blue-500/20 border-blue-300 bg-blue-50/40': profileMenuOpen }"
                aria-expanded="profileMenuOpen"
              >
                <!-- Avatar -->
                <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white uppercase shadow-xs flex-shrink-0" :class="avatarBgClass">
                  {{ userInitial }}
                </div>
                
                <!-- Name & Role -->
                <div class="hidden sm:flex flex-col text-left">
                  <span class="text-xs font-bold text-gray-900 leading-tight truncate max-w-[110px]">
                    {{ authStore.user?.name || 'Pengguna' }}
                  </span>
                  <span class="text-[9px] font-semibold tracking-wider uppercase" :class="roleTextColorClass">
                    {{ roleLabel }}
                  </span>
                </div>

                <!-- Dropdown Arrow -->
                <font-awesome-icon
                  icon="fa-solid fa-chevron-down"
                  class="text-[10px] text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180 text-blue-600': profileMenuOpen }"
                />
              </button>

              <!-- Dropdown Content Card -->
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
                  <!-- Header: User info -->
                  <div class="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white uppercase shadow-xs" :class="avatarBgClass">
                        {{ userInitial }}
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-xs font-bold text-gray-900 truncate">{{ authStore.user?.name || 'Pengguna' }}</p>
                        <p class="text-[11px] text-gray-400 truncate">{{ authStore.user?.email || 'Akun Pengguna' }}</p>
                        <span class="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-white border border-gray-200" :class="roleTextColorClass">
                          {{ roleLabel }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Menu Links -->
                  <div class="p-1.5 space-y-0.5 text-xs">
                    <router-link
                      to="/home"
                      @click="profileMenuOpen = false"
                      class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                    >
                      <font-awesome-icon icon="fa-solid fa-house" class="text-gray-400 text-xs w-4" />
                      <span>Dashboard</span>
                    </router-link>

                    <router-link
                      to="/ticket"
                      @click="profileMenuOpen = false"
                      class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                    >
                      <font-awesome-icon icon="fa-solid fa-ticket" class="text-gray-400 text-xs w-4" />
                      <span>{{ isClient ? 'Tiket Saya' : 'Kelola Tiket' }}</span>
                    </router-link>

                    <router-link
                      v-if="canAccessDepartment"
                      to="/departments"
                      @click="profileMenuOpen = false"
                      class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                    >
                      <font-awesome-icon icon="fa-solid fa-building" class="text-gray-400 text-xs w-4" />
                      <span>Departemen / Unit OPD</span>
                    </router-link>

                    <router-link
                      v-if="canAccessAuditLog"
                      to="/audit-logs"
                      @click="profileMenuOpen = false"
                      class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                    >
                      <font-awesome-icon icon="fa-solid fa-shield-halved" class="text-gray-400 text-xs w-4" />
                      <span>Log Audit SPBE</span>
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

                  <!-- Logout Action -->
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
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            >
              Login
            </router-link>
          </template>

          <!-- Mobile Hamburger Menu Button -->
          <button
            @click="mobileNavOpen = !mobileNavOpen"
            class="md:hidden p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <font-awesome-icon :icon="mobileNavOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" class="text-base" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown Navigation Drawer -->
    <div v-show="mobileNavOpen" class="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
      <!-- User info card on mobile -->
      <div v-if="isLoggedIn" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-3">
        <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white uppercase shadow-xs" :class="avatarBgClass">
          {{ userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-bold text-gray-900 truncate">{{ authStore.user?.name || 'Pengguna' }}</div>
          <div class="text-[10px] font-semibold uppercase" :class="roleTextColorClass">{{ roleLabel }}</div>
        </div>
      </div>

      <router-link
        to="/home"
        @click="mobileNavOpen = false"
        class="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
        :class="$route.name === 'home' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'"
      >
        <font-awesome-icon icon="fa-solid fa-house" />
        <span>Dashboard</span>
      </router-link>

      <router-link
        to="/ticket"
        @click="mobileNavOpen = false"
        class="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
        :class="$route.name === 'ticket' || $route.name === 'detailticket' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'"
      >
        <font-awesome-icon icon="fa-solid fa-ticket" />
        <span>{{ isClient ? 'Tiket Saya' : 'Kelola Tiket' }}</span>
      </router-link>

      <router-link
        v-if="canAccessDepartment"
        to="/departments"
        @click="mobileNavOpen = false"
        class="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
        :class="$route.name === 'departments' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'"
      >
        <font-awesome-icon icon="fa-solid fa-building" />
        <span>Departemen / OPD</span>
      </router-link>

      <router-link
        v-if="canAccessCategory"
        to="/kategori"
        @click="mobileNavOpen = false"
        class="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
        :class="$route.name === 'kategori' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'"
      >
        <font-awesome-icon icon="fa-solid fa-list-check" />
        <span>Kategori</span>
      </router-link>

      <router-link
        v-if="canAccessReport"
        to="/report"
        @click="mobileNavOpen = false"
        class="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
        :class="$route.name === 'report' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'"
      >
        <font-awesome-icon icon="fa-solid fa-chart-line" />
        <span>Laporan</span>
      </router-link>

      <router-link
        v-if="canAccessUserManagement"
        to="/manageuser"
        @click="mobileNavOpen = false"
        class="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
        :class="$route.name === 'usermanagement' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'"
      >
        <font-awesome-icon icon="fa-solid fa-users-gear" />
        <span>Pengguna</span>
      </router-link>

      <router-link
        v-if="canAccessAuditLog"
        to="/audit-logs"
        @click="mobileNavOpen = false"
        class="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
        :class="$route.name === 'auditlogs' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'"
      >
        <font-awesome-icon icon="fa-solid fa-shield-halved" />
        <span>Audit Log</span>
      </router-link>

      <router-link
        to="/faq"
        @click="mobileNavOpen = false"
        class="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
        :class="$route.name === 'faq' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'"
      >
        <font-awesome-icon icon="fa-solid fa-circle-question" />
        <span>Pusat Bantuan / FAQ</span>
      </router-link>

      <div v-if="isLoggedIn" class="pt-2 border-t border-gray-100">
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" />
          <span>Logout dari Akun</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";

type UserRole = "admin" | "support" | "client";

const authStore = useAuthStore();
const route = useRoute();

const mobileNavOpen = ref(false);
const profileMenuOpen = ref(false);
const profileDropdownRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target as Node)) {
    profileMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});

const isLoggedIn = computed(() => authStore.isAuthenticated);
const userRole = computed(() => authStore.user?.role || "client");

const isClient = computed(() => userRole.value === "client");
const canAccessDepartment = computed(() => userRole.value === "admin");
const canAccessReport = computed(() => userRole.value === "admin");
const canAccessUserManagement = computed(() => userRole.value === "admin");
const canAccessCategory = computed(() => userRole.value === "admin");
const canAccessAuditLog = computed(() => userRole.value === "admin");

const userInitial = computed(() => {
  const name = authStore.user?.name || "U";
  return name.charAt(0).toUpperCase();
});

const roleLabel = computed(() => {
  switch (userRole.value) {
    case "admin":
      return "Admin";
    case "support":
      return "Teknisi / Support";
    case "client":
    default:
      return "User / Client";
  }
});

const roleTextColorClass = computed(() => {
  switch (userRole.value) {
    case "admin":
      return "text-purple-600";
    case "support":
      return "text-amber-600";
    case "client":
    default:
      return "text-blue-600";
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

const handleLogout = async () => {
  profileMenuOpen.value = false;
  mobileNavOpen.value = false;
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

<style scoped>
/* Scoped styles */
</style>
