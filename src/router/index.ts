import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { getActivePinia } from "pinia";
import { errorHandling } from "@/utils/errorHandling";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("@/views/LandingPageView.vue"),
      meta: { requiresAuth: false, hideNavbar: true },
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: { requiresAuth: true, roles: ["client", "support", "admin"] },
    },
    {
      path: "/ticket",
      name: "ticket",
      component: () => import("@/views/ticket/TicketView.vue"),
      meta: { requiresAuth: true, roles: ["client", "support", "admin"] },
    },
    {
      path: "/detailticket/:ticketNumber",
      name: "detailticket",
      component: () => import("@/views/ticket/DetailTicketView.vue"),
      meta: { requiresAuth: true, roles: ["client", "support", "admin"] },
    },
    {
      path: "/departments",
      name: "departments",
      component: () => import("@/views/admin/DepartmentView.vue"),
      meta: { requiresAuth: true, roles: ["admin"] },
    },
    {
      path: "/kategori",
      name: "kategori",
      component: () => import("@/views/admin/KategoriView.vue"),
      meta: { requiresAuth: true, roles: ["admin"] },
    },
    {
      path: "/report",
      name: "report",
      component: () => import("@/views/admin/ReportView.vue"),
      meta: { requiresAuth: true, roles: ["admin"] },
    },
    {
      path: "/manageuser",
      name: "usermanagement",
      component: () => import("@/views/admin/UserManagementView.vue"),
      meta: { requiresAuth: true, roles: ["admin"] },
    },
    {
      path: "/audit-logs",
      name: "auditlogs",
      component: () => import("@/views/admin/AuditLogView.vue"),
      meta: { requiresAuth: true, roles: ["admin"] },
    },
    {
      path: "/faq",
      name: "faq",
      component: () => import("@/views/misc/FaqView.vue"),
      meta: { requiresAuth: true, roles: ["client", "support", "admin"] },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/LoginView.vue"),
      meta: {
        hideNavbar: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const pinia = getActivePinia();
  if (pinia) {
    const authStore = useAuthStore(pinia);

    if (authStore.token && !authStore.isAuthenticated) {
      try {
        await authStore.refreshToken();
      } catch (error) {
        errorHandling(error);
        return;
      }
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: "login" });
      return;
    }
    
    if (to.name === 'login' && authStore.isAuthenticated) {
      next({ name: 'home' });
      return;
    }
    
    if (to.meta.roles && Array.isArray(to.meta.roles) && to.meta.roles.length > 0) {
      const userRole = authStore.user?.role || "client";
      const hasRole = to.meta.roles.includes(userRole);

      if (!hasRole) {
        next({ name: "home" });
        return;
      }
    }

    next();
  } else {
    next();
  }
});

export default router;
