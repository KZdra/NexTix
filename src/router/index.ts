import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { getActivePinia } from "pinia";
import { errorHandling } from "@/utils/errorHandling";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
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
      next({ name: "Login" });
      return;
    }

    if (to.meta.roles && to.meta.roles.length > 0) {
      const userRoles = authStore.user?.role || [];
      const hasRole = to.meta.roles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        next({ name: "home" }); // Redirect to a safe route or an access denied page
        return;
      }
    }

    next();
  } else {
    next();
  }
});

export default router;
