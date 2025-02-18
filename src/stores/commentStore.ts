import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiService } from '@/utils/apiService';

interface Comment {
  id: number;
  ticket_id: number;
  user_id: number;
  comment: string;
  attachment?: string;
  attachment_url?: string;
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
      const response = await apiService.apiGet(`/api/auth/comment/${ticket_id}`); // Use apiService.apiGet
      comments.value = response.data;
      
    } catch (err) {
      error.value = 'Failed to fetch comments';
    } finally {
      loading.value = false;
    }
  };

  const createComment = async (ticket_id: number, comment: string, attachment?: File) => {
    const formData = new FormData();
    formData.append('ticket_id', ticket_id.toString());
    formData.append('comment', comment);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const response = await apiService.apiPost('/api/auth/comment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Use apiService.apiPost
      comments.value.push(response.data);
      fetchComments(ticket_id);
    } catch (err) {
      console.log(err);
      error.value = 'Failed to create comment';
    }
  };

  const downloadCommentAttachment = async (id: number) => {
    try {
      const comment = comments.value.find(c => c.id === id);
      if (!comment || !comment.attachment) {
        console.error('Attachment not found for this comment');
        return;
      } else {
        await apiService.apiDownload(`/api/auth/comment/download/${id}`, comment.attachment); 
      }

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
