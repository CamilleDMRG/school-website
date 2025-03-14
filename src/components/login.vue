
<template>
    <form id = "login" @submit.prevent="submit">
        <h1>Login</h1>
        <input v-model="username" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
    </form>
</template>

<script>
export default {
    name: 'Login',

    data() {
    return {
      username: '',
      password: '',
      error: '',
    };
  },
  methods: {
    submit() {
      fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            alert(`Invalide Credential`);
            this.username = '';
            this.password = '';
            return Promise.reject('Invalide Credential');
          }
        })
        .then((data) => {
          
          localStorage.setItem('token', data.token);
          alert(`Logged in as: ${data.role}`);
          this.$router.push({ path: `/${data.role}` })
        })
        .catch((err) => {
          console.log('Error', err);
        });
    },
  },
  mounted(){

      const token = localStorage.getItem('token');
        fetch('http://localhost:3000/token', {
        method: 'GET',
        headers: {'Authorization': `Bearer ${token}`}})
        .then((response) => {
            if (!response.ok) {
                this.$router.push({ path: '/' });
                return Promise.reject('Access not allowed');
            }
            return response.json(); })

        .then((data) => { 

            this.role = data.role;
            this.userid = data.userId;

            var currentpage = this.$route.path.split('/');
            console.log('this.role', this.role);
            console.log('currentpage', currentpage);
            if(currentpage[1] != `${this.role}`)
            {
                this.$router.push({ path: `/${this.role}` });
            }
        })
  }
};
</script>

<style scoped>
.form-input{
    margin-bottom: 10px;
    width: 93%;
    padding: 10px;
    border-radius: 5px;
}
#login{
      padding: 15px;
      margin-right: 100px;
      margin-left: 100px;
      margin-top: 15px;
      background-color: rgb(215, 216, 216);
      border-color: rgb(161, 161, 161);
      border-style:groove;
      display: flex;               
      flex-direction: column;
  }

  h1{
      color: rgb(71, 169, 114);
      text-align: center;

  }

  button{
      display: block;          
      margin: 20px auto;
      width: 150px; 
      height: 40px;
      background-color: rgb(71, 169, 114);
      border-radius: 15px;
      border-style: none;
      color: aliceblue;
  }
</style>

