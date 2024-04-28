<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { usePostsStore } from '@/@core/stores/posts'
import { onMounted, ref } from 'vue'
import xlsx from 'xlsx/dist/xlsx.full.min'
import DeleteDialog from '@/components/posts/DeleteDialog.vue'
import UserMaps from '@/components/posts/UserMaps.vue'

const store = usePostsStore()
const deleteDialog = ref(false)
const deleteIndex = ref(null)
const load = ref(false)

// headers
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'User', key: 'userId' },
  { title: 'Title', key: 'title' },
  { title: 'Post', key: 'body' },
  { title: 'Actions', key: 'actions' },

]

// export filtered data to excel
const fileteredData = (id) => {
  store.filterExport = store.getposts
    .filter((post) => post.userId == id)
    .map((post) => ({
      id: post.id.toString(),
      name: getUserName(post.userId),
      title: post.title,
      body: post.body
    }));
  store.postsTotlal = store.filterExport.length ? store.filterExport.length : store.getposts.length
  store.options.itemsPerPage = store.filterExport.length ? store.filterExport.length : 10
}

// store posts ?
const getpostData = () => {
  if (!store.getposts.length) {
    load.value = true

    store.fetchPosts().then(() => {
      store.postsTotlal = store.getposts.length
      load.value = false
    })
  }
}

// store users 
const getuserData = () => {
  if (!store.users.length) {
    store.fetchUsers()
      .then(() => {
        store.users.forEach((user) => {
          user.name = store.users.find((u) => u.id === user.id)?.name
          user.userId = user.id.toString()

        })
      })
  }
}



onMounted(() => {

  getpostData()
  getuserData()




})

// get user name 
const getUserName = (id) => {
  return store.users.find((user) => user.id === id)?.name
}

// Export Excel
const ExportExcel = () => {
  const posts = store.filterExport;

  const ws = xlsx.utils.json_to_sheet(posts);

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

  ws['!cols'] = [];
  const range = xlsx.utils.decode_range(ws['!ref']);
  for (let C = range.s.c; C <= range.e.c; C++) {
    const maxWidth = Math.max(
      ...posts.map(row => {
        const cell = xlsx.utils.encode_cell({ r: posts.indexOf(row) + 1, c: C });
        const width = ws[cell] ? ws[cell].v.toString().length * 1.1 : 10;
        return width;
      })
    );
    ws['!cols'][C] = { width: maxWidth };
  }

  xlsx.writeFile(wb, 'posts.xlsx');
}

// delete post item 
const deleteItem = (id) => {
  console.log(id);
  deleteIndex.value = store.getposts.findIndex(post => post.id == id)
  deleteDialog.value = true
}

//  delete confirmation
const deleteItemConfirm = () => {
  store.getposts.splice(deleteIndex.value, 1)
  deleteDialog.value = false
}
</script>

<template>
  <div>
    <div class="d-flex gap-3  align-end justify-end mb-6 ">

      <!-- filter pots user  -->
      <div class="w-25">
        <AppSelect :items="store.users" label="Filter" placeholder="Select User" item-title="name" item-value="userId"
          v-model="store.search" clearable clear-icon="tabler-x" density="compact"
          @update:model-value="fileteredData(store.search)" />
      </div>

      <!-- excel export -->
      <VBtn class="" @click="ExportExcel" :disabled="!store.filterExport.length">
        <VIcon icon="tabler-upload" />
        Export
      </VBtn>

      <!-- add post -->
      <VBtn class="" @click="$router.push('/posts/create')">
        <VIcon icon="tabler-plus" /> Add post
      </VBtn>
    </div>



    <!-- 👉 Data Table  -->
    <VDataTable v-if="store.getposts.length" :headers="headers" :items="store.getposts || []" :search="store.search"
      :items-per-page="store.options.itemsPerPage" :page="store.options.page" class="text-no-wrap" :loading="load">

      <!-- item  user name -->
      <template #item.userId="{ item }">

        {{ getUserName(item.userId) }}
      </template>

      <!-- item.title substring(0, 20) -->
      <template #item.title="{ item }">
        {{ item.title && item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title }}


      </template>



      <!-- item.body substring(0, 30) -->
      <template #item.body="{ item }">

        {{ item.body && item.body.length > 30 ? item.body?.substring(0, 30) + '...' : item.body }}

      </template>


      <!-- Actions -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">


          <!-- wiews item -->
          <IconBtn @click="$router.push(`/posts/views/${item.id}`)">
            <VIcon icon="tabler-eye" color="primary" />
          </IconBtn>

          <!-- edit item -->
          <IconBtn @click="$router.push(`/posts/edit/${item.id}`)">
            <VIcon icon="tabler-edit" color="success" />
          </IconBtn>

          <!-- delete item -->
          <IconBtn @click="deleteItem(item.id)">
            <VIcon icon="tabler-trash" color="error" />
          </IconBtn>
        </div>
      </template>


      <!-- pagination -->
      <template #bottom>
        <VCardText class="pt-2">
          <div class="d-flex justify-space-between">

            <VTextField v-model="store.options.itemsPerPage" label="Rows per page:" type="number" min="-1" hide-details
              variant="underlined" style="max-inline-size: 8rem;min-inline-size: 5rem;" />

            <VPagination v-if="store.getposts.length" v-model="store.options.page"
              :total-visible="$vuetify.display.smAndDown ? 3 : 5"
              :length="Math.ceil(store.postsTotlal / store.options.itemsPerPage)" />
          </div>
        </VCardText>
      </template>
    </VDataTable>

    <!-- delete dialog -->
    <DeleteDialog v-model:delete-dialog="deleteDialog" @closeDelete="deleteDialog = false"
      @deleteItemConfirm="deleteItemConfirm" />

    <!-- user maps -->
    <UserMaps :users="store.users" />


  </div>
</template>
