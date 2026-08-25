<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="isOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
    ></div>

    <!-- Sidebar Container -->
    <aside
      class="fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800 shadow-2xl lg:shadow-none"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- 1. Logo & App Brand -->
      <div class="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
        <router-link to="/home" class="flex items-center space-x-3 group" @click="closeOnMobile">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <font-awesome-icon icon="fa-solid fa-headset" class="text-base" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-black tracking-tight text-white leading-none">
              Nex<span class="text-blue-500">Tix</span>
            </span>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
              Helpdesk SPBE
            </span>
          </div>
        </router-link>

        <!-- Close Button (Mobile Only) -->
        <button
          @click="closeSidebar"
          class="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Tutup Menu"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" class="text-lg" />
        </button>
      </div>

      <!-- 2. Navigation Menu Links -->
      <div class="flex-1 overflow-y-auto py-5 px-3.5 space-y-6 custom-scrollbar">
        <!-- Section: Menu Utama -->
        <div class="space-y-1">
          <div class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-300">
            Menu Utama
          </div>

          <router-link
            to="/home"
            @click="closeOnMobile"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group"
            :class="$route.name === 'home' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'"
          >
            <font-awesome-icon icon="fa-solid fa-house" class="w-4 text-xs" :class="$route.name === 'home' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'" />
            <span>Dashboard</span>
          </router-link>

          <router-link
            to="/ticket"
            @click="closeOnMobile"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group"
            :class="$route.name === 'ticket' || $route.name === 'detailticket' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'"
          >
            <font-awesome-icon icon="fa-solid fa-ticket" class="w-4 text-xs" :class="$route.name === 'ticket' || $route.name === 'detailticket' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'" />
            <span class="flex-1">{{ isClient ? 'Tiket Saya' : 'Kelola Tiket' }}</span>
          </router-link>
        </div>

        <!-- Section: Master Data & Tata Kelola (Admin Only) -->
        <div v-if="isAdmin" class="space-y-1">
          <div class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-300">
            Master Data & OPD
          </div>

          <router-link
            to="/departments"
            @click="closeOnMobile"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group"
            :class="$route.name === 'departments' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'"
          >
            <font-awesome-icon icon="fa-solid fa-building" class="w-4 text-xs" :class="$route.name === 'departments' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'" />
            <span>Unit Kerja / OPD</span>
          </router-link>

          <router-link
            to="/kategori"
            @click="closeOnMobile"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group"
            :class="$route.name === 'kategori' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'"
          >
            <font-awesome-icon icon="fa-solid fa-list-check" class="w-4 text-xs" :class="$route.name === 'kategori' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'" />
            <span>Kategori Kendala</span>
          </router-link>

          <router-link
            to="/manageuser"
            @click="closeOnMobile"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group"
            :class="$route.name === 'usermanagement' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'"
          >
            <font-awesome-icon icon="fa-solid fa-users-gear" class="w-4 text-xs" :class="$route.name === 'usermanagement' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'" />
            <span>Manajemen Pengguna</span>
          </router-link>
        </div>

        <!-- Section: Analitik & Kepatuhan Audit (Admin Only) -->
        <div v-if="isAdmin" class="space-y-1">
          <div class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-300">
            Laporan & Kepatuhan
          </div>

          <router-link
            to="/report"
            @click="closeOnMobile"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group"
            :class="$route.name === 'report' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'"
          >
            <font-awesome-icon icon="fa-solid fa-chart-line" class="w-4 text-xs" :class="$route.name === 'report' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'" />
            <span>Laporan & CSAT</span>
          </router-link>

          <router-link
            to="/audit-logs"
            @click="closeOnMobile"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group"
            :class="$route.name === 'auditlogs' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'"
          >
            <font-awesome-icon icon="fa-solid fa-shield-halved" class="w-4 text-xs" :class="$route.name === 'auditlogs' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'" />
            <span>Log Audit SPBE</span>
          </router-link>
        </div>

        <!-- Section: Bantuan & Informasi -->
        <div class="space-y-1">
          <div class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-300">
            Panduan & Bantuan
          </div>

          <router-link
            to="/faq"
            @click="closeOnMobile"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group"
            :class="$route.name === 'faq' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'"
          >
            <font-awesome-icon icon="fa-solid fa-circle-question" class="w-4 text-xs" :class="$route.name === 'faq' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'" />
            <span>Pusat Bantuan / FAQ</span>
          </router-link>
        </div>
      </div>

      <!-- 3. Bottom User Profile & Logout -->
      <div class="p-4 border-t border-slate-800 bg-slate-950/60">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 min-w-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white uppercase shadow-md flex-shrink-0" :class="avatarBgClass">
              {{ userInitial }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white truncate">{{ authStore.user?.name || 'Pengguna' }}</p>
              <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">{{ roleLabel }}</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Keluar"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" class="text-xs" />
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const authStore = useAuthStore();

const userRole = computed(() => authStore.user?.role || "client");
const isClient = computed(() => userRole.value === "client");
const isAdmin = computed(() => userRole.value === "admin");

const userInitial = computed(() => {
  const name = authStore.user?.name || "U";
  return name.charAt(0).toUpperCase();
});

const roleLabel = computed(() => {
  switch (userRole.value) {
    case "admin":
      return "Admin";
    case "support":
      return "Teknisi";
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

const closeSidebar = () => {
  emit("close");
};

const closeOnMobile = () => {
  if (window.innerWidth < 1024) {
    emit("close");
  }
};

const handleLogout = async () => {
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
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.4);
}
</style>
