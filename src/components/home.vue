<template>

<div v-if="role === 'admin'">
<h1>Welcome to the Admin-board {{ username }}</h1>

</div>

<div v-if="role === 'student'">
    <h1>Welcome to the Student-board {{ username }}</h1>



</div>

<div v-if="role === 'teacher'">
    <h1>Welcome to the Teacher-board {{ username }}</h1>

</div>

<div class="schedule-container">
    <table border="1" cellpadding="10" cellspacing="0">
      <thead>
        <tr>
          <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="day in daysOfWeek" :key="day">
            <div v-for="(course, index) in getCoursesForDay(day)" :key="index" class="course">
              <strong>{{ course.CourseName }}</strong><br />
              <em>{{ course.TimePlace }}</em><br />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
    
</template>

<script>
export default {
    data() {
            return {
                role: null,
                username : null,
                userid : null,
                userpseudo : null,
                list : [],
            };
    },
    computed: {
    daysOfWeek() {
      return ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    },
    },
    methods :{
        getCoursesForDay(day) {
        return this.list
        .filter(list => list.WeekDays === day)
        .sort((a, b) => b.TimePlace.localeCompare(a.TimePlace));
        },
    },
    mounted() {

        const token = localStorage.getItem('token');

        if (!token) {
            this.$router.push({ path: '/' });
            return;
        }

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
            this.username = data.username;
            this.userid = data.userId;
            this.userpseudo = data.userpseudo;

            var currentpage = this.$route.path;
            if(currentpage != `/${this.role}`)
            {
                this.$router.push({ path: `/${this.role}` });
            }

            fetch('http://localhost:3000/getlist', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: this.userid })})
            .then((response) => {
                if (response.ok) {
                    return response.json(); }
                })
            .then((data) => {
                this.list = data.List;
                console.log(this.list)
            })
            .catch((error) =>{ console.log('Error:', error)});

        })
        .catch((err) => {
            console.log('Error', err);
        });

        
    },

};


</script>

<style scoped>


</style>