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
      borderWidth: 3,
      size: 30,
      shape: 'circularImage',
      color: {
        border: '#2B7CE9',
        background: '#FFCC00',
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
        size: 16,
        face: 'Helvetica',
        background: 'transparent'
      },
      shadow: true,
      borderWidthSelected: 4
    },
    edges: {
      color: {
        color: 'lightgray',
        highlight: '#FF5733',
        hover: '#FF5733'
      },
      width: 2,
      smooth: {
        type: 'continuous',
        forceDirection: 'none',
        roundness: 0.5
      },
      arrows: {
        to: { enabled: true, scaleFactor: 0.7 }
      },
      font: {
        color: '#343434',
        size: 14,
        strokeWidth: 1,
        align: 'middle'
      },
      selectionWidth: 3,
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
      adaptiveTimestep: false,
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


  const generateTextImage = (text) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 75;
    canvas.height = 75;

    ctx.fillStyle = '#FFCC00';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '16px Helvetica';
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL();
  }

  nodes.value.forEach(node => {
    node.image = node.avatar || generateTextImage(`${node.entityType === 'USER' ? '用户' : node.entityType === 'INSTITUTION' ? '机构' : '研究领域'}`);
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
