<template>
  <form @submit.prevent="createPost" id="create-post-form">
    <input
      type="file"
      name="image-input"
      accept=".png, .jpg, .jpeg, .gif"
      id="image-input"
      class="add-post-button"
      @change="updateFilename"
    />
    <label for="image-input">
      <div v-if="imagePreview">
        <img
          :src="imagePreview"
          class="image-preview"
          alt="Preview de l'image"
        />
      </div>
      <div v-else>
        <font-awesome-icon class="font-awesome" :icon="['fas', 'upload']" /><br />
        <span>Publier une image</span>
      </div>
      <button type="submit" v-if="imagePreview">Envoyer</button>
    </label>
  </form>
</template>

<script>
import axios from "axios";
export default {
  name: "create-post",
  data() {
    return {
      imagePreview: null,
      filename: null,
    };
  },
  methods: {
    updateFilename() {
      let inputFilename = document.querySelector(".add-post-button");
      this.filename = inputFilename.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.filename);
    },
    createPost() {
      const formData = new FormData();
      formData.append("userId", this.$store.state.userId);
      formData.append("image", this.filename);
      axios
        .post("/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          this.imagePreview = null;
          this.$store.dispatch("getPosts");
        })
        .catch(() => {
          // console.log(error);
        });
    },
  },
};
</script>

<script>
import axios from "axios";

export default {
  name: "create-post",
  data() {
    return {
      imagePreview: null,
      filename: null,
    };
  },
  methods: {
    updateFilename() {
      let inputFilename = document.querySelector(".add-post-button");
      this.filename = inputFilename.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.filename);
    },
    createPost() {
      const formData = new FormData();
      formData.append("userId", this.$store.state.userId);
      formData.append("image", this.filename);
      axios
        .post("/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          this.imagePreview = null;
          this.$store.dispatch("getPosts");
        })
        .catch(() => {
          // console.log(error);
        });
    },
  },
};
</script>

<style lang="scss">
@import "../sass/colors";

#create-post-form{
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
}
.add-post-button {
  text-align: center;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
  & + label {
    text-align: center;
    border-radius : 10px;
    width: 100%;
    font-size: 1.2em;
    font-weight: 500;
    background-color: $white;
    display: inline-block;
    cursor: pointer;
    svg {
      transition: 0.3s;
      font-size: 5rem;
      padding-bottom: 5px;
      margin-bottom: 10px;
      color:$secondary-color;
    }
    .image-preview {
      max-height: 250px;
      max-width: 90%;
      margin-top: 10px;
    }
    button {
      color: $white;
      font-weight: 500;
      font-size: 1.2rem;
      appearance: none;
      border: none;
      padding: 6px 15px;
      background-color: rgba($primary-color, 0.9);
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  &:focus + label,
  & + label:hover {
    & > div svg {
      transform: scale(1.2);
    }
  }
}
</style>