import { $api } from '@/utils/api'
import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    getposts: [],
    search: '',
    options: { page: 1, itemsPerPage: 10 },
    users: [],
    comments: [],
    filterExport: [],
    postsTotlal: 0



  }),
  actions: {

    // get posts
    async fetchPosts() {
      return await $api(`/posts`)
        .then(res => {
          this.getposts = res
        })
    },

    // get users
    async fetchUsers() {
      return await $api(`/users`)
        .then(res => {
          this.users = res
        })
    },

    // find post by id
    PostDataOne(id) {
      return this.getposts.find((post) => post.id == id)
    },

    // get comments
    async fetchComments(id) {
      return await $api(`/comments?postId=${id}`)
        .then(res => {
          this.comments = res
        })
    },

    // create post
    async createPost(data) {
      return await $api('/posts', {
        method: 'POST',
        body: data

      })
    },
    // update post
    async updatePost(id, data) {
      return await $api(`/posts/${id}`, {
        method: 'PUT',
        body: data
      })
    }



  },
})

///comments?postId=1

// comments










