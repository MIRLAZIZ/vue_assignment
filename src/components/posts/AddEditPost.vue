<template>
  <div>

    <h1>{{ $route.params.id ? 'Edit post' : 'Create Post' }}</h1>

    <!-- 👉 Form -->
    <VForm ref="refForm" @submit.prevent="sendPost">
      <VRow>

        <!-- 👉 select user -->
        <VCol cols="6">
          <AppSelect v-model="productData.userId" label="Select user" placeholder="Select user"
            :rules="[requiredValidator]" :items="store.users" item-title="name" item-value="id" />
        </VCol>

        <!-- 👉 title -->
        <VCol cols="6">
          <AppTextField v-model="productData.title" :rules="[requiredValidator]" label="Title" />
        </VCol>

        <!-- 👉 post -->
        <VCol cols="6">
          <AppTextarea v-model="productData.body" :rules="[requiredValidator]" rows="4" label="Post" />
        </VCol>

        <!-- btn group -->
        <VCol cols="12" class="d-flex justify-end">
          <VBtn variant="outlined" color="secondary" @click="closeNavigationDrawer">
            Cancel
          </VBtn>

          <VBtn type="submit" class="ml-3">
            Submit
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { usePostsStore } from '@/@core/stores/posts';
import { useRoute, useRouter } from 'vue-router';
import { useConfigStore } from '@/@core/stores/config';

const route = useRoute().params.id
const router = useRouter()
const storeConfig = useConfigStore()

const productData = ref({
  title: null,
  body: null,
  userId: null,
})

const store = usePostsStore()
const refForm = ref()

// send post method
const sendPost = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {

      if (route) {
        store.updatePost(route, productData.value).then(() => {
          router.push('/')

        }).catch((err) => {
          if (!err.response.ok) {
            storeConfig.errorToast('server error')
          }
        })
      } else {
        store.createPost(productData.value).then((res) => {
          store.getposts.unshift(res)
          router.push('/')
        })
          .catch((err) => {
            if (!err.response.ok) {
              storeConfig.errorToast('server error')
            }
          })
      }
    }
  })
}

// close page method
const closeNavigationDrawer = () => {
  refForm.value?.resetValidation()
  router.push('/')

}

// get post data
const getpostData = () => {
  if (!store.getposts.length) {
    store.fetchPosts()
      .then(() => {
        store.PostDataOne(route) ? productData.value = store.PostDataOne(route) : closeNavigationDrawer()
      })
  } else {
    productData.value = store.PostDataOne(route)

  }
}

// get user data
const getuserData = () => {
  if (!store.users.length) {
    store.fetchUsers()
  }
}



onMounted(() => {
  getuserData()

  if (route) {

    getpostData()
  }


})

</script>
