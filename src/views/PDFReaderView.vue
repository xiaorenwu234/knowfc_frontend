<template>
  <div class="min-h-screen bg-white pt-24" id="webviewer" ref="viewer"></div>
</template>

<script setup lang="ts">
import instance from '@/ts/axios'
import type { Paper } from '@/ts/Paper'
import { notify } from '@/ts/toast'
import { getUserId } from '@/ts/User'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import WebViewer from '@pdftron/webviewer'

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
const viewer = useTemplateRef('viewer')

onMounted(async () => {
  await getPDFDetail(id)
  WebViewer(
    {
      path: '/lib/webviewer',
      initialDoc: paper.value?.fileUrl,
      defaultLanguage: 'zh_cn',
    },
    viewer.value!,
  ).then((instance) => {})
})
</script>

<style scoped></style>
