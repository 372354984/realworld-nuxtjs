<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link class="nav-link  " exact :class="{active:tab==='your_feed'}" :to="{
                  name:'home',
                  query:{
                    tab:'your_feed'
                  }
                }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link  " exact :class="{active:tab==='global_feed'}" :to="{
                  name:'home',
                  query:{
                    tab:'global_feed'
                  }
                }">Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link class="nav-link " :class="{active:tab==='tag'}" :to="{
                  name:'home',
                  query:{
                    tab:'tag',
                    tag:tag
                  }
                }">#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{
                name:'profile', 
                params:{ 
                  username:article.author.username, 
                  } 
                }"><img :src="article.author.image" /></nuxt-link>
              <div class="info">

                <nuxt-link :to="{
                name:'profile', 
                params:{ 
                  username:article.author.username, 
                  } 
                }">{{article.author.username}}
                </nuxt-link>
                <a href="" class="author">Eric Simons</a>
                <span class="date">{{article.createdAt | date("MMM DD, YYYY")}}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{
                active:article.favorited
              }" @click="onFavorite(article)" :disabled="article.favoriteDisabled">
                <i class="ion-heart"></i> {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link class="preview-link" :to="{
              name:'article',
              params:{
                slug:article.slug
              }
            }">
              <h1>{{article.title}}</h1>
              <p>{{article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>


          <nav>
            <ul class="pagination">
              <li class="page-item ng-scope  " v-for="(item,index) in totalPage" :key="index"
                :class="{active: item === page}">
                <nuxt-link :to="{
                  name:'home',
                  query:{
                    page:item,
                    tag:$route.query.tag,
                    tab:tab
                  }
                 }" class="page-link ng-binding">{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link :to="{name:'home',
              query:{tag:item, tab:'tag',}
              }" v-for="item in tags" :key="item" class="tag-pill tag-default">{{item}}</nuxt-link>

            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import {
    getArticles,
    getFeedArticles,
    deleteFavorite,
    addFavorite
  } from "@/api/article";
  import {
    getTags
  } from "@/api/tag.js";
  import {
    mapState
  } from "vuex";
  export default {
    name: 'HomePage',

    async asyncData({
      query,
      store
    }) {
      const limit = 20;
      const page = Number.parseInt(query.page || 1)
      const {
        tag,
        tab = "global_feed"
      } = query

      const loadArticles = store.state.user && tab === "your_feed" ? getFeedArticles : getArticles

      const [
        articlesRes,
        tagRes
      ] = await Promise.all([
        loadArticles({
          limit,
          tag,
          offset: (page - 1) * limit
        }), getTags()
      ])
      const {
        articles,
        articlesCount
      } = articlesRes.data
      const {
        tags
      } = tagRes.data
      articles.forEach(article => article.favoriteDisabled = false)
      return {
        articles,
        articlesCount,
        page,
        limit,
        tags,
        tag,
        tab
      }
    },
    watchQuery: ["page", "tag", "tab"],
    computed: {
      ...mapState(["user"]),
      totalPage() {
        return Math.ceil(this.articlesCount / this.limit)
      }
    },
    methods: {
      async onFavorite(article) {
        article.favoriteDisabled = true
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
        article.favoriteDisabled = false
      }
    }
  }
</script>

<style>
</style>