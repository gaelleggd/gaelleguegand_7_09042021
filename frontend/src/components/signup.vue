<template>
  <section id="signup-container">
    <h1>
      Bienvenue chez Groupomania !
    </h1>
    <div id="signup-form">
      <h2>Inscription</h2>
      <form method="post" @submit.prevent="saveUser">
        <div class="names">
          <p class="input-container">
            <label for="name">Nom</label>
            <input
              required
              type="text"
              name="name"
              v-model="name"
              id="name"
            />
          </p>
          <p class="input-container">
            <label for="firstname">Prénom</label>
            <input
              required
              type="text"
              name="firstname"
              v-model="firstname"
              id="firstname"
            />
          </p>
        </div>
        <p class="input-container">
          <label for="email">Email</label>
          <input
            required
            type="email"
            name="email"
            v-model="email"
            id="email"
          />
        </p>
        <p class="input-container">
          <label for="password">Mot de passe</label>
          <input
            required
            type="password"
            name="password"
            v-model="password"
            id="password"
          />
        </p>
        <p class="error-signup" v-if="this.$store.state.errorMsg != null">
          {{ this.$store.state.errorMsg }}
        </p>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "Signup",
  data() {
    return {
      firstname: null,
      name: null,
      email: null,
      password: null,
    };
  },
  methods: {
    saveUser() {
      const regexPassword = /((?=.*[a-z])(?=.*[A-Z]).{6,10})/;
      const regexEmail = /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/;
      if (
        (this.email !== null || this.password !== null) &&
        regexPassword.test(this.password) &&
        regexEmail.test(this.email)
      ){
      axios
        .post(`/auth/signup`, { // Sauvegarde de l'utilisateur
          firstname: this.firstname,
          name: this.name,
          email: this.email,
          password: this.password,
        })
        .then(() => { // Redirection vers la page principale
          router.push("/");
        })
        .catch(() => {
          this.$store.state.errorMsg = "Cet email est déjà utilisé";
        });
      }
      else {
        alert("Merci de remplir correctement les champs ");
      }
    }
  },
  mounted() {
    this.$store.state.errorMsg = null;
  },
};
</script>

<style lang="scss">
@import "../sass/colors";
#signup-container > h1 {
  text-align: center;
  font-size: 1.5rem;
  padding-top: 15px;
  font-weight: 400;
}

#signup-form {
  border-radius: 10px;
  background-color: none;
  border: 2px solid $white;
  box-shadow: 0 0 10px rgba($primary-color, 0.75);
  width: 70%;
  margin: 20px auto 0;
  @media screen and (max-width: 600px) {
    width: 90%;
  }
  h2 {
    margin: 0;
    text-align: center;
    border-radius: 10px 10px 0 0;
    color: $white;
    background-color: $primary-color;
    padding: 10px 0;
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: 0.1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0 30px;
    .names {
      display: flex;
      justify-content: space-between;
      width: 70%;
      @media screen and (max-width: 600px) {
        width: 90%;
      }
      .input-container {
        width: 48%;
      }
    }
    .input-container {
      margin-bottom: 12px;
      width: 70%;
      @media screen and (max-width: 600px) {
        width: 90%;
      }
      label {
        font-weight: 500;
      }
      input {
        font-family: "Roboto", sans-serif;
        box-sizing: border-box;
        margin-top: 3px;
        width: 100%;
        height: 32px;
        font-size: 1rem;
        border-radius: 10px;
        padding-left: 12px;
        font-weight: 400;
        border: 1px solid black;
        &:focus {
          outline: none;
          outline-offset: none;
        }
      }
    }
    .error-signup {
      color: rgb(206, 21, 21);
    }
    button {
      color: $white;
      background-color: $primary-color;
      padding: 10px 24px;
      font-size: 1.1rem;
      border-radius: 10px;
      border: none;
      margin: 15px 0 40px;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: 700;
    }
  }
}
</style>