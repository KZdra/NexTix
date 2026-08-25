<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-8 pb-12">
      <!-- 1. Hero / Welcome Banner -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
        <!-- Background decorative shapes -->
        <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute right-24 top-0 w-32 h-32 bg-blue-400/20 rounded-full blur-xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold tracking-wide text-blue-100">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Portal Helpdesk NexTix</span>
              <span class="text-white/40">•</span>
              <span class="capitalize">{{ roleTitle }}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Halo, {{ authStore.user?.name || 'Pengguna' }}! 👋
            </h1>
            <p class="text-blue-100/90 text-sm sm:text-base leading-relaxed">
              <template v-if="isClient">
                Ada kendala teknis atau pertanyaan operasional? Ajukan tiket pengaduan sekarang dan pantau proses penyelesaiannya secara real-time.
              </template>
              <template v-else-if="isSupport">
                Pantau antrean tiket masuk, tindak lanjuti keluhan pengguna, dan pastikan setiap kendala terselesaikan tepat waktu.
              </template>
              <template v-else>
                Pusat kendali dan monitoring seluruh aktivitas tiket helpdesk, performa penanganan, dan manajemen pengguna.
              </template>
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-3">
            <button
              v-if="isClient"
              @click="openTicketDialog"
              class="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-lg shadow-black/10 hover:bg-blue-50 active:scale-95 transition-all duration-150"
            >
              <font-awesome-icon icon="fa-solid fa-circle-plus" class="text-base text-blue-600" />
              <span>Ajukan Tiket Baru</span>
            </button>
            <router-link
              to="/ticket"
              class="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold text-sm border border-white/20 active:scale-95 transition-all duration-150"
            >
              <font-awesome-icon icon="fa-solid fa-list" class="text-xs" />
              <span>{{ isClient ? 'Semua Tiket Saya' : 'Kelola Tiket' }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 2. Statistics Metric Cards -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-bold text-gray-900">
              {{ isClient ? 'Ringkasan Tiket Anda' : 'Ringkasan Statistik Sistem' }}
            </h2>
            <p class="text-xs text-gray-500">
              {{ isClient ? 'Status penanganan tiket yang telah Anda ajukan' : 'Ikhtisar seluruh tiket dan aktivitas helpdesk saat ini' }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Open Tickets -->
          <div class="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Menunggu Respon</span>
              <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <font-awesome-icon icon="fa-solid fa-clock" class="text-sm" />
              </div>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
              <span class="text-3xl font-black text-gray-900">
                {{ statisticStore.ticketStats.open ?? 0 }}
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                Status Open
              </span>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              {{ isClient ? 'Tiket baru Anda yang menunggu penugasan' : 'Tiket baru yang belum ditangani' }}
            </p>
          </div>

          <!-- Card 2: In Progress Tickets -->
          <div class="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Sedang Diproses</span>
              <div class="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <font-awesome-icon icon="fa-solid fa-spinner" class="text-sm animate-spin" style="animation-duration: 4s;" />
              </div>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
              <span class="text-3xl font-black text-gray-900">
                {{ statisticStore.ticketStats.in_progress ?? 0 }}
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700">
                In Progress
              </span>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              {{ isClient ? 'Tiket Anda yang sedang dikerjakan teknisi' : 'Tiket yang dalam proses penanganan' }}
            </p>
          </div>

          <!-- Card 3: Closed Tickets -->
          <div class="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Terselesaikan</span>
              <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <font-awesome-icon icon="fa-solid fa-circle-check" class="text-sm" />
              </div>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
              <span class="text-3xl font-black text-gray-900">
                {{ statisticStore.ticketStats.closed ?? 0 }}
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                Closed
              </span>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              {{ isClient ? 'Tiket Anda yang sudah tuntas' : 'Tiket yang telah berhasil diselesaikan' }}
            </p>
          </div>

          <!-- Card 4: Total Tickets or Registered Users -->
          <div class="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-purple-600">
                {{ isAdmin ? 'Total Pengguna' : 'Total Tiket' }}
              </span>
              <div class="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <font-awesome-icon :icon="isAdmin ? 'fa-solid fa-users' : 'fa-solid fa-ticket'" class="text-sm" />
              </div>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
              <span class="text-3xl font-black text-gray-900">
                <template v-if="isAdmin">
                  {{ statisticStore.userStats.UserRegistered ?? 0 }}
                </template>
                <template v-else>
                  {{ totalTicketsCount }}
                </template>
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700">
                {{ isAdmin ? 'Terdaftar' : 'Semua Tiket' }}
              </span>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              {{ isAdmin ? 'Total akun pengguna aktif di sistem' : 'Akumulasi seluruh tiket yang tercatat' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 3. Recent Tickets Section -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <font-awesome-icon icon="fa-solid fa-clock-rotate-left" class="text-blue-600 text-base" />
              <span>{{ isClient ? 'Tiket Terkini Anda' : 'Tiket Masuk Terkini' }}</span>
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ isClient ? 'Pantau progres pengaduan dan tanggapan terbaru dari teknisi' : '5 tiket terbaru yang membutuhkan tindak lanjut' }}
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <button
              v-if="isClient"
              @click="openTicketDialog"
              class="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <font-awesome-icon icon="fa-solid fa-plus" />
              <span>Buat Tiket</span>
            </button>
            <router-link
              to="/ticket"
              class="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              <span>Lihat Semua</span>
              <font-awesome-icon icon="fa-solid fa-arrow-right" class="text-[10px]" />
            </router-link>
          </div>
        </div>

        <!-- Recent Tickets Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-left text-sm" v-if="recentTickets.length > 0">
            <thead class="bg-gray-50/75 text-gray-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">No. Tiket</th>
                <th class="px-6 py-3.5">Subjek / Masalah</th>
                <th class="px-6 py-3.5">Kategori</th>
                <th class="px-6 py-3.5">Prioritas</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5" v-if="!isClient">Pelapor</th>
                <th class="px-6 py-3.5">Teknisi</th>
                <th class="px-6 py-3.5">Waktu</th>
                <th class="px-6 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="ticket in recentTickets"
                :key="ticket.id"
                class="hover:bg-blue-50/40 transition-colors"
              >
                <!-- Ticket Number -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200/60">
                    #{{ ticket.ticket_number }}
                  </span>
                </td>

                <!-- Subject -->
                <td class="px-6 py-4 max-w-xs truncate">
                  <span class="font-semibold text-gray-900 block truncate" :title="ticket.subject">
                    {{ ticket.subject }}
                  </span>
                  <span class="text-xs text-gray-500 block truncate" :title="ticket.issue">
                    {{ ticket.issue }}
                  </span>
                </td>

                <!-- Category -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    {{ ticket.kategori_name || '-' }}
                  </span>
                </td>

                <!-- Priority -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-red-50 text-red-700 border-red-200': ticket.priority === 'Critical' || ticket.priority === 'Block',
                      'bg-amber-50 text-amber-700 border-amber-200': ticket.priority === 'Major',
                      'bg-blue-50 text-blue-700 border-blue-200': ticket.priority === 'Normal',
                      'bg-emerald-50 text-emerald-700 border-emerald-200': ticket.priority === 'Minor' || ticket.priority === 'Trivial',
                    }"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border"
                  >
                    <PriorityIcon :props="ticket.priority" />
                    <span>{{ ticket.priority || 'Normal' }}</span>
                  </span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-blue-100/80 text-blue-800 border-blue-300': ticket.status === 'open',
                      'bg-amber-100/80 text-amber-800 border-amber-300': ticket.status === 'in_progress',
                      'bg-emerald-100/80 text-emerald-800 border-emerald-300': ticket.status === 'closed',
                    }"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="{
                      'bg-blue-600': ticket.status === 'open',
                      'bg-amber-600': ticket.status === 'in_progress',
                      'bg-emerald-600': ticket.status === 'closed'
                    }"></span>
                    <span>{{ formatStatus(ticket.status) }}</span>
                  </span>
                </td>

                <!-- Pelapor (if admin/support) -->
                <td class="px-6 py-4 whitespace-nowrap" v-if="!isClient">
                  <span class="text-xs font-medium text-gray-700">{{ ticket.clientname || '-' }}</span>
                </td>

                <!-- Assigned to -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                    <font-awesome-icon icon="fa-solid fa-user-gear" class="text-gray-400 text-xs" />
                    {{ ticket.assign_by || 'Belum ditugaskan' }}
                  </span>
                </td>

                <!-- Date -->
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                  {{ ticket.created_at }}
                </td>

                <!-- Action -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <router-link
                    :to="{ name: 'detailticket', params: { ticketNumber: ticket.ticket_number } }"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-all"
                  >
                    <font-awesome-icon icon="fa-solid fa-eye" class="text-xs" />
                    <span>Lihat</span>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-else class="py-12 px-6 text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center text-2xl">
              <font-awesome-icon icon="fa-solid fa-inbox" />
            </div>
            <div class="max-w-sm mx-auto">
              <h3 class="text-base font-bold text-gray-900">Belum Ada Tiket yang Tercatat</h3>
              <p class="text-xs text-gray-500 mt-1">
                {{ isClient ? 'Anda belum memiliki tiket keluhan. Jika mengalami kendala teknis, silakan ajukan tiket baru.' : 'Saat ini belum ada data tiket terbaru di sistem.' }}
              </p>
            </div>
            <button
              v-if="isClient"
              @click="openTicketDialog"
              class="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <font-awesome-icon icon="fa-solid fa-plus" />
              <span>Buat Tiket Pertama</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Quick Helpdesk Information & Workflow Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Step Guide -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div class="flex items-center space-x-3 text-blue-600">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg">
              <font-awesome-icon icon="fa-solid fa-diagram-project" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-sm">Alur Penanganan Tiket</h3>
              <span class="text-[11px] text-gray-500">3 langkah mudah</span>
            </div>
          </div>
          <div class="space-y-3 pt-2 text-xs text-gray-600">
            <div class="flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">1</span>
              <div>
                <strong class="text-gray-800">Ajukan Keluhan:</strong> Isi detail subjek, pilih kategori, prioritas, dan lampirkan bukti kendala.
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">2</span>
              <div>
                <strong class="text-gray-800">Diproses Teknisi:</strong> Tim support menganalisis dan berkomunikasi via percakapan tiket.
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">3</span>
              <div>
                <strong class="text-gray-800">Selesai (Closed):</strong> Masalah terselesaikan dan Anda dapat melihat catatan solusinya.
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Shortcut -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <div class="flex items-center space-x-3 text-indigo-600">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">
                <font-awesome-icon icon="fa-solid fa-circle-question" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-sm">Pusat Bantuan & FAQ</h3>
                <span class="text-[11px] text-gray-500">Solusi instan kendala umum</span>
              </div>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">
              Sebelum mengajukan tiket, Anda dapat memeriksa halaman FAQ kami untuk panduan cepat mengenai error sistem, reset akses, dan informasi teknis lainnya.
            </p>
          </div>
          <div>
            <router-link
              to="/faq"
              class="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <span>Buka Halaman FAQ</span>
              <font-awesome-icon icon="fa-solid fa-arrow-right" class="text-[10px]" />
            </router-link>
          </div>
        </div>

        <!-- Priority Guide -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div class="flex items-center space-x-3 text-amber-600">
            <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-lg">
              <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-sm">Pedoman Tingkat Prioritas</h3>
              <span class="text-[11px] text-gray-500">Pilih prioritas yang sesuai</span>
            </div>
          </div>
          <div class="space-y-2 pt-1 text-xs text-gray-600">
            <div class="flex items-center justify-between p-2 rounded-lg bg-red-50/70 border border-red-100">
              <span class="font-bold text-red-700">Critical / Block</span>
              <span class="text-[11px] text-red-600">Sistem mati total / terhenti</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 border border-amber-100">
              <span class="font-bold text-amber-700">Major</span>
              <span class="text-[11px] text-amber-600">Fitur utama terganggu</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 border border-blue-100">
              <span class="font-bold text-blue-700">Normal</span>
              <span class="text-[11px] text-blue-600">Kendala operasional umum</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Ticket Create Dialog Modal -->
    <el-dialog
      v-model="dialogFormVisible"
      title="Ajukan Tiket Bantuan Baru"
      width="580px"
      align-center
      destroy-on-close
      class="rounded-2xl"
    >
      <template #header>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <font-awesome-icon icon="fa-solid fa-ticket" class="text-base" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900">Form Pengajuan Tiket Bantuan</h3>
            <p class="text-xs text-gray-500">Jelaskan kendala dengan detail agar tim teknisi dapat segera membantu</p>
          </div>
        </div>
      </template>

      <el-form :model="form" label-position="top" class="space-y-3 pt-1">
        <el-form-item label="Judul / Subjek Kendala" required class="!mb-2.5">
          <el-input
            v-model="form.subject"
            placeholder="Contoh: Error koneksi printer & aplikasi dinas"
            size="large"
          />
        </el-form-item>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 !mb-2.5">
          <el-form-item label="Kategori Kendala" required class="!mb-0">
            <el-select
              v-model="form.kategori_id"
              placeholder="Pilih Kategori"
              class="w-full"
              size="large"
            >
              <el-option
                v-for="category in kategoriStore.kategoris"
                :key="category.id"
                :label="category.nama_kategori"
                :value="category.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Tingkat Prioritas" required class="!mb-0">
            <el-select
              v-model="form.priority_id"
              placeholder="Pilih Prioritas"
              class="w-full"
              size="large"
            >
              <el-option
                v-for="p in priorityStore.priority"
                :key="p.id"
                :label="p.priority_name"
                :value="p.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 !mb-2.5">
          <el-form-item label="Tipe Pengajuan (ITIL)" class="!mb-0">
            <el-select v-model="form.ticket_type" class="w-full" size="large">
              <el-option label="Incident (Kendala)" value="incident" />
              <el-option label="Permintaan Layanan" value="service_request" />
              <el-option label="Change Request" value="change_request" />
            </el-select>
          </el-form-item>

          <el-form-item label="Unit OPD (Opsional)" class="!mb-0">
            <el-select v-model="form.department_id" placeholder="Pilih OPD / Unit" class="w-full" size="large" clearable>
              <el-option
                v-for="dept in departmentStore.activeDepartments"
                :key="dept.id"
                :label="dept.code + ' - ' + dept.name"
                :value="dept.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="Deskripsi Detail Masalah" required class="!mb-2.5">
          <el-input
            v-model="form.issue"
            type="textarea"
            :rows="3"
            placeholder="Tuliskan kronologi error, pesan error yang muncul, atau rincian masalah..."
          />
        </el-form-item>

        <el-form-item label="Lampiran / Bukti Screenshot (Opsional)" class="!mb-0">
          <div class="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-3 transition-colors text-center cursor-pointer bg-gray-50 hover:bg-blue-50/40 relative">
            <input
              type="file"
              @change="handleFileUpload"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div class="space-y-0.5">
              <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" class="text-xl text-blue-500" />
              <div class="text-xs font-semibold text-gray-700">
                {{ selectedFileName || 'Klik atau tarik file gambar / dokumen ke sini' }}
              </div>
              <p class="text-[10px] text-gray-400">PNG, JPG, PDF (Maks. 5MB)</p>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <el-button @click="dialogFormVisible = false" size="large">Batal</el-button>
          <el-button
            type="primary"
            @click="handleSubmitTicket"
            :loading="submitting"
            size="large"
            class="bg-blue-600 hover:bg-blue-700"
          >
            Kirim Tiket
          </el-button>
        </div>
      </template>
    </el-dialog>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import PriorityIcon from "@/components/PriorityIcon.vue";
