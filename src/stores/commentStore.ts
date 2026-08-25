import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiService } from '@/utils/apiService';

export interface Comment {
  id: number;
  ticket_id: number;
  user_id: number;
  comment: string;
  attachment?: string | null;
  attachment_url?: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
}

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Comment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchComments = async (ticket_id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.apiGet(`/api/auth/comment/${ticket_id}`);
      let list: Comment[] = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          list = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          list = response.data.data;
        }
      }
      comments.value = list;
    } catch (err) {
      error.value = 'Failed to fetch comments';
    } finally {
      loading.value = false;
    }
  };

  const createComment = async (ticket_id: number, comment: string, attachment?: File) => {
    const formData = new FormData();
    formData.append('ticket_id', ticket_id.toString());
    formData.append('comment', comment || '');
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const response = await apiService.apiPost('/api/auth/comment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchComments(ticket_id);
      return response;
    } catch (err) {
      console.log(err);
      error.value = 'Failed to create comment';
    }
  };

  const downloadCommentAttachment = async (id: number) => {
    try {
      const comment = comments.value.find(c => c.id === id);
      const filename = comment?.attachment || `attachment_${id}`;
      await apiService.apiDownload(`/api/auth/comment/download/${id}`, filename);
    } catch (error) {
      console.error('Error downloading comment attachment:', error);
    }
  };

  return {
    downloadCommentAttachment,
    comments,
    loading,
    error,
    fetchComments,
    createComment,
  };
});

