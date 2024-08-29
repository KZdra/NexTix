<template>
  <MainLayout>
    <!-- Main Content Section -->
    <div class="flex space-x-6" v-loading="loading">
      <!-- Tickets Detail Section -->
      <section class="flex-1 bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center border-b pb-4 mb-4">
          <el-page-header @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3"
                >Ticket Number: {{ ticket.ticket_number }}
                <h3 class="text-xl font-semibold">
                  Client Name: {{ ticket.client_name }}
                </h3>
              </span>
            </template>
          </el-page-header>
          <p class="text-gray-500">{{ ticket.created_at }}</p>
        </div>
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Subject: {{ ticket.subject }}</h2>
          <!-- Issue Section -->
          <div>
            <h3 class="text-lg font-semibold mb-2">Issue:</h3>
            <textarea
              class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              v-model="ticket.issue"
              readonly
            ></textarea>
          </div>
          <!-- Attachment Section -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-2">Attachment:</h3>
            <div v-if="isImage(ticket.attachment_name)">
              <img
                :src="ticket.attachment_url"
                alt="Attachment Image"
                class="mt-2 max-w-full rounded-md"
              />
              <button
                @click="ticketStore.downloadAttachment(ticketNumber)"
                class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Download {{ ticket.attachment_name }}
              </button>
            </div>
            <div v-else>
              <a
                :href="ticket.attachment_url"
                download
                class="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Download {{ ticket.attachment_name }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Sidebar Section -->
      <div class="w-1/3 space-y-6">
        <!-- Status Ticket Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
          <h4 class="text-lg font-semibold mb-4">Status Ticket</h4>
          <select
            v-if="
              authStore.user?.role === 'admin' ||
              authStore.user?.role === 'support'
            "
            v-model="ticket.status"
            @change="updateTicketStatus(ticket)"
            class="px-2 py-1 text-gray-700 bg-white border rounded"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <!-- Display status text for clients with conditional styling -->
          <span
            v-else
            :class="{
              'bg-green-100 text-green-800': ticket.status === 'open',
              'bg-yellow-100 text-yellow-800': ticket.status === 'in_progress',
              'bg-red-100 text-red-800 ': ticket.status === 'closed',
            }"
            class="py-1 px-2.5 border-none rounded font-medium"
          >
            {{ ticket.status }}
          </span>
          <h4 class="text-lg font-semibold mb-1 mt-2">Assign by</h4>
          <h2 class="text-xl font-bold">{{ ticket.assign_by }}</h2>
        </section>

        <!-- Comments Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
          <h4 class="text-lg font-semibold mb-4">Comments</h4>
          <div
            v-for="comment in commentStore.comments"
            :key="comment.id"
            class="border-b pb-4 mb-4"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">{{ comment.user_name }}</h3>
              <p class="text-gray-500 text-sm">
                {{ formatDate(comment.created_at) }}
              </p>
            </div>
            <p class="text-md mb-3 mt-1">{{ comment.comment }}</p>
            <!-- Comment Attachment Section -->
            <div v-if="comment.attachment_url">
              <div v-if="isCommentImage(comment.attachment)">
                <img
                  :src="comment.attachment_url"
                  alt="Attachment Image"
                  class="mt-2 max-w-full rounded-md"
                />
                <button
                  @click="commentStore.downloadCommentAttachment(comment.id)"
                  class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Download {{ comment.attachment }}
                </button>
              </div>
              <div v-else>
                <button
                  @click="commentStore.downloadCommentAttachment(comment.id)"
                  class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Download {{ comment.attachment }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Add Comment Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
          <h4 class="text-lg font-semibold mb-4">Add Comment</h4>
          <textarea
            v-model="newComment"
            rows="4"
            class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>

          <h4 class="text-lg font-semibold mt-6 mb-4">Add Attachment</h4>
          <input
            type="file"
            @change="handleFileChange"
            class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button
            @click="addComment"
            class="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Comment
          </button>
        </section>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import { ref, onMounted } from "vue";
import { useTicketStore } from "@/stores/ticketStore";
import { useCommentStore } from "@/stores/commentStore"; // Import the comment store
import { useAuthStore } from "@/stores/authStore";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

const ticketStore = useTicketStore();
const commentStore = useCommentStore(); // Use the comment store
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

const ticketNumber = <string>route.params.ticketNumber;
const ticket = ref<any>({});

const newComment = ref<string>("");
const attachment = ref<File | null>(null);

const loading = ref<Boolean>(false)

onMounted( () => {
 fetchAndLoad();
});


const fetchAndLoad = async () => {
  loading.value = true
  try {
    const response = await ticketStore.fetchTicket(ticketNumber);
    if (response && response.data) {
      ticket.value = {
        id_ticket: response.data.id_ticket,
        ticket_number: response.data.ticket_number,
        client_name: response.data.clientname,
        created_at: response.data.created_at,
        assign_by: response.data.assign_by,
        status: response.data.status,
        subject: response.data.subject,
        issue: response.data.issue,
        attachment_url: response.data.attachment_url,
        attachment_name: response.data.attachment,
      };
      await commentStore.fetchComments(response.data.id_ticket);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  } finally {
    loading.value=false;
  } 
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    attachment.value = input.files[0];
  }
};

const addComment = async () => {
  try {
    await commentStore.createComment(
      ticket.value.id_ticket,
      newComment.value,
      attachment.value
    );
    newComment.value = "";
    attachment.value = null;
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

const isImage = (fileName: string | undefined) => {
  if (!fileName) return false; // Check if fileName is undefined or null
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = fileName.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
};

const isCommentImage = (attachmentName: string | undefined) => {
  if (!attachmentName) return false; // Check if attachmentName is undefined or null
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = attachmentName.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
};
const formatDate = (dateString: string) => {
    return dayjs(dateString).format('D MMMM YYYY HH:mm');
  };

const updateTicketStatus = async (ticket: any) => {
  try {
    await ticketStore.updateTicket(ticket.ticket_number, ticket.status);
  } catch (error) {
    console.error(error)
  } finally {
    await fetchAndLoad();
  }
};

const goBack = () => {
  router.back();
};
</script>
