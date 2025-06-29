<template>
  <div class="h-screen bg-white" id="webviewer" ref="viewer"></div>
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
  WebViewer(
    {
      path: '/lib/webviewer',
    },
    viewer.value!,
  ).then(async (instance) => {
    await getPDFDetail(id)
    const url = paper.value?.fileUrl
    instance.UI.setLanguage('zh_cn')
    if (!url) {
      notify('error', '文件路径未知')
    } else if (url.startsWith('http://arxiv.org')) {
      const response = await fetch(url)
      if (!response.ok) {
        notify('error', '文件下载失败')
        throw new Error('Download failed: ' + response.status)
      }
      const blob = await response.blob()
      instance.UI.loadDocument(blob, { filename: url.substring(21) + '.pdf' })
    } else {
      instance.UI.loadDocument(url)
    }
    const { annotationManager } = instance.Core
    annotationManager.addEventListener('annotationChanged', () => {})
  })
})
</script>

<style scoped></style>
