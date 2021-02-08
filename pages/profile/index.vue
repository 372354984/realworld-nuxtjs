 <template>
   <div class="profile-page">
     <div class="user-info">
       <div class="container">
         <div class="row">
           <div class="col-xs-12 col-md-10 offset-md-1">
             <img :src="profile.image" class="user-img" />
             <h4>{{profile.username}}</h4>
             <p>
               {{profile.bio}}
             </p>
             <button class="btn btn-sm btn-outline-secondary action-btn" @click="follow()"
               :disabled="profile.followDisabled">
               <i class="ion-plus-round"></i>
               &nbsp; {{profile.following?'Unfollow':'Follow'}} {{profile.username}}
             </button>
           </div>
         </div>
       </div>
     </div>

     <div class="container">
       <div class="row">
         <div class="col-xs-12 col-md-10 offset-md-1">
           <div class="articles-toggle">
             <ul class="nav nav-pills outline-active">
               <li class="nav-item">
                 <nuxt-link class="nav-link" exact :class="{
                   active:tab==='author'
                 }" :to="{
                   name:'profile',
                   query:{
                     tab:'author'
                   },  params:{ 
                  username:profile.username, 
                  } 
                 }">My Articles</nuxt-link>
               </li>
               <li class="nav-item">
                 <nuxt-link class="nav-link" exact :class="{
                   active:tab==='favorited'
                 }" :to="{
                   name:'profile',
                   query:{
                     tab:'Favorited'
                   },  params:{ 
                  username:profile.username, 
                  } 
                 }">Favorited Articles</nuxt-link>
               </li>
             </ul>
           </div>

           <div class="article-preview" v-for="article in articles" :key="article.id">
             <div class="article-meta">
               <nuxt-link :to='{
                 name:"profile",
                  params:{ 
                  username:article.author.username, 
                  } 
               }'><img :src="article.author.image" /></nuxt-link>
               <div class="info">
                 <nuxt-link :to='{
                 name:"profile",
                   params:{ 
                  username:article.author.username, 
                  } 
               }'>{{article.author.username}}</nuxt-link>
                 <span class="date">{{article.createdAt| date("MMM DD, YYYY")}}</span>
               </div>
               <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{
                 active:article.favorited
               }">
                 <i class="ion-heart"></i> {{article.favoritesCount}}
               </button>
             </div>
             <nuxt-link :to="{
               name:'article',
               params:{
                 slug:article.slug
               }
             }" class="preview-link">
               <h1>{{article.title}}</h1>
               <p>{{article.body}}</p>
               <span>Read more...</span>
             </nuxt-link>
             <ul class="tag-list">
               <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList" :key="tag">{{tag}}</li>
             </ul>
           </div>


         </div>
       </div>
     </div>
   </div>
 </template>

 <script>
   import {
     getProfile,
     followUser,
     unfollowUser
   } from "@/api/user.js"
   import {
     getArticles
   } from "@/api/article.js";
   export default {
     middleware: "authenticated",
     name: "UserProfile",
     async asyncData({
       params,
       query
     }) {

       const tab = query.tab || 'author'

       const [data, articleRes] = await Promise.all([
         getProfile(params.username),
         getArticles({
           [tab]: params.username
         })
       ])
       const {
         profile
       } = data.data;
       const {
         articles
       } = articleRes.data;
       console.log(articleRes)
       profile.followDisabled = false
       return {
         profile,
         articles,
         tab
       }
     },
     watchQuery: ["tab"],
     methods: {
       async follow() {
         this.profile.followDisabled = true
         if (this.profile.following) {
           await unfollowUser(this.profile.username)
           this.profile.following = false
         } else {
           await followUser(this.profile.username)
           this.profile.following = true
         }
         this.profile.followDisabled = false
       }
     }

   }
 </script>


 <style>
 </style>