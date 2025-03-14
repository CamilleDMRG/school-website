<template>
    <header>
        <nav>
          <router-link to="/teacher" class="nav-link">Home</router-link>
          <router-link to="/teacher/course_managing" class="nav-link">Course Managing</router-link>
          <router-link to="/teacher/messaging" class="nav-link">Messaging</router-link>
          <router-link to="/teacher/logout" class="nav-link">Log Out</router-link>
        </nav>
      </header>
      <router-view :key="$route.path"/>

</template>

<script>

</script>

<style scoped>
body
{
    background-color: rgb(191, 194, 192);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: bold;
}

nav {
    background-color: rgb(71, 169, 114);
    text-align: center;
    padding: 15px ;
}

.nav-link {
    color: rgb(255, 255, 255); /* Couleur du texte */
    padding: 8px;
    text-decoration: none;
    
}

.nav-link:hover{
    background-color: black;
    border-radius: 15px;
}
</style>