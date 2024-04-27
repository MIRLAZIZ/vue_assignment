<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { usePostsStore } from '@/@core/stores/posts'
import { onMounted, ref } from 'vue'
import xlsx from 'xlsx/dist/xlsx.full.min'

const ExportExcel = () => {
  const ws = xlsx.utils.json_to_sheet(store.getposts)
  const wb = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1')
  xlsx.writeFile(wb, 'posts.xlsx')
}



const store = usePostsStore()

// headers
const headers = [
  { title: 'User', key: 'userId' },
  { title: 'Title', key: 'title' },
  { title: 'Post', key: 'body' },
  { title: 'Actions', key: 'actions' },

]
// 👉 methods
// const deleteItem = (itemId: number) => {
//   if (!productList.value)
//     return


onMounted(() => {
  if (!store.getposts.length) {
    store.fetchPosts()
  }

  if (!store.users.length) {
    store.fetchUsers()
      .then(() => {
        store.users.forEach((user) => {
          user.userId = user.id.toString()
        })
      })
  }

})

const getUserName = (id) => {
  return store.users.find((user) => user.id === id)?.name
}





</script>

<template>
  <div>
    <div class="d-flex gap-3  align-end justify-end mb-6 ">
      <div class="w-25">
        <AppSelect :items="store.users" label="Filter" placeholder="Select User" item-title="name" item-value="userId"
          v-model="store.search" clearable clear-icon="tabler-x" density="compact" />
      </div>


      <VBtn class="" @click="ExportExcel">

        <VIcon icon="tabler-upload" />

        Export
      </VBtn>
      <VBtn class="" @click="$router.push('/posts/create')">
        <VIcon icon="tabler-plus" /> Add post
      </VBtn>


    </div>



    <!-- 👉 Data Table  -->
    <VDataTable v-if="store.getposts.length" :headers="headers" :items="store.getposts || []" :search="store.search"
      :items-per-page="store.options.itemsPerPage" :page="store.options.page" class="text-no-wrap">

      <!-- item  user name -->
      <template #item.userId="{ item }">

        {{ getUserName(item.userId) }}
      </template>

      <!-- item.title substring(0, 20) -->
      <template #item.title="{ item }">
        {{ item.title && item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title }}


      </template>



      <!-- item.body substring(0, 20) -->
      <template #item.body="{ item }">

        {{ item.body && item.body.length > 20 ? item.body?.substring(0, 20) + '...' : item.body }}

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
          <IconBtn>
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
              :length="Math.ceil(store.getposts.length / store.options.itemsPerPage)" />
          </div>
        </VCardText>
      </template>








    </VDataTable>
  </div>
</template>
