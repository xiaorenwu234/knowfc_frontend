import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', () => {
    const searchQuery = ref({
        doSearch: false,
        type: 'article',
        content: '',
        constraints: {
            title: '',
            author: '',
            journal: '',
            year: '',
            page: '',
        }
    })
    
    function setType(type: string) {
        searchQuery.value.type = type
    }

    function setContent(content: string) {
        searchQuery.value.content = content
    }

    function setConstraints(constraints: any) {
        searchQuery.value.constraints = constraints
    }

    return { searchQuery, setType, setContent, setConstraints }
})