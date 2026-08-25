<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6 pb-12">
      <!-- 1. Top Navigation Bar & Stepper -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div class="flex items-center space-x-3">
            <button
              @click="goBack"
              class="w-10 h-10 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-150"
              title="Kembali ke daftar tiket"
            >
              <font-awesome-icon icon="fa-solid fa-arrow-left" class="text-sm" />
            </button>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60">
                  #{{ ticket.ticket_number || ticketNumber }}
                </span>
                <span class="text-xs text-gray-400">•</span>
                <span class="text-xs text-gray-500">{{ ticket.created_at }}</span>
              </div>
              <h1 class="text-xl font-bold text-gray-900 mt-1">
                {{ ticket.subject || 'Detail Tiket Pengaduan' }}
              </h1>
            </div>
          </div>
        <!-- Status & SLA Pill Header -->
        <div class="flex flex-wrap items-center gap-3">
          <SlaBadge
            :response-due-at="ticket.response_due_at"
            :resolution-due-at="ticket.resolution_due_at"
            :first-responded-at="ticket.first_responded_at"
            :resolved-at="ticket.resolved_at"
            :is-sla-breached="ticket.is_sla_breached"
            :status="ticket.status"
          />

          <!-- BAPP PDF Export Button (When Closed) -->
          <button
            v-if="ticket.status === 'closed'"
            @click="ticketStore.downloadBAP(ticket.ticket_number)"
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
            title="Unduh Berita Acara Penyelesaian Pekerjaan resmi"
          >
            <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-rose-400" />
            <span>Cetak Berita Acara (BAPP)</span>
          </button>

          <span
            :class="{
              'bg-blue-100/80 text-blue-800 border-blue-300': ticket.status === 'open',
              'bg-amber-100/80 text-amber-800 border-amber-300': ticket.status === 'in_progress',
              'bg-emerald-100/80 text-emerald-800 border-emerald-300': ticket.status === 'closed',
            }"
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs"
          >
            <span class="w-2 h-2 rounded-full" :class="{
              'bg-blue-600 animate-pulse': ticket.status === 'open',
              'bg-amber-600 animate-pulse': ticket.status === 'in_progress',
              'bg-emerald-600': ticket.status === 'closed'
            }"></span>
            <span>Status: {{ formatStatus(ticket.status) }}</span>
          </span>
        </div>
      </div>

      <!-- Rating Banner for Closed Ticket (CSAT) -->
      <div v-if="ticket.status === 'closed'" class="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <font-awesome-icon icon="fa-solid fa-star" class="text-lg" />
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-bold text-gray-900">
              {{ hasRating ? 'Penilaian Layanan Pelapor' : (isClientUser ? 'Bagikan Kepuasan Layanan Anda' : 'Survei Kepuasan Pelapor (CSAT)') }}
            </h4>
            <p class="text-[11px] text-gray-600">
              {{ hasRating ? 'Ulasan kepuasan telah diterima untuk evaluasi mutu layanan helpdesk.' : (isClientUser ? 'Beri bintang 1-5 dan masukan untuk mengukur Indeks Kepuasan Pengguna (IKM).' : 'Pelapor belum mengisi survei kepuasan untuk tiket ini.') }}
            </p>
          </div>
        </div>

        <div v-if="hasRating" class="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
          <span class="text-xs font-bold text-amber-700">Skor:</span>
          <div class="flex text-amber-400 text-sm">
            <font-awesome-icon
              v-for="star in 5"
              :key="star"
              :icon="star <= (ratingStore.currentRating?.rating || 0) ? 'fa-solid fa-star' : 'fa-regular fa-star'"
            />
          </div>
        </div>
        <button
          v-else-if="isClientUser"
          @click="openRatingDialog"
          class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-star" />
          <span>Beri Nilai Tiket</span>
        </button>
        <span
          v-else
          class="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl"
        >
          Belum Diisi Pelapor
        </span>
      </div>

      <!-- Visual Progress Stepper -->
      <div class="grid grid-cols-3 gap-2 sm:gap-4 pt-1">
        <!-- Step 1: Open -->
        <div
          class="flex items-center p-3 sm:p-4 rounded-xl border transition-all"
          :class="ticket.status === 'open' ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20' : 'bg-gray-50/60 border-gray-200 opacity-80'"
        >
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0"
            :class="ticket.status === 'open' || ticket.status === 'in_progress' || ticket.status === 'closed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
          >
            1
          </div>
          <div class="min-w-0">
            <h4 class="text-xs sm:text-sm font-bold text-gray-900 truncate">1. Menunggu</h4>
            <p class="text-[11px] text-gray-500 hidden sm:block truncate">Tiket diajukan & masuk antrean</p>
          </div>
        </div>

        <!-- Step 2: In Progress -->
        <div
          class="flex items-center p-3 sm:p-4 rounded-xl border transition-all"
          :class="ticket.status === 'in_progress' ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20' : (ticket.status === 'closed' ? 'bg-gray-50/60 border-gray-200' : 'bg-gray-50/40 border-gray-200 opacity-60')"
        >
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0"
            :class="ticket.status === 'in_progress' || ticket.status === 'closed' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'"
          >
            2
          </div>
          <div class="min-w-0">
            <h4 class="text-xs sm:text-sm font-bold text-gray-900 truncate">2. Sedang Dikerjakan</h4>
            <p class="text-[11px] text-gray-500 hidden sm:block truncate">Teknisi memproses solusi</p>
          </div>
        </div>

        <!-- Step 3: Closed -->
        <div
          class="flex items-center p-3 sm:p-4 rounded-xl border transition-all"
          :class="ticket.status === 'closed' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-gray-50/40 border-gray-200 opacity-60'"
        >
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0"
            :class="ticket.status === 'closed' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'"
          >
            <font-awesome-icon icon="fa-solid fa-check" />
          </div>
          <div class="min-w-0">
            <h4 class="text-xs sm:text-sm font-bold text-gray-900 truncate">3. Selesai (Closed)</h4>
            <p class="text-[11px] text-gray-500 hidden sm:block truncate">Solusi telah dituntaskan</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left: Ticket Details & Comments Thread (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Issue Card -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              <font-awesome-icon icon="fa-solid fa-file-lines" class="text-blue-600" />
              <span>Deskripsi Kendala yang Dilaporkan</span>
            </h3>
            <span class="text-xs text-gray-500">Pelapor: <strong class="text-gray-800">{{ ticket.client_name || 'Pengguna' }}</strong></span>
          </div>

          <!-- Issue Body -->
          <div class="bg-gray-50/75 p-4 rounded-xl border border-gray-200/80 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {{ ticket.issue || 'Tidak ada deskripsi rinci.' }}
          </div>

          <!-- Attachment Section -->
          <div v-if="ticket.attachment_url || ticket.attachment_name" class="pt-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Lampiran Berkas:</h4>
            <div v-if="isImage(ticket.attachment_name)" class="space-y-3">
              <div class="max-w-md border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50">
                <el-image
                  class="w-full h-auto object-cover max-h-72"
                  :src="ticket.attachment_url"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="[ticket.attachment_url]"
                  fit="contain"
                />
              </div>
              <button
                @click="ticketStore.downloadAttachment(ticketNumber)"
                class="inline-flex items-center space-x-2 px-3.5 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <font-awesome-icon icon="fa-solid fa-download" />
                <span>Unduh Gambar ({{ ticket.attachment_name }})</span>
              </button>
            </div>
            <div v-else>
              <button
                @click="ticketStore.downloadAttachment(ticketNumber)"
                class="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <font-awesome-icon icon="fa-solid fa-paperclip" class="text-blue-500" />
                <span>Unduh Berkas Lampiran ({{ ticket.attachment_name }})</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Discussion Thread Card -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <font-awesome-icon icon="fa-solid fa-comments" class="text-blue-600" />
              <span>Diskusi & Catatan Penanganan</span>
            </h3>
            <span class="text-xs text-gray-400 font-semibold">{{ commentStore.comments.length }} Tanggapan</span>
          </div>

          <!-- Comment List -->
          <div class="space-y-4">
            <div
              v-for="comment in commentStore.comments"
              :key="comment.id"
              class="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors space-y-2.5"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2.5">
                  <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs">
                    {{ (comment.user_name || 'U').charAt(0) }}
                  </div>
                  <div>
                    <span class="text-xs font-bold text-gray-900">{{ comment.user_name }}</span>
                  </div>
                </div>
                <span class="text-[11px] text-gray-400">{{ formatDate(comment.created_at) }}</span>
              </div>

              <p class="text-xs text-gray-700 whitespace-pre-line pl-9">
                {{ comment.comment }}
              </p>

              <!-- Comment Attachment Badge & Preview -->
              <div v-if="comment.attachment || comment.attachment_url" class="pl-9 pt-1.5 space-y-2">
                <div class="inline-flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-200 shadow-xs max-w-md">
                  <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs flex-shrink-0">
                    <font-awesome-icon :icon="isCommentImage(comment.attachment || comment.attachment_url) ? 'fa-solid fa-image' : 'fa-solid fa-file'" />
                  </div>
                  <div class="flex-1 min-w-0 pr-2">
                    <p class="text-xs font-bold text-gray-800 truncate" :title="comment.attachment || 'Lampiran Berkas'">
                      {{ getFileName(comment.attachment || comment.attachment_url) }}
                    </p>
                    <span class="text-[10px] text-gray-400 block">Lampiran pesan</span>
                  </div>
                  <button
                    type="button"
                    @click="commentStore.downloadCommentAttachment(comment.id)"
                    class="px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-all flex items-center gap-1.5 flex-shrink-0"
                  >
                    <font-awesome-icon icon="fa-solid fa-download" class="text-[11px]" />
                    <span>Unduh</span>
                  </button>
                </div>

                <!-- Image Preview (if image) -->
                <div
                  v-if="isCommentImage(comment.attachment || comment.attachment_url)"
                  class="max-w-xs rounded-xl overflow-hidden border border-gray-200 shadow-xs bg-gray-100"
                >
                  <el-image
                    class="w-full h-auto object-cover max-h-52"
                    :src="comment.attachment_url || getImageUrl(comment.attachment)"
                    :preview-src-list="[comment.attachment_url || getImageUrl(comment.attachment)]"
                    fit="contain"
                  >
                    <template #error>
                      <div class="p-3 text-[11px] text-gray-500 text-center bg-gray-50 flex items-center justify-center gap-1.5">
                        <font-awesome-icon icon="fa-solid fa-circle-info" class="text-blue-500" />
                        <span>Klik tombol <strong>Unduh</strong> untuk melihat berkas gambar</span>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
            </div>

            <!-- Empty comments state -->
            <div v-if="commentStore.comments.length === 0" class="py-8 text-center text-gray-400 space-y-1">
              <font-awesome-icon icon="fa-regular fa-comment-dots" class="text-3xl" />
              <p class="text-xs font-medium">Belum ada diskusi pada tiket ini.</p>
            </div>
          </div>

          <!-- Quick Reply Prompts / Templates -->
          <div class="pt-2">
            <span class="text-[11px] font-semibold text-gray-500 block mb-1.5">⚡ Respon Cepat:</span>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(tpl, idx) in quickTemplates"
                :key="idx"
                @click="insertQuickTemplate(tpl)"
                class="text-[11px] px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 rounded-lg border border-gray-200 transition-colors text-left"
              >
                "{{ tpl }}"
              </button>
            </div>
          </div>

          <!-- Add Comment Form -->
          <div class="pt-4 border-t border-gray-100 space-y-3">
            <h4 class="text-xs font-bold text-gray-800">Tulis Tanggapan / Balasan</h4>
            <textarea
              v-model="newComment"
              rows="3"
              placeholder="Tuliskan pesan, rincian solusi teknis, atau pertanyaan lanjutan di sini..."
              class="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 hover:bg-white transition-colors"
            ></textarea>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div class="flex items-center space-x-2">
                <label class="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200">
                  <font-awesome-icon icon="fa-solid fa-paperclip" class="text-blue-600" />
                  <span>{{ commentFileName || 'Lampirkan Berkas' }}</span>
                  <input type="file" @change="handleFileChange" class="hidden" />
                </label>
                <button
                  v-if="commentFileName"
                  @click="clearCommentFile"
                  class="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Hapus
                </button>
              </div>

              <button
                @click="addComment"
                :disabled="(!newComment.trim() && !attachment) || sendingComment"
                class="inline-flex items-center justify-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold shadow-sm transition-all"
              >
                <font-awesome-icon icon="fa-solid fa-paper-plane" />
                <span>{{ sendingComment ? 'Mengirim...' : 'Kirim Tanggapan' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Actions & Assignment Info Card (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <!-- 1. Quick Handling Action Panel -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <font-awesome-icon icon="fa-solid fa-sliders" class="text-blue-600" />
              <span>Kontrol Penanganan Tiket</span>
            </h3>
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {{ canEditStatus ? 'Akses Teknisi' : 'Akses Pelapor' }}
            </span>
          </div>

          <!-- One-Click Quick Workflow Action Card (Admin & Support Only) -->
          <div class="space-y-2" v-if="canEditStatus">
            <!-- Action for Open Ticket: Start Working -->
            <button
              v-if="ticket.status === 'open'"
              @click="quickUpdateStatus('in_progress')"
              :disabled="updatingStatus"
              class="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <font-awesome-icon icon="fa-solid fa-play" />
              <span>Mulai Kerjakan (Set In Progress)</span>
            </button>

            <!-- Action for In Progress: Resolve & Close -->
            <button
              v-if="ticket.status === 'in_progress'"
              @click="openResolutionModal"
              :disabled="updatingStatus"
              class="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <font-awesome-icon icon="fa-solid fa-circle-check" />
              <span>Selesaikan Tiket (Closed)</span>
            </button>

            <!-- Action for Closed: Re-open if issue persists -->
            <button
              v-if="ticket.status === 'closed'"
              @click="quickUpdateStatus('in_progress')"
              :disabled="updatingStatus"
              class="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2 border border-gray-300"
            >
              <font-awesome-icon icon="fa-solid fa-rotate-left" />
              <span>Buka Kembali Tiket (Re-open)</span>
            </button>
          </div>

          <!-- Informative Status Box for Client (Client cannot change status) -->
          <div v-else class="p-4 rounded-xl border bg-slate-50 border-slate-200 space-y-2 text-xs">
            <div class="flex items-center space-x-2 font-bold text-gray-900">
              <font-awesome-icon icon="fa-solid fa-circle-info" class="text-blue-500" />
              <span>Status Penanganan Tiket</span>
            </div>
            <p class="text-gray-600 leading-relaxed">
              <span v-if="ticket.status === 'open'">
                Tiket Anda telah masuk antrean dan sedang menunggu konfirmasi pengerjaan dari teknisi helpdesk.
              </span>
              <span v-else-if="ticket.status === 'in_progress'">
                Kendala sedang aktif dikerjakan oleh teknisi (<strong>{{ ticket.assign_by || 'Tim Support' }}</strong>). Anda dapat berdiskusi melalui kolom tanggapan.
              </span>
              <span v-else>
                Kendala telah diselesaikan oleh teknisi. Berikan penilaian layanan di atas untuk membantu peningkatan mutu helpdesk kami.
              </span>
            </p>
          </div>

          <!-- Interactive Status Switcher (Card-based for friendly UX) -->
          <div class="space-y-2.5 pt-2" v-if="canEditStatus">
            <label class="text-xs font-bold text-gray-800 flex items-center justify-between">
              <span>Pilih Status Manual:</span>
              <span class="text-[11px] font-normal text-gray-400">Klik salah satu</span>
            </label>

            <div class="space-y-2">
              <!-- Option Open -->
              <button
                type="button"
                @click="quickUpdateStatus('open')"
                :class="ticket.status === 'open' ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20' : 'border-gray-200 bg-white hover:bg-gray-50'"
                class="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <span class="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0"></span>
                  <div>
                    <h5 class="text-xs font-bold text-gray-900">Open (Menunggu Respon)</h5>
                    <p class="text-[11px] text-gray-500">Tiket masuk antrean</p>
                  </div>
                </div>
                <font-awesome-icon v-if="ticket.status === 'open'" icon="fa-solid fa-circle-check" class="text-blue-600 text-sm" />
              </button>

              <!-- Option In Progress -->
              <button
                type="button"
                @click="quickUpdateStatus('in_progress')"
                :class="ticket.status === 'in_progress' ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20' : 'border-gray-200 bg-white hover:bg-gray-50'"
                class="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <span class="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0"></span>
                  <div>
                    <h5 class="text-xs font-bold text-gray-900">In Progress (Sedang Dikerjakan)</h5>
                    <p class="text-[11px] text-gray-500">Teknisi aktif menangani kendala</p>
                  </div>
                </div>
                <font-awesome-icon v-if="ticket.status === 'in_progress'" icon="fa-solid fa-circle-check" class="text-amber-500 text-sm" />
              </button>

              <!-- Option Closed -->
              <button
                type="button"
                @click="openResolutionModal"
                :class="ticket.status === 'closed' ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-gray-200 bg-white hover:bg-gray-50'"
                class="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <span class="w-3 h-3 rounded-full bg-emerald-600 flex-shrink-0"></span>
                  <div>
                    <h5 class="text-xs font-bold text-gray-900">Closed (Selesai Tuntas)</h5>
                    <p class="text-[11px] text-gray-500">Masalah telah berhasil diselesaikan</p>
                  </div>
                </div>
                <font-awesome-icon v-if="ticket.status === 'closed'" icon="fa-solid fa-circle-check" class="text-emerald-600 text-sm" />
              </button>
            </div>
          </div>

          <!-- Priority Selector Display -->
          <div class="space-y-1.5 pt-2 border-t border-gray-100">
            <label class="text-xs font-semibold text-gray-700">Tingkat Prioritas Tiket</label>
            <div
              :class="{
                'bg-red-50 text-red-700 border-red-200': ticket.priority === 'Critical' || ticket.priority === 'Block',
                'bg-amber-50 text-amber-700 border-amber-200': ticket.priority === 'Major',
                'bg-blue-50 text-blue-700 border-blue-200': ticket.priority === 'Normal' || !ticket.priority,
                'bg-emerald-50 text-emerald-700 border-emerald-200': ticket.priority === 'Minor' || ticket.priority === 'Trivial',
              }"
              class="flex items-center justify-between p-3 rounded-xl border text-xs font-bold"
            >
              <div class="flex items-center gap-2">
                <PriorityIcon :props="ticket.priority" />
                <span>Prioritas: {{ ticket.priority || 'Normal' }}</span>
              </div>
              <span class="text-[11px] font-normal text-gray-500">
                {{ ticket.priority === 'Critical' ? 'Sangat Mendesak' : 'Reguler' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 2. Assignment & Ticket Details Card -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
            <span>Informasi Penugasan & OPD</span>
            <font-awesome-icon icon="fa-solid fa-clipboard-user" class="text-gray-400" />
          </h3>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between py-1 border-b border-gray-50">
              <span class="text-gray-500">Tipe Pengajuan</span>
              <span class="font-bold text-gray-800 uppercase text-[11px] px-2 py-0.5 rounded bg-gray-100">
                {{ ticket.ticket_type || 'Incident' }}
              </span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-gray-50">
              <span class="text-gray-500">Unit Kerja / OPD</span>
              <span class="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {{ ticket.department_name || 'Umum' }}
              </span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-gray-50">
              <span class="text-gray-500">Teknisi Penanggung Jawab</span>
              <span class="font-bold text-gray-800 flex items-center gap-1.5">
                <font-awesome-icon icon="fa-solid fa-user-gear" class="text-blue-500" />
                {{ ticket.assign_by || 'Belum Ditugaskan' }}
              </span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-gray-50">
              <span class="text-gray-500">Kategori Kendala</span>
              <span class="font-bold text-gray-800">{{ ticket.kategori_name || '-' }}</span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-gray-50">
              <span class="text-gray-500">Tanggal Pengajuan</span>
              <span class="font-semibold text-gray-700">{{ ticket.created_at }}</span>
            </div>

            <div class="flex items-center justify-between py-1">
              <span class="text-gray-500">Nama Pelapor</span>
              <span class="font-bold text-gray-800">{{ ticket.client_name || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Rating Modal Dialog (CSAT) -->
    <RatingModal
      ref="ratingModalRef"
      :ticket-id="ticket.id_ticket || ticket.id || 0"
      :ticket-number="ticket.ticket_number || ticketNumber || ''"
      @rated="handleTicketRated"
    />

    <!-- Resolution Confirmation Modal Dialog -->
    <el-dialog
      v-model="resolutionModalVisible"
      title="Selesaikan & Tutup Tiket"
      width="540px"
      destroy-on-close
      class="rounded-2xl"
    >
      <template #header>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <font-awesome-icon icon="fa-solid fa-circle-check" class="text-lg" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900">Konfirmasi Penyelesaian Tiket</h3>
            <p class="text-xs text-gray-500">Tandai kendala ini telah selesai dan tuntas</p>
          </div>
        </div>
      </template>

      <div class="space-y-4 pt-1">
        <div class="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
          Status tiket <strong>#{{ ticket.ticket_number }}</strong> akan diubah menjadi <strong class="uppercase">Closed</strong>.
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Catatan Solusi / Ringkasan Perbaikan (Opsional):
          </label>
          <textarea
            v-model="resolutionNote"
            rows="3"
            placeholder="Contoh: Penggantian kabel jaringan telah selesai dan koneksi printer sudah normal kembali..."
            class="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50 hover:bg-white transition-colors"
          ></textarea>
          <p class="text-[11px] text-gray-400 mt-1">Catatan ini akan otomatis dikirimkan ke kolom tanggapan untuk dibaca pelapor.</p>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
          <el-button @click="resolutionModalVisible = false" size="large">Batal</el-button>
          <el-button
            type="primary"
            @click="confirmCloseTicket"
            :loading="updatingStatus"
            size="large"
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            Ya, Selesaikan Tiket
          </el-button>
        </div>
      </template>
    </el-dialog>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import PriorityIcon from "@/components/PriorityIcon.vue";
import SlaBadge from "@/components/SlaBadge.vue";
import RatingModal from "@/components/RatingModal.vue";
import { ref, onMounted, computed } from "vue";
import { useTicketStore } from "@/stores/ticketStore";
import { useCommentStore } from "@/stores/commentStore";
import { useAuthStore } from "@/stores/authStore";
import { useRatingStore } from "@/stores/ratingStore";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { ElNotification } from "element-plus";

const ticketStore = useTicketStore();
const commentStore = useCommentStore();
const authStore = useAuthStore();
const ratingStore = useRatingStore();

const router = useRouter();
const route = useRoute();

const ticketNumber = <string>route.params.ticketNumber;
const ticket = ref<any>({});

const ratingModalRef = ref<InstanceType<typeof RatingModal> | null>(null);

const newComment = ref<string>("");
const attachment = ref<File | null>(null);
const commentFileName = ref<string>("");
const loading = ref<boolean>(false);
const updatingStatus = ref<boolean>(false);
const sendingComment = ref<boolean>(false);

const resolutionModalVisible = ref(false);
const resolutionNote = ref("");

const quickTemplates = [
  "Halo, kendala sedang kami telusuri lebih lanjut.",
  "Perbaikan sudah diterapkan, mohon lakukan refresh & coba kembali.",
  "Bisa tolong lampirkan tangkapan layar (screenshot) pesan errornya?",
  "Tiket telah kami selesaikan. Terima kasih telah menghubungi Helpdesk."
];

const canEditStatus = computed(() => {
  const role = authStore.user?.role;
  return role === "admin" || role === "support";
});

onMounted(() => {
  fetchAndLoad();
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
      return status || "Open";
  }
};

const fetchAndLoad = async () => {
  loading.value = true;
  try {
    const response = await ticketStore.fetchTicket(ticketNumber);
    if (response && response.data) {
      const raw = response.data.data || response.data;
      const tid = raw.id_ticket || raw.id || (ticketStore.ticket ? (ticketStore.ticket as any).id || (ticketStore.ticket as any).id_ticket : null);
      
      ticket.value = {
        id_ticket: tid,
        ticket_number: raw.ticket_number || ticketNumber,
        client_name: raw.clientname || raw.client_name,
        priority: raw.priority,
        created_at: raw.created_at,
        assign_by: raw.assign_by,
        status: raw.status,
        subject: raw.subject,
        issue: raw.issue,
        kategori_name: raw.kategori_name,
        department_name: raw.department_name,
        ticket_type: raw.ticket_type,
        attachment_url: raw.attachment_url,
        attachment_name: raw.attachment,
        response_due_at: raw.response_due_at,
        resolution_due_at: raw.resolution_due_at,
        first_responded_at: raw.first_responded_at,
        resolved_at: raw.resolved_at,
        is_sla_breached: raw.is_sla_breached,
      };

      if (tid) {
        await commentStore.fetchComments(tid);
        if (ticket.value.status === 'closed') {
          await ratingStore.fetchTicketRating(tid);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  } finally {
    loading.value = false;
  }
};

const openRatingDialog = () => {
  if (ratingModalRef.value) {
    ratingModalRef.value.open();
  }
};

const handleTicketRated = async () => {
  if (ticket.value.id_ticket) {
    await ratingStore.fetchTicketRating(ticket.value.id_ticket);
  }
};

const insertQuickTemplate = (tpl: string) => {
  if (newComment.value.trim()) {
    newComment.value += " " + tpl;
  } else {
    newComment.value = tpl;
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    attachment.value = input.files[0];
    commentFileName.value = input.files[0].name;
  }
};

const clearCommentFile = () => {
  attachment.value = null;
  commentFileName.value = "";
};

const addComment = async () => {
  if (!newComment.value.trim() && !attachment.value) return;

  const targetId = ticket.value.id_ticket;
  if (!targetId) {
    ElNotification({
      title: "Gagal Mengirim",
      message: "ID Tiket tidak ditemukan, silakan refresh halaman.",
      type: "error",
    });
    return;
  }

  sendingComment.value = true;
  try {
    await commentStore.createComment(
      targetId,
      newComment.value,
      attachment.value || undefined
    );
    newComment.value = "";
    attachment.value = null;
    commentFileName.value = "";
    ElNotification({
      title: "Tanggapan Terkirim",
      message: "Tanggapan dan lampiran berhasil dikirimkan.",
      type: "success",
    });
  } catch (error) {
    console.error("Error adding comment:", error);
  } finally {
    sendingComment.value = false;
  }
};

const quickUpdateStatus = async (newStatus: string) => {
  if (ticket.value.status === newStatus) return;

  updatingStatus.value = true;
  try {
    await ticketStore.updateTicket(ticket.value.ticket_number, newStatus);
    ticket.value.status = newStatus;
    ElNotification({
      title: "Status Berhasil Diubah",
      message: `Status tiket #${ticket.value.ticket_number} kini '${formatStatus(newStatus)}'`,
      type: "success",
    });
    await fetchAndLoad();
  } catch (error) {
    console.error(error);
  } finally {
    updatingStatus.value = false;
  }
};

const openResolutionModal = () => {
  resolutionNote.value = "";
  resolutionModalVisible.value = true;
};

const confirmCloseTicket = async () => {
  updatingStatus.value = true;
  try {
    await ticketStore.updateTicket(ticket.value.ticket_number, "closed");
    
    // If a resolution note is provided, automatically add it as a comment!
    if (resolutionNote.value.trim() && ticket.value.id_ticket) {
      await commentStore.createComment(
        ticket.value.id_ticket,
        `[SOLUSI SELESAI]: ${resolutionNote.value.trim()}`
      );
    }

    ElNotification({
      title: "Tiket Selesai",
      message: `Tiket #${ticket.value.ticket_number} berhasil diselesaikan.`,
      type: "success",
    });

    resolutionModalVisible.value = false;
    await fetchAndLoad();

    // If user is client, prompt CSAT rating modal!
    if (isClientUser.value) {
      setTimeout(() => {
        openRatingDialog();
      }, 600);
    }
  } catch (error) {
    console.error(error);
  } finally {
    updatingStatus.value = false;
  }
};

const isClientUser = computed(() => authStore.user?.role === "client");

const hasRating = computed(() => {
  return Boolean(
    ratingStore.currentRating &&
    typeof ratingStore.currentRating.rating === "number" &&
    ratingStore.currentRating.rating > 0
  );
});

const isImage = (fileName: string | undefined | null) => {
  if (!fileName) return false;
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const cleanName = fileName.split("?")[0];
  const extension = cleanName.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
};

const isCommentImage = (attachmentName: string | undefined | null) => {
  if (!attachmentName) return false;
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const cleanName = attachmentName.split("?")[0];
  const extension = cleanName.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
};

const getImageUrl = (attachmentName: string | undefined | null) => {
  if (!attachmentName) return "";
  if (attachmentName.startsWith("http://") || attachmentName.startsWith("https://")) {
    return attachmentName;
  }
  return `http://127.0.0.1:8000/storage/${attachmentName}`;
};

const getFileName = (pathOrName: string | undefined | null) => {
  if (!pathOrName) return "Lampiran Berkas";
  const clean = pathOrName.split("?")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1];
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return dayjs(dateString).format("D MMMM YYYY HH:mm");
};

const goBack = () => {
  router.push({ name: "ticket" });
};
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 1.25rem !important;
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
</style>


