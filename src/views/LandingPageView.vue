<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white font-sans antialiased scroll-smooth">
    <!-- 1. Header Navigation -->
    <header class="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Logo Branding -->
        <router-link to="/" class="flex items-center space-x-3 group transition-transform duration-300 hover:scale-105">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <font-awesome-icon icon="fa-solid fa-headset" class="text-blue-400 text-lg group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span class="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Nex<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Tix</span>
            </span>
            <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">Helpdesk & SPBE ITIL</span>
          </div>
        </router-link>

        <!-- Desktop Navigation Links (Smooth Scroll) -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
          <a @click.prevent="scrollToSection('standards')" href="#standards" class="hover:text-blue-400 transition-colors duration-200 cursor-pointer">Standar Tata Kelola</a>
          <a @click.prevent="scrollToSection('features')" href="#features" class="hover:text-blue-400 transition-colors duration-200 cursor-pointer">Fitur Unggulan</a>
          <a @click.prevent="scrollToSection('how-it-works')" href="#how-it-works" class="hover:text-blue-400 transition-colors duration-200 cursor-pointer">Cara Kerja</a>
          <a @click.prevent="scrollToSection('tracker')" href="#tracker" class="hover:text-blue-400 transition-colors duration-200 cursor-pointer">Lacak Tiket</a>
          <a @click.prevent="scrollToSection('faq')" href="#faq" class="hover:text-blue-400 transition-colors duration-200 cursor-pointer">Bantuan / FAQ</a>
        </nav>

        <!-- Auth Action Buttons -->
        <div class="hidden sm:flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <router-link
              to="/home"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <font-awesome-icon icon="fa-solid fa-gauge-high" />
              <span>Buka Dashboard</span>
            </router-link>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
            >
              Masuk
            </router-link>
            <router-link
              to="/login"
              class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
              <span>Ajukan Pengaduan</span>
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
          aria-label="Toggle Menu"
        >
          <font-awesome-icon :icon="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" class="text-lg" />
        </button>
      </div>

      <!-- Mobile Dropdown Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div v-show="mobileMenuOpen" class="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <a @click="scrollToSection('standards')" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">Standar Tata Kelola</a>
          <a @click="scrollToSection('features')" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">Fitur Unggulan</a>
          <a @click="scrollToSection('how-it-works')" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">Cara Kerja</a>
          <a @click="scrollToSection('tracker')" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">Lacak Tiket</a>
          <a @click="scrollToSection('faq')" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">Bantuan / FAQ</a>
          <div class="pt-3 border-t border-slate-800 space-y-2">
            <router-link
              v-if="authStore.isAuthenticated"
              to="/home"
              class="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs text-center block transition-all"
            >
              Buka Dashboard Anda
            </router-link>
            <router-link
              v-else
              to="/login"
              class="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs text-center block transition-all"
            >
              Masuk ke Portal
            </router-link>
          </div>
        </div>
      </transition>
    </header>

    <!-- 2. Hero Section -->
    <section class="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      <!-- Background Ambient Glowing Orbs -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow"></div>
      <div class="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" style="animation-delay: 2s;"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Hero Text Content -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Portal Helpdesk ITIL & SPBE Instansi Modern</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Layanan Penanganan Kendala <br class="hidden sm:inline"/>
              <span class="shimmer-text">
                Terstandar, Cepat & Akuntabel
              </span>
            </h1>

            <p class="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              NexTix mengintegrasikan tata kelola multi-dinas OPD, kepatuhan target SLA otomatis, survei kepuasan IKM, dan jejak audit digital untuk mewujudkan tata kelola IT prima.
            </p>

            <!-- CTA Group -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <router-link
                :to="authStore.isAuthenticated ? '/ticket' : '/login'"
                class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <font-awesome-icon icon="fa-solid fa-ticket" class="text-base" />
                <span>{{ authStore.isAuthenticated ? 'Buat Tiket Baru' : 'Ajukan Tiket Sekarang' }}</span>
              </router-link>

              <a
                @click.prevent="scrollToSection('tracker')"
                href="#tracker"
                class="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                <span>Cek Progres Tiket</span>
              </a>
            </div>

            <!-- Trust / Stats Preview -->
            <div class="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
              <div class="p-2 rounded-xl hover:bg-slate-800/50 transition-colors duration-300">
                <div class="text-xl sm:text-2xl font-black text-white">99.8%</div>
                <div class="text-[11px] text-slate-400">Kepatuhan SLA</div>
              </div>
              <div class="p-2 rounded-xl hover:bg-slate-800/50 transition-colors duration-300">
                <div class="text-xl sm:text-2xl font-black text-blue-400">&lt; 15 Mnt</div>
                <div class="text-[11px] text-slate-400">Respon Kritis</div>
              </div>
              <div class="p-2 rounded-xl hover:bg-slate-800/50 transition-colors duration-300">
                <div class="text-xl sm:text-2xl font-black text-emerald-400">4.9 / 5.0</div>
                <div class="text-[11px] text-slate-400">Indeks Kepuasan (IKM)</div>
              </div>
            </div>
          </div>

          <!-- Hero Interactive Card Preview (Reflecting Institutional Mockup) -->
          <div class="lg:col-span-5 animate-float">
            <div class="relative mx-auto max-w-md bg-gradient-to-b from-slate-800/95 to-slate-900/98 p-6 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-4 hover:border-blue-500/50 transition-all duration-300 hover:shadow-blue-500/10">
              <!-- Card Header with OPD & Status -->
              <div class="flex items-center justify-between border-b border-slate-700/60 pb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <font-awesome-icon icon="fa-solid fa-building-columns" class="text-base" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono font-bold text-blue-400">#TIX-260826001</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">DISKOMINFO</span>
                    </div>
                    <h4 class="text-sm font-bold text-white truncate max-w-[200px]">Kendala Server & Jaringan OPD</h4>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                  Selesai
                </span>
              </div>

              <!-- SLA Countdown Simulation -->
              <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2 text-slate-300">
                  <font-awesome-icon icon="fa-solid fa-stopwatch" class="text-emerald-400" />
                  <span>Target SLA Terselesaikan:</span>
                </div>
                <span class="font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  SLA Met (1 Jam 12 Mnt)
                </span>
              </div>

              <!-- CSAT Rating Preview -->
              <div class="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-300 block">Survei Kepuasan Pelapor (CSAT):</span>
                  <p class="text-[11px] text-slate-400">"Respon cepat dan internet langsung stabil. Terima kasih!"</p>
                </div>
                <div class="flex text-amber-400 text-sm ml-2 flex-shrink-0">
                  ★★★★★
                </div>
              </div>

              <!-- BAPP PDF Export Indicator -->
              <div class="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span class="flex items-center gap-1.5 text-blue-400">
                  <font-awesome-icon icon="fa-solid fa-file-pdf" />
                  <span>Berita Acara (BAPP) Resmi Tersedia</span>
                </span>
                <span class="font-mono text-slate-500">Audit SPBE Logged ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Institutional Governance Badges (Standar SPBE & ITIL) -->
    <section id="standards" class="py-12 bg-slate-950/80 border-y border-slate-800/80 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
          Mengadopsi Standar Tata Kelola Teknologi Informasi & Pelayanan Publik
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 space-y-2">
            <div class="text-blue-400 text-2xl font-black">ITIL v4</div>
            <p class="text-xs text-slate-400">Incident & Service Request Management</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 space-y-2">
            <div class="text-indigo-400 text-2xl font-black">SPBE</div>
            <p class="text-xs text-slate-400">Sistem Pemerintahan Berbasis Elektronik</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 space-y-2">
            <div class="text-cyan-400 text-2xl font-black">ISO 20000</div>
            <p class="text-xs text-slate-400">Standar Internasional Manajemen Layanan IT</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 space-y-2">
            <div class="text-emerald-400 text-2xl font-black">PermenPAN-RB</div>
            <p class="text-xs text-slate-400">Indeks Kepuasan Masyarakat (IKM)</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Ticket Quick Tracker Widget Section -->
    <section id="tracker" class="py-16 bg-slate-900 border-b border-slate-800/80 relative scroll-mt-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
          <font-awesome-icon icon="fa-solid fa-crosshairs" />
          <span>Lacak Tiket Instan</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-white">
          Pantau Progres Penanganan Masalah Anda
        </h2>
        <p class="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Punya nomor tiket? Masukkan nomor tiket Anda di bawah untuk melihat rincian progres tanpa perlu mencari manual.
        </p>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <font-awesome-icon icon="fa-solid fa-ticket" />
            </div>
            <input
              v-model="trackerTicketNumber"
              @keyup.enter="handleTrackTicket"
              type="text"
              placeholder="Contoh: TIX-260826001 atau nomor tiket Anda"
              class="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <button
            @click="handleTrackTicket"
            class="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95 text-white font-bold text-xs rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-right" />
            <span>Lacak Tiket</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 5. Features Section (5 Core Institutional Features) -->
    <section id="features" class="py-20 bg-slate-950 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="text-xs font-bold uppercase tracking-wider text-blue-400">Keunggulan Platform</span>
          <h2 class="text-3xl font-black text-white">5 Pilar Standarisasi Helpdesk Instansi</h2>
          <p class="text-xs sm:text-sm text-slate-400">Semua instrumen tata kelola yang dibutuhkan untuk koordinasi OPD yang akuntabel dan transparan.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1: Multi OPD -->
          <div class="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 hover:-translate-y-1.5 transition-all duration-300 group space-y-4 shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
            <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              <font-awesome-icon icon="fa-solid fa-building" />
            </div>
            <h3 class="text-lg font-bold text-white">Struktur Multi-OPD & Dinas</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Pengelompokan tiket berdasarkan unit kerja (Diskominfo, BKPSDM, BPKAD, Setda, Inspektorat) untuk penugasan yang tepat sasaran.
            </p>
          </div>

          <!-- Feature 2: SLA Policy -->
          <div class="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 hover:-translate-y-1.5 transition-all duration-300 group space-y-4 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5">
            <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              <font-awesome-icon icon="fa-solid fa-stopwatch" />
            </div>
            <h3 class="text-lg font-bold text-white">Target SLA & Countdown Otomatis</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Penentuan waktu respon dan penyelesaian berdasarkan tingkat prioritas (Critical, Major, Normal) dengan visualisasi status SLA Met/Breached.
            </p>
          </div>

          <!-- Feature 3: CSAT / IKM -->
          <div class="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 hover:-translate-y-1.5 transition-all duration-300 group space-y-4 shadow-sm hover:shadow-xl hover:shadow-amber-500/5">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              <font-awesome-icon icon="fa-solid fa-star" />
            </div>
            <h3 class="text-lg font-bold text-white">Survei Kepuasan (CSAT / IKM)</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Kuesioner bintang 1-5 dan testimoni pengguna pada tiket selesai untuk evaluasi mutu layanan publik standar PermenPAN-RB.
            </p>
          </div>

          <!-- Feature 4: Audit Trail -->
          <div class="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 hover:-translate-y-1.5 transition-all duration-300 group space-y-4 shadow-sm hover:shadow-xl hover:shadow-purple-500/5">
            <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              <font-awesome-icon icon="fa-solid fa-shield-halved" />
            </div>
            <h3 class="text-lg font-bold text-white">Audit Trail Logging SPBE</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Pencatatan lengkap perubahan status, IP address, timestamp, dan diff data sebelum & sesudah untuk audit pengawasan internal/BPK.
            </p>
          </div>

          <!-- Feature 5: BAPP PDF -->
          <div class="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 hover:-translate-y-1.5 transition-all duration-300 group space-y-4 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              <font-awesome-icon icon="fa-solid fa-file-pdf" />
            </div>
            <h3 class="text-lg font-bold text-white">Berita Acara Resmi (BAPP PDF)</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Ekspor instan Berita Acara Penyelesaian Pekerjaan format kedinasan resmi siap tanda tangan sebagai bukti fisik penanganan IT.
            </p>
          </div>

          <!-- Feature 6: Laporan Analitik -->
          <div class="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 hover:-translate-y-1.5 transition-all duration-300 group space-y-4 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              <font-awesome-icon icon="fa-solid fa-chart-pie" />
            </div>
            <h3 class="text-lg font-bold text-white">Rekapitulasi Excel & PDF</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Filter tanggal, status, dan kategori untuk ekspor laporan berkala pimpinan serta evaluasi performa teknisi bulanan.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. How It Works Section -->
    <section id="how-it-works" class="py-20 bg-slate-900 border-t border-slate-800 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="text-xs font-bold uppercase tracking-wider text-cyan-400">Langkah Sederhana</span>
          <h2 class="text-3xl font-black text-white">3 Langkah Menuntaskan Kendala</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <!-- Step 1 -->
          <div class="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 text-center hover:-translate-y-1 hover:border-blue-500/40 transition-all duration-300">
            <div class="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
              1
            </div>
            <h4 class="text-base font-bold text-white">Ajukan Keluhan OPD</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Pilih tipe pengajuan (Incident/Permintaan), unit dinas, dan lampirkan bukti foto kendala.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 text-center hover:-translate-y-1 hover:border-amber-500/40 transition-all duration-300">
            <div class="w-12 h-12 rounded-full bg-amber-500 text-white font-black text-lg mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
              2
            </div>
            <h4 class="text-base font-bold text-white">Penanganan Sesuai SLA</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Teknisi memproses kendala dengan batasan waktu target respon dan komunikasi real-time.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 text-center hover:-translate-y-1 hover:border-emerald-500/40 transition-all duration-300">
            <div class="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
              3
            </div>
            <h4 class="text-base font-bold text-white">Selesai, BAPP & Survei</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Tiket ditutup dengan catatan solusi tuntas, cetak dokumen BAPP, dan user memberi skor kepuasan IKM.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. FAQ Section with Smooth Transition -->
    <section id="faq" class="py-20 bg-slate-950 border-t border-slate-800 scroll-mt-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="text-center space-y-3">
          <span class="text-xs font-bold uppercase tracking-wider text-blue-400">Pertanyaan Umum</span>
          <h2 class="text-3xl font-black text-white">Sering Ditanyakan (FAQ)</h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              @click="toggleFaq(idx)"
              class="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-white hover:text-blue-400 transition-colors duration-200 cursor-pointer"
            >
              <span>{{ faq.q }}</span>
              <font-awesome-icon
                :icon="faq.open ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
                class="text-xs text-slate-400 transition-transform duration-300"
                :class="{ 'rotate-180 text-blue-400': faq.open }"
              />
            </button>
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="max-h-0 opacity-0 -translate-y-2"
              enter-to-class="max-h-96 opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="max-h-96 opacity-100 translate-y-0"
              leave-to-class="max-h-0 opacity-0 -translate-y-2"
            >
              <div v-show="faq.open" class="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3 overflow-hidden">
                {{ faq.a }}
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Footer -->
    <footer class="mt-auto bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center space-x-2">
          <font-awesome-icon icon="fa-solid fa-headset" class="text-blue-500" />
          <span class="font-bold text-white">NexTix Helpdesk Portal</span>
          <span>&copy; {{ currentYear }} Standar SPBE & ITIL v4. All rights reserved.</span>
        </div>
        <div class="flex items-center space-x-6">
          <router-link to="/login" class="hover:text-white transition-colors duration-200">Login Portal</router-link>
          <router-link to="/faq" class="hover:text-white transition-colors duration-200">Pusat Bantuan</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";

