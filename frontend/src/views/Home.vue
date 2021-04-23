<template>
  <Login v-if="this.$store.state.userId == null" />
  <div v-else class="home-container"> <!-- On affiche le component si pas d'utilisateur connecté -->
    <ProfileBox /> <!-- On affiche le component -->
    <Posts /> <!-- On affiche le component -->
  </div>
</template>

<script>
import Login from "../components/login"; // On importe le component
import ProfileBox from "../components/profile-box"; // On importe le component
import Posts from "../components/posts"; // On importe le component

export default {
  name: "Home",
  components: {
    Login,
    ProfileBox,
    Posts,
  },
};
</script>

<style lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (max-width: 600px) {
    display: inline-block;
  }
}
</style>
