<template>
  <section id="login-container">
    <h1>Nous sommes heureux de vous revoir !</h1>
    <div id="login-form">
      <h2>Connexion</h2>
      <form method="post" @submit.prevent="loginUser">
        <p class="input-container">
          <label for="email">Email</label><br />
          <input
            required
            type="email"
            name="email"
            id="email"
            v-model="email"
          />
        </p>
        <p class="input-container">
          <label for="password">Mot de passe</label><br />
          <input
            required
            type="password"
            name="password"
            id="password"
            v-model="password"
          />
        </p>
        <p class="error-login" v-if="this.$store.state.errorMsg != null">
          {{ this.$store.state.errorMsg }}
        </p>
        <button type="submit">Me connecter</button>
        <p class="no-account">Pas encore chez nous ?</p>
        <p>
          <router-link class="signup-link" to="/signup">
            Créer mon compte
          </router-link>
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    loginUser() {
      axios
        .post("auth/login", {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", res.data.userId);
          this.$store.dispatch("getUserId", res.data.userId);
          this.email = this.password = null;
        })
        .catch(() => {
          this.password = null;
          this.$store.state.errorMsg =
            "Le mot de passe ou l'email est incorrect";
        });
    },
  },
  mounted() {
    this.email = null;
    this.$store.state.errorMsg = null;
  },
};
</script>

<style lang="scss">
@import "../sass/colors";

#login-container{
  font-family: "system-ui", sans-serif;
}

#login-container > h1 {
  text-align: center;
  font-size: 1.5rem;
  padding-top: 15px;
  font-weight: 400;
}

#login-form {
  border-radius: 10px;
  background-color: none;
  border: 2px solid $white;
  box-shadow: 0 0 10px rgba($primary-color, 0.75);
  width: 70%;
  margin: 20px auto 0;
  @media screen and (max-width: 600px) {
    width: 80%;
  }
  h2 {
    margin: 0;
    border-radius: 10px 10px 0 0;
    text-align: center;
    color: $white;
    background-color: $primary-color ;
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
    color: $black;
    .input-container {
      margin-bottom: 12px;
      width: 66%;
      max-width: 250px;
      label {
        font-weight: 500;
      }
      input {
        font-family: "system-ui", sans-serif;
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
    .error-login {
      color: #ce1515;
    }
    button {
      color: $white;
      background-color: $primary-color;
      padding: 10px 24px;
      font-size: 1.1rem;
      border-radius: 10px;
      border: none;
      margin: 10px 0 40px;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: 700;
    }
    .no-account {
      font-size: 1.1rem;
      margin-bottom: 10px;
    }
    .signup-link {
      letter-spacing: 0.05rem;
      text-transform: uppercase;
      font-weight: 800;
      display: inline-block;
      text-decoration: none;
      color: $white;
      background-color: $secondary-color;
      padding: 10px 30px;
      font-size: 1rem;
      border: none;
      border-radius: 10px;
      box-shadow: 0 0 5px rgba($black, 0.75);
    }
  }
}
</style>