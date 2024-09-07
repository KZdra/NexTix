import { defineStore } from "pinia";
import { apiService } from "@/utils/apiService";
import { errorHandling } from "@/utils/errorHandling";
import { ref } from "vue";

interface Priority {
    id:number
    priority_name: string
}

export const usePriorityStore = defineStore('priority',()=>{
const priority = ref<Priority[]>([])

const fetchPriority = async()=>{
try {
   const response = await apiService.apiGet('/api/auth/priority');
   priority.value = response.data.data
} catch (error) {
    errorHandling(error)
}
}

return {
    priority,
    fetchPriority
}
});