import { useAuthStore } from "@/stores/authStore";
import { useStatisticStore } from "@/stores/statisticStore";
import { useTicketStore } from "@/stores/ticketStore";
import { useKategoriStore } from "@/stores/kategoriStore";
import { usePriorityStore } from "@/stores/priorityStore";
import { useDepartmentStore } from "@/stores/departmentStore";
import { computed, onMounted, ref, reactive } from "vue";
import { ElNotification } from "element-plus";

type UserRole = "admin" | "support" | "client";

const authStore = useAuthStore();
const statisticStore = useStatisticStore();
const ticketStore = useTicketStore();
const kategoriStore = useKategoriStore();
const priorityStore = usePriorityStore();
const departmentStore = useDepartmentStore();

const userRole = computed<UserRole>(() => (authStore.user?.role as UserRole) || "client");
const isClient = computed(() => userRole.value === "client");
const isSupport = computed(() => userRole.value === "support");
const isAdmin = computed(() => userRole.value === "admin");

const roleTitle = computed(() => {
  switch (userRole.value) {
    case "admin":
      return "Administrator";
    case "support":
      return "Teknisi Helpdesk";
    case "client":
    default:
      return "Klien / Pengguna";
  }
});

const loading = ref(false);
const submitting = ref(false);
const dialogFormVisible = ref(false);
const selectedFileName = ref("");

