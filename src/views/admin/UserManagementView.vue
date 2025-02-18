<template>
  <MainLayout>
    <div class="px-4 py-6 max-w-8xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Title on the left -->
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>

        <!-- Search input with button -->
        <div class="flex">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by Name, Email, or Role..."
            class="relative inline-block px-4 py-2 border-2 border-gray-300 rounded-l-lg"
          />
          <button
            @click="performSearch"
            class="relative inline-block px-6 py-2 font-medium text-white transition duration-300 bg-green-600 border-2 border-green-600 rounded-r-lg hover:bg-green-700"
          >
            Search
          </button>
        </div>

        <!-- Add button on the right -->
        <button
          @click="openModal(false)"
          class="relative inline-block px-6 py-3 font-medium text-green-600 transition duration-300 bg-white border-2 border-green-600 rounded-lg group hover:bg-green-600 hover:text-white"
        >
          <span class="relative">Add User</span>
        </button>
      </div>
      <el-dialog v-model="dialogFormVisible" :title="isEditing ? 'Update User' : 'Add User'" width="600px">
        <el-form :model="userData">
          <el-form-item label="Name" :label-width="formLabelWidth">
            <el-input v-model="userData.name" placeholder="Enter the name" />
          </el-form-item>
          <el-form-item label="email" :label-width="formLabelWidth">
            <el-input
              v-model="userData.email"
              type="email"
              placeholder="Enter Email"
            />
          </el-form-item>
          <el-form-item label="Password" :label-width="formLabelWidth">
            <el-input
              v-model="userData.password"
              type="password"
              placeholder="Please input password"
              show-password
            />
          </el-form-item>
          <el-form-item label="Roles" :label-width="formLabelWidth">
            <el-select v-model="userData.role_id" placeholder="Select a Role">
              <el-option
                v-for="role in userStore.roles"
                :key="role.id"
                :label="role.name"
                :value="role.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleSubmit">
              {{ isEditing ? "Update" : "Submit" }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- Data Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table class="min-w-full bg-white border">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left">User ID</th>
            <th class="px-6 py-3 text-left">Name</th>
            <th class="px-6 py-3 text-left">Email</th>
            <th class="px-6 py-3 text-left">Role</th>
            <th class="px-6 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in paginatedUsers"
            :key="user.id"
            class="transition-colors duration-300 border-t hover:bg-gray-100"
          >
            <td class="px-6 py-4">{{ user.id }}</td>
            <td class="px-6 py-4">{{ user.name }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">{{ user.role }}</td>
            <td class="px-6 py-4">
              <button
                @click="editUser(user.id)"
                class="relative inline-block px-6 py-3 font-medium text-yellow-600 transition duration-300 bg-white border-2 border-yellow-600 rounded-lg group hover:bg-yellow-600 hover:text-white"
              >
                <span class="relative">Edit</span>
              </button>
              <button
                @click="deleteUser(user.id)"
                class="relative inline-block px-6 py-3 font-medium text-red-600 transition duration-300 bg-white border-2 border-red-600 rounded-lg group hover:bg-red-600 hover:text-white"
              >
                <span class="relative">Delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-4">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 mx-1 bg-gray-200 border rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 mx-1 bg-gray-200 border rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import Swal from "sweetalert2";
import { ElNotification } from "element-plus";

const searchQuery = ref("");
const userStore = useUserStore();
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust the items per page as needed
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const isEditing = ref(false);
const userIdToEdit = ref<number | null>(null);

// Sample user data (replace with actual data from your store or API)
onMounted(() => {
  userStore.fetchUsers();
});

const openModal = async (isEdit: boolean, user?: any) => {
  await userStore.fetchRole();
  isEditing.value = isEdit;
  if (isEdit && user) {
    userData.name = user.name;
    userData.email = user.email;
    userData.role_id = user.role_id;
    userIdToEdit.value = user.id; // Store user ID for editing
  } else {
    resetForm();
  }
  dialogFormVisible.value = true;
};

const userData = reactive({
  name: "",
  email: "",
  password: "",
  role_id: 3,
});

watch(dialogFormVisible, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

// Function to reset the form fields
const resetForm = () => {
  userData.name = "";
  userData.email = "";
  userData.password = "";
  userData.role_id = 3; // Reset to default role ID
};

const filteredUsers = computed(() => {
  let userList = userStore.users;

  if (searchQuery.value) {
    userList = userList.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return userList;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
});

const editUser = async (id: number) => {
  const user = await userStore.fetchUserById(id);
  if (user) {
    openModal(true, user);
  }
};

const deleteUser = async (id: number) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await userStore.deleteUser(id);
      Swal.fire("Deleted!", "The user has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the user.", "error");
    }
  }
};

const performSearch = () => {
  currentPage.value = 1;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const handleSubmit = async () => {
  if (isEditing.value && userIdToEdit.value) {
    // Editing an existing user
    await userStore.updateUser(userIdToEdit.value, userData);
    ElNotification({
      title: "Success",
      message: `User ${userData.name} updated successfully!`,
      type: "success",
    });
  } else {
    // Adding a new user
    await userStore.registerUser(userData);
    ElNotification({
      title: "Success",
      message: "User added successfully!",
      type: "success",
    });
  }

  dialogFormVisible.value = false; // Close the dialog after submission
};
</script>
