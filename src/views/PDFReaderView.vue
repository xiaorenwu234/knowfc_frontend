<template>
  <div></div>
</template>

<script setup lang="ts">
import instance from '@/ts/axios'
import type { Paper } from '@/ts/Paper'
import { notify } from '@/ts/toast'
import { getUserId } from '@/ts/User'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const paper = ref<Paper>()

const getPDFDetail = async (id: string) => {
  try {
    const response = await instance.get(`/paper/get?userId=${getUserId()}&id=${id}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.data.code === 200) {
      paper.value = response.data.data
    } else {
      notify('error', response.data.msg)
    }
  } catch (error) {
    console.error('Error fetching PDF:', error)
    notify('error', error instanceof Error ? error.message : String(error))
  }
}
const router = useRoute()
const id = router.params.id as string

onMounted(async () => {
  await getPDFDetail(id)
console.log('PDF Detail:', paper.value);

})
</script>

<style scoped></style>