const form = reactive({
  subject: "",
  issue: "",
  kategori_id: 1,
  priority_id: 1,
  department_id: null as number | null,
  ticket_type: "incident",
  attachment: null as File | null,
});

const totalTicketsCount = computed(() => {
  const open = statisticStore.ticketStats.open || 0;
  const inProg = statisticStore.ticketStats.in_progress || 0;
  const closed = statisticStore.ticketStats.closed || 0;
  return open + inProg + closed;
});

const recentTickets = computed(() => {
  const tickets = ticketStore.tickets || [];
  return tickets.slice(0, 5);
});

onMounted(async () => {
  loading.value = true;
  try {
    if (authStore.token && !authStore.isAuthenticated) {
      await authStore.refreshToken();
    }
    
    // Fetch stats
    if (isAdmin.value) {
      await statisticStore.fetchTicketStats();
      await statisticStore.fetchUsersStats();
      await ticketStore.fetchTickets();
    } else if (isSupport.value) {
      await statisticStore.fetchTicketStats();
      await ticketStore.fetchTickets();
    } else {
      await statisticStore.fetchTicketStatsPerUser();
      await ticketStore.fetchUserTickets();
    }

    await Promise.all([
      priorityStore.fetchPriority(),
      kategoriStore.fetchActiveKategoris(),
      departmentStore.fetchActiveDepartments(),
    ]);
  } catch (error) {
    console.error("Dashboard error:", error);
  } finally {
    loading.value = false;
  }
});