const authStore = useAuthStore();
const router = useRouter();

const mobileMenuOpen = ref(false);
const trackerTicketNumber = ref("");
const currentYear = new Date().getFullYear();

const faqs = reactive([
  {
    q: "Bagaimana cara mengajukan tiket kendala baru?",
    a: "Masuk ke akun Anda, klik 'Ajukan Tiket', pilih tipe pengajuan ITIL (Incident/Layanan), pilih unit kerja OPD Anda, isi deskripsi kendala, dan lampirkan screenshot jika ada.",
    open: true,
  },
  {
    q: "Berapa target waktu respon (SLA) untuk setiap tiket?",
    a: "Target respon diatur dalam Matriks Kebijakan SLA: Prioritas Critical & Block direspon dalam < 15-20 menit, Major dalam 30 menit, dan Normal dalam 60 menit.",
    open: false,
  },
  {
    q: "Apa itu Berita Acara Perbaikan (BAPP PDF)?",
    a: "BAPP adalah dokumen Berita Acara resmi berformat kedinasan yang dapat dicetak ketika status tiket sudah 'Closed' sebagai bukti fisik penyelesaian pekerjaan teknisi.",
    open: false,
  },
  {
    q: "Bagaimana cara memberikan penilaian kepuasan layanan (IKM / CSAT)?",
    a: "Setelah tiket diselesaikan oleh teknisi, pelapor (user) akan menerima pop-up survei untuk memberikan rating bintang 1–5 beserta ulasan kepuasan layanan.",
    open: false,
  },
]);

const toggleFaq = (index: number) => {
  faqs[index].open = !faqs[index].open;
};

const scrollToSection = (id: string) => {
  mobileMenuOpen.value = false;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleTrackTicket = () => {
  const num = trackerTicketNumber.value.trim().replace(/^#/, "");
  if (!num) {
    ElNotification({
      title: "Peringatan",
      message: "Silakan masukkan nomor tiket yang ingin dilacak",
      type: "warning",
    });
    return;
  }

  if (authStore.isAuthenticated) {
    router.push({ name: "detailticket", params: { ticketNumber: num } });
  } else {
    router.push({ name: "login" });
  }
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.25;
    transform: scale(1);
  }
  50% {
    opacity: 0.45;
    transform: scale(1.08);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulseGlow 6s ease-in-out infinite;
}

.shimmer-text {
  background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #38bdf8 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 5s linear infinite;
}
</style>
