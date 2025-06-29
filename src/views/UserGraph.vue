<template>
  <div ref="networkContainer" id="mynetwork" style="width: 100%; height: 600px"></div>
</template>

<script setup>
import 'vis/dist/vis.css'
import { onMounted, ref } from 'vue'
import { Network } from 'vis'
import { DataSet } from 'vis'
import { getGraph } from '@/ts/graph.js'

const networkContainer = ref(null)
const network = ref(null)
const nodes = ref()
const edges = ref()

const drawNetwork = () => {
  const container = networkContainer.value
  const data = {
    nodes: nodes.value,
    edges: edges.value
  }
  const options = {
    nodes: {
      borderWidth: 3,  // 增加边框宽度
      size: 30,        // 增加节点大小
      shape: 'circularImage', // 圆形图片样式
      color: {
        border: '#2B7CE9',
        background: '#FFCC00', // 节点背景色
        highlight: {
          border: '#FF5733',
          background: '#FFD700'
        },
        hover: {
          border: '#FF5733',
          background: '#FFD700'
        }
      },
      font: {
        color: '#111111',
        size: 16,  // 更大字体
        face: 'Helvetica', // 更现代的字体
        background: 'transparent'
      },
      shadow: true,
      borderWidthSelected: 4  // 选中节点时边框宽度
    },
    edges: {
      color: {
        color: 'lightgray',
        highlight: '#FF5733', // 高亮边的颜色
        hover: '#FF5733'
      },
      width: 2, // 增加边的宽度
      smooth: {
        type: 'continuous',
        forceDirection: 'none',
        roundness: 0.5  // 边的弯曲效果
      },
      arrows: {
        to: { enabled: true, scaleFactor: 0.7 }  // 增加箭头指示方向
      },
      font: {
        color: '#343434',
        size: 14,
        strokeWidth: 1,
        align: 'middle'
      },
      selectionWidth: 3, // 选中边时的宽度
      shadow: true
    },
    physics: {
      enabled: true,
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -140,
        centralGravity: 0.008,
        springLength: 150,
        springConstant: 0.04
      },
      stabilization: {
        iterations: 1000,
        updateInterval: 25,
        fit: true
      },
      adaptiveTimestep: false,  // 关闭自适应时间步长，减少抖动
      barnesHut: {
        avoidOverlap: 1
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      hideEdgesOnDrag: true,
      multiselect: true
    }
  }

  // 在节点数据中直接使用 avatar 字段设置图片
  nodes.value.forEach(node => {
    node.image = node.avatar || '';  // 确保头像字段正确
  })

  network.value = new Network(container, data, options)
}


onMounted(() => {
  getGraph().then(res => {
    console.log(res)
    nodes.value = res.nodes
    edges.value = res.edges
    drawNetwork()
  })
})
</script>

<style>
#mynetwork {
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fbfbfb;
}
</style>
