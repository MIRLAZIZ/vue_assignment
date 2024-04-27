<template>
  <div>


    <VRow>

      <VCol cols="4" class="">

        <VCard class="pa-5">
          <h2>Post</h2>
          <h3> {{ getUserName(postData.userId) }} </h3>
          <h4>{{ postData.title }}</h4>
          <br>
          <p>{{ postData.body }}</p>
        </VCard>


      </VCol>
      <VCol cols="8" class="">

        <VCard class="pa-5">
          <h2>Comments</h2>

          <div v-for="comment in store.comments" class="border mt-3 rounded pa-3">
            <h3>{{ comment.email }}</h3>
            <h4>{{ comment.name }}</h4>
            <br>
            <p>{{ comment.body }}</p>
          </div>
          <!-- <pre>
              {{ store.comments }}

            </pre> -->
          <div>

          </div>



        </VCard>

      </VCol>
    </VRow>


  </div>
</template>

<script setup>
import { usePostsStore } from '@/@core/stores/posts';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute().params.id
const store = usePostsStore()
const postData = ref({})
const getUserName = (id) => {
  return store.users.find((user) => user.id === id)?.name
}



const getpostData = (id) => {
  if (!store.getposts.length) {
    store.fetchPosts()
      .then(() => {
        postData.value = store.PostDataOne(route)
      })
  } else {
    postData.value = store.PostDataOne(route)
  }
}

// get user data 
const getuserData = () => {
  if (!store.users.length) {
    store.fetchUsers()
  }
}


onMounted(() => {
  getpostData()
  getuserData()
  store.fetchComments(route)




})

</script>
