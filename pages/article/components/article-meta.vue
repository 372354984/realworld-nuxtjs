<template>

  <div class="article-meta">
    <nuxt-link :to="{
      name:'profile',
      parmas:{
        username:article.author.username
      }
    }"><img :src="article.author.image" /></nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
      name:'profile',
      parmas:{
        username:article.author.username
      }
    }">{{article.author.username}}</nuxt-link>

      <span class="date">{{article.createdAt|date("MMM DD, YYYY")}}</span>
    </div>
    <button class="btn btn-sm btn-outline-secondary" :class="{
      active:article.author.following
    }" @click="follow(article.author)">
      <i class="ion-plus-round"></i>
      &nbsp;
      {{article.author.following?'Unfollow':'Follow'}} {{article.author.username}}
    </button>
    &nbsp;&nbsp;
    <button class="btn btn-sm btn-outline-primary" :class="{
      active:article.favorited
    }" @click="onFavorite(article)" :disabled="favoriteDisabled">
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">({{article.favoritesCount}})</span>
    </button>
  </div>
</template>
<script>
  import {
    followUser,
    unfollowUser,
  } from "@/api/user.js"
  import {
    deleteFavorite,
    addFavorite
  } from "@/api/article";

  export default {
    name: "ArticleMeta",
    props: {
      article: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        followDisabled: false,
        favoriteDisabled: false,
      }
    },
    methods: {
      async follow(author) {
        this.followDisabled = true
        if (author.following) {
          await unfollowUser(author.username)
          author.following = false
        } else {
          await followUser(author.username)
          author.following = true
        }
        this.followDisabled = false
      },
      async onFavorite(article) {
        this.favoriteDisabled = true
        if (article.favorited) {
          // 取消点赞
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount--
        } else {
          // 添加点赞
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount++
        }
        this.favoriteDisabled = false
      }
    }
  }
</script>