const formatStatus = (status: string) => {
  switch (status) {
    case "open":
      return "Open";
    case "in_progress":
      return "In Progress";
    case "closed":
      return "Closed";
    default:
      return status;
  }
};

const openTicketDialog = async () => {
  if (kategoriStore.kategoris.length === 0) {
    await kategoriStore.fetchActiveKategoris();
  }
  if (priorityStore.priority.length === 0) {
    await priorityStore.fetchPriority();
  }
  if (departmentStore.activeDepartments.length === 0) {
    await departmentStore.fetchActiveDepartments();
  }
  if (kategoriStore.kategoris.length > 0) {
    form.kategori_id = kategoriStore.kategoris[0].id;
  }
  if (priorityStore.priority.length > 0) {
    form.priority_id = priorityStore.priority[0].id;
  }
  form.department_id = null;
  form.ticket_type = "incident";
  dialogFormVisible.value = true;
};

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    form.attachment = file;
    selectedFileName.value = file.name;
  }
};

const handleSubmitTicket = async () => {
  if (!form.subject.trim()) {
    ElNotification({
      title: "Peringatan",
      message: "Silakan isi judul/subjek kendala terlebih dahulu",
      type: "warning",
    });
    return;
  }

  if (!form.issue.trim()) {
    ElNotification({
      title: "Peringatan",
      message: "Silakan isi deskripsi kendala yang dialami",
      type: "warning",
    });
    return;
  }

  submitting.value = true;
  try {
    await ticketStore.addTicket(
      form.issue,
      form.subject,
      form.kategori_id,
      form.priority_id,
      form.attachment || undefined,
      form.department_id || undefined,
      form.ticket_type
    );

    ElNotification({
      title: "Berhasil Diajukan!",
      message: "Tiket pengaduan Anda berhasil dibuat dan telah masuk antrean teknisi.",
      type: "success",
    });

    // Reset Form
    form.subject = "";
    form.issue = "";
    form.department_id = null;
    form.ticket_type = "incident";
    form.attachment = null;
    selectedFileName.value = "";
    dialogFormVisible.value = false;

    // Refresh Data
    if (isClient.value) {
      await statisticStore.fetchTicketStatsPerUser();
      await ticketStore.fetchUserTickets();
    } else {
      await statisticStore.fetchTicketStats();
      await ticketStore.fetchTickets();
    }
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* Element UI customizations */
:deep(.el-dialog) {
  border-radius: 1rem !important;
  overflow: hidden;
}
:deep(.el-dialog__header) {
  padding: 1.25rem 1.5rem 1rem 1.5rem;
  margin-right: 0;
  border-bottom: 1px solid #f3f4f6;
}
:deep(.el-dialog__body) {
  padding: 1.25rem 1.5rem;
}
:deep(.el-form-item__label) {
  font-size: 0.8125rem !important;
  font-weight: 600 !important;
  color: #374151 !important;
  padding-bottom: 4px !important;
}
</style>

