<template>
  <button @click = "logout"> LOG OUT</button>
</template>

<script>
export default {
    methods:{
        logout() {
        localStorage.removeItem('token'); // Suppression du token
        this.$router.push('/login'); // Redirection vers la page de connexion
}
    }

}
</script>

<style scoped>
button{
    margin: 100px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px ;
    padding-bottom: 5px ;
    align-items: center;
    background-color: rgb(169, 71, 71);
    border-radius: 5px;
    border-style: none;
    color: aliceblue;
  }

</style>