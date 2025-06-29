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
      borderWidth: 2,
      size: 25,
      color: {
        border: '#222222',
        background: '#666666',
        highlight: {
          border: '#2B7CE9',
          background: '#D2E5FF'
        },
        hover: {
          border: '#2B7CE9',
          background: '#D2E5FF'
        }
      },
      font: {
        color: '#eeeeee',
        size: 14,
        face: 'arial'
      },
      shadow: true
    },
    edges: {
      color: {
        color: 'lightgray',
        highlight: '#2B7CE9',
        hover: '#2B7CE9'
      },
      width: 1,
      smooth: {
        type: 'continuous'
      },
      arrows: {
        to: { enabled: false, scaleFactor: 1 }
      },
      font: {
        color: '#343434',
        size: 12,
        strokeWidth: 0,
        align: 'middle'
      },
      selectionWidth: 2,
      shadow: true
    },
    physics: {
      enabled: true,
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springLength: 100,
        springConstant: 0.08
      },
      stabilization: {
        iterations: 1000,
        updateInterval: 25
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      hideEdgesOnDrag: true,
      multiselect: true
    }
  }

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
