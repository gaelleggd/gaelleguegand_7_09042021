<template>
  <section v-if="user" class="profile-box">
    <div class="col">
    <h2>Bonjour {{ user.firstname }}</h2>
    <img :src="user.avatar_url" alt="Photo de profil" />
    <div class="member-status">
      <span v-if="user.admin == true">Admin</span>
      <span v-else>Membre</span>
    </div>
    </div>
    <CreatePost />  <!-- On affiche le component create-post -->
  </section>
</template>

<script>
import CreatePost from "./create-post"; // On importe le component create-post //
import { mapGetters, mapActions } from "vuex";

export default { // On définit le nom pour exporter ce component
  name: "profile-box",
  components:   {
    CreatePost,
  },
  computed: {
    ...mapGetters({
      user: "showConnectedUser",
    }),
  },
  methods: {
    ...mapActions(["getOneUser"]),
  },
  mounted() {
    this.getOneUser();
  },
};
</script>

<style lang="scss">
@import "../sass/colors";

.col{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-box {
  box-sizing: border-box;
  font-family: 'system-ui';
  font-size: 0.8em;
  width: 100%;
  height: 100%;
  padding: 20px 20px;
  background-color: $white;
  border-radius: 1rem;
  box-shadow: 0 0 5px rgba($black, 0.3);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 20px;
  @media screen and (max-width: 600px) {
    width: 100%;
    margin-bottom: 30px;
  }
  img {
    width: 100%;
    height: 100%;
    max-height: 160px;
    object-fit: cover;
    max-width: 160px;
    border-radius: 10px;
    box-shadow: 0 0 8px rgba($black, 0.5);
  }
  .member-status {
    color: $white;
    font-weight: 500;
    background-color: rgba($primary-color, 0.9);
    margin-top: 10px;
    padding: 5px 10px;
    border-radius: 0.5rem;
  }
}
</style>