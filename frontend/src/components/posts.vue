<template>
  <section id="posts-container">
    <article v-for="post in showPosts" :key="post.id">
      <header class="header-post">
        <img
          :src="post.User.avatar_url"
          :alt="'Avatar de ' + post.User.firstname + ' ' + post.User.name"
        />
        <div class="header-text">
          <p class="header-text__name">
            {{ post.User.firstname }} {{ post.User.name }}
          </p>
          <p class="header-text__relativetime">
            Publié {{ formatDate(post.formatted_date) }}
          </p>
        </div>
        <button
          v-if="
            $store.state.connectedUser != null &&
            (post.UserId == $store.state.userId ||
              $store.state.connectedUser.admin == true)
          "
          title="Supprimer ce post"
          @click="deletePost(post.id)"
        >
          <font-awesome-icon :icon="['fas', 'trash-alt']" />
        </button>
      </header>
      <section class="post-picture">
        <img
          :src="post.img_url"
          :alt="
            'Publication de' + post.User.name + ' ' + post.User.firstname
          "
        />
      </section>
      <div class="likes-container">
        <button class="like-button like" @click="likePost(post.id, 1)">
          <font-awesome-icon :icon="['fas', 'thumbs-up']" />
          <span>{{ post.likes }}</span>
        </button>
        <button class="like-button dislike" @click="likePost(post.id, -1)">
          <font-awesome-icon :icon="['fas', 'thumbs-down']" />
          <span>{{ post.dislikes }}</span>
        </button>
      </div>
      <Comments :post="post" />
    </article>
  </section>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import Comments from "./comments";
import { mapActions, mapGetters } from "vuex";
// Pour la gestion des dates
import moment from "moment";
moment.locale("fr");

export default {
  name: "Posts",
  components: {
    Comments,
  },
  computed: {
    ...mapGetters(["showPosts"]),
  },
  methods: {
    ...mapActions(["getPosts"]),
    formatDate(date) {
      let relativeDate = moment(date).add(2, "h").fromNow();
      return relativeDate;
    },
    deletePost(postId) {
      Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer ce post ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        confirmButtonColor: "#32c068",
        cancelButtonText: "Non",
        cancelButtonColor: "#e24b43",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete("/posts/" + postId)
            .then(() => {
              this.getPosts();
            })
            .catch(() => {
              // console.log(error);
            });
        }
      });
    },
    likePost(postId, likeValue) {
      axios
        .post("/posts/like", {
          postId: postId,
          userId: parseInt(this.$store.state.userId),
          likeValue: likeValue,
        })
        .then(() => {
          this.getPosts();
        })
        .catch(() => {
          // console.log(error);
        });
    },
  },
  mounted() {
    this.getPosts();
  },
};
</script>

<style lang="scss">
@import "../sass/colors";

#posts-container {
  width: 100%;
  @media screen and (max-width: 600px) {
    width: 100%;
  }
  article {
    background-color: rgba($black, 0.1);
    margin-bottom: 40px;
    border-radius: 10px;
    box-shadow: 0 0 6px rgba($black, 0.2);
  }
  .header-post {
    height: 56px;
    background-color: $tertiary-color;
    border-radius: 10px 10px 0px 0px;
    display: flex;
    align-items: center;
    padding: 10px;
    img {
      margin-left: 10px;
      height: 46px;
      width: 46px;
      object-fit: cover;
      object-position: left;
      border-radius: 50%;
      box-shadow: 0 0 3px rgba($black, 0.5);
    }
    .header-text {
      margin-left: 12px;
      &__name {
        font-weight: 500;
        font-size: 1.1rem;
      }
      &__relativetime {
        font-weight: 300;
      }
    }
    button {
      margin: 0 10px 0 auto;
      color: $error-color;
      border: none;
      border-radius: 10px;
      background-color: $tertiary-color;
      font-size: 1.4rem;
      padding: 2px 5px;
      transition: 0.1s;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .post-picture {
    display: flex;
    max-height: 400px;
    background-color: white;
    padding-top: 10px;
    img {
      width: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
  .likes-container {
    display: flex;
    justify-content: center;
    background-color: $white;
    padding: 20px 0;
    .like-button {
      width: 20%;
      height: 40px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      cursor: pointer;
      &.like {
        color: $success-color;
        background-color: $white;
        border: none;
        cursor: pointer;
          &:hover {
            transform: scale(0.9);
          }

      }
      &.dislike {
        color: $error-color;
        background-color: $white;
        border: none;
        cursor: pointer;
          &:hover {
            transform: scale(0.9);
          }

      }
      svg {
        font-size: 1.3rem;
        margin-right: 5px;
      }
      span {
        font-family: "system-ui";
        font-weight: 500;
        font-size: 1.2rem;
      }
    }
  }
}
</style>