<template>
  <div class="w-full bg-white px-2 py-2 rounded-2xl min-h-screen">
    <TabGroup>
      <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
        <Tab v-for="category in categories" as="template" :key="category" v-slot="{ selected }">
          <button
            :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all',
              selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-40 hover:bg-white/[0.12] hover:text-white',
            ]"
          >
            {{ category }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="mt-2 transition-all">
        <TabPanel
          v-for="(c, idx) in categories"
          :key="idx"
          :class="[
            'rounded-xl bg-white p-3 flex flex-col gap-4',
            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          ]"
        >
          <template v-if="idx === 0">
            <WorkCard v-for="(work, i) in works" :work="work" :key="i" />
          </template>
          <template v-else-if="idx === 1">
            <PersonCard v-for="(p, i) in persons" :person="p" :key="i" />
          </template>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import WorkCard from './WorkCard.vue'
import PersonCard from './PersonCard.vue'
import type { Work } from '@/js/Work'
import type { Person } from '@/js/Person'

const categories = ['文章', '同仁', '热点']

const works: Work[] = [
  {
    id: '1',
    title: 'Understanding the Impact of AI on Coffee Production',
    authors: [
      { name: 'Alice Smith', id: 1 },
      { name: 'Bob Johnson', id: 2 },
    ],
    fields: ['Agriculture', 'AI'],
    keywords: ['AI', 'Coffee', 'Agriculture'],
    abstract:
      'This paper explores how AI technologies are transforming coffee production processes, enhancing yield and quality. It discusses the integration of machine learning algorithms in crop management and quality assessment. The findings suggest significant improvements in efficiency and sustainability. The study highlights the potential of AI to revolutionize traditional agricultural practices, particularly in the coffee industry.',
    date: new Date('2023-10-01'),
    type: 'arxiv',
    source: 'unknown',
    likes: 120,
    comments: 45,
  },
  {
    id: '2',
    title: 'AI in Coffee Quality Assessment',
    authors: [
      { name: 'Alice Smith', id: 1 },
      { name: 'Bob Johnson', id: 2 },
    ],
    fields: ['Food Science', 'AI', 'Quality Control', 'Machine Learning', 'Sensory Analysis'],
    keywords: ['AI', 'Coffee Quality', 'Food Science'],
    abstract:
      'This study investigates the use of AI in assessing coffee quality, focusing on sensory analysis and machine learning techniques. It highlights how AI can predict flavor profiles and optimize roasting parameters, leading to better quality control in coffee production. The results indicate a promising future for AI applications in the coffee industry.',
    date: new Date('2023-09-15'),
    type: 'arxiv',
    source: 'unknown',
    likes: 95,
    comments: 30,
  },
]

const persons: Person[] = [
  {
    id: 1,
    email: 'lyq2026@outlook.com',
    username: 'Alice Smith',
    degree: 'PhD',
    title: 'AI Researcher',
    institution: 'Coffee University',
    researchArea: 'AI in Agriculture',
    bio: 'Expert in AI applications in agriculture.',
    avatar: 'https://knowfc.oss-cn-beijing.aliyuncs.com/avatar/3d.jpg',
  },
  {
    id: 2,
    email: '',
    username: 'Bob Johnson',
    degree: 'MSc',
    title: 'Food Scientist',
    institution: 'Coffee Institute',
    researchArea: 'Food Quality Control',
    bio: 'Specializes in food quality assessment using AI.',
    avatar: 'https://knowfc.oss-cn-beijing.aliyuncs.com/avatar/3d.jpg',
  },
]
</script>
