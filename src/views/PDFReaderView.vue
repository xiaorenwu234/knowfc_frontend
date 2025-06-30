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
const xfdfRegex = /([^/]+?)(?:\.pdf)?$/
const getXfdfName = (pdfUrl: string) => {
  const match = pdfUrl.match(xfdfRegex)
  if (match) {
    return `${match[1]}_${getUserId()}.xfdf`
  }
  throw new Error('无法解析 URL')
}
const getXfdfUrl = (xfdfName: string) => {
  return `https://knowfc.oss-cn-beijing.aliyuncs.com/notes/${xfdfName}`
}
const postNotes = async (url: string, xfdfString: string) => {
  const formData = new FormData()
  const xfdf = new File([xfdfString], 'note')
  formData.append('url', url)
  formData.append('note', xfdf)
  try {
    await instance.post('/paper/note', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  } catch (error) {
    notify('error', '笔记保存失败', error?.toString())
  }
}

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
      throw new Error('文件路径未知')
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
    const { documentViewer, annotationManager } = instance.Core
    const xfdfName = getXfdfName(url)
    const xfdfUrl = getXfdfUrl(xfdfName)
    const xfdf = await (await fetch(xfdfUrl)).text()
    documentViewer.addEventListener('documentLoaded', async () => {
      await annotationManager.importAnnotations(xfdf)
    })
    documentViewer.addEventListener('annotationsLoaded', () => {
      annotationManager.addEventListener('annotationChanged', () => {
        annotationManager.exportAnnotations().then((xfdfString) => {
          postNotes(xfdfName, xfdfString)
          console.log(xfdfName, 'uploaded')
        })
      })
    })
  })
})
</script>

<style scoped></style>
