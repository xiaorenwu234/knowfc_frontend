<template>
  <div ref="networkContainer" id="mynetwork" style="width: 100%; height: 600px"></div>
</template>

<script setup>
import "vis/dist/vis.css";
import { onMounted, ref } from "vue";
import { Network } from "vis";
import { DataSet } from "vis";

const networkContainer = ref(null);
const network = ref(null);
const nodes = new DataSet([
  { id: 1, label: "Node 1", shape: 'circularImage', image: '/image.png' },
  { id: 2, label: "Node 2", shape: 'circle', color: '#97C2FC' },
  { id: 3, label: "Node 3", shape: 'box', color: '#FFA807' },
  { id: 4, label: "Node 4", shape: 'diamond', color: '#FB7E81' },
  { id: 5, label: "Node 5", shape: 'star', color: '#7BE141' },
  { id: 6, label: "Node 6", shape: 'triangle', color: '#6E6EFD' },
  { id: 7, label: "Node 7", shape: 'ellipse', color: '#C2FABC' },
  { id: 8, label: "Node 8", shape: 'database', color: '#FF8C42' },
  { id: 9, label: "Node 9", shape: 'hexagon', color: '#EA3546' },
  { id: 10, label: "Node 10", shape: 'square', color: '#662E9B' },
]);

const edges = new DataSet([
  { from: 1, to: 2, label: "edge 1-2", width: 2 },
  { from: 1, to: 3, label: "edge 1-3", width: 1, dashes: true },
  { from: 2, to: 4, label: "edge 2-4", color: { color: 'red' } },
  { from: 2, to: 5, label: "edge 2-5", arrows: 'to' },
  { from: 3, to: 6, label: "edge 3-6", arrows: 'from,to' },
  { from: 4, to: 7, label: "edge 4-7", color: 'green' },
  { from: 5, to: 8, label: "edge 5-8", width: 3 },
  { from: 6, to: 9, label: "edge 6-9", dashes: [5, 5] },
  { from: 7, to: 10, label: "edge 7-10" },
  { from: 8, to: 10, label: "edge 8-10", arrows: 'middle' },
  { from: 9, to: 10, label: "edge 9-10", smooth: { type: 'curvedCW' } },
  { from: 1, to: 10, label: "edge 1-10", length: 200 },
]);

const drawNetwork = () => {
  const container = networkContainer.value;
  const data = {
    nodes: nodes,
    edges: edges,
  };
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
  };

  network.value = new Network(container, data, options);
};

onMounted(() => {
  drawNetwork();
});
</script>

<style>
#mynetwork {
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fbfbfb;
}
</style>
