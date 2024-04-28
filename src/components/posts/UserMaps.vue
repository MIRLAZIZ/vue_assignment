<template>
  <div>
    <h2 class="my-4 mt-10">Users maps</h2>
    <div ref="mapContainer" class="container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet'

const props = defineProps({
  users: {
    type: Array,
    required: true,
  }
})
const map = ref()
const mapContainer = ref()

onMounted(() => {
  map.value = L.map(mapContainer.value).setView([51.505, -0.09], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">copyright</a>'
  }).addTo(map.value);

  // props users data dinamic
  if (props.users) {
    setTimeout(() => {
      props.users.forEach(user => {
        map.value.setView([user.address.geo.lat, user.address.geo.lng], 2);
        L.marker([user.address.geo.lat, user.address.geo.lng], { draggable: false, title: user.name }).addTo(map.value);
      })
    }, 1000)
  }

  L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }).addTo(map.value);


})
</script>

<style scoped>
.container {
  /* stylelint-disable-next-line liberty/use-logical-spec */
  width: 100%;
  /* stylelint-disable-next-line liberty/use-logical-spec */
  height: 400px;
}
</style>
