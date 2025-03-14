<template>
    <div id="list">
        <div v-if ="this.$route.path === '/admin/course_managing' || path[2] === 'course_selection'" >
        <h1>List of Courses</h1>

        <select id="query" v-model="query">
        <option value="default" selected>Choose the attribute you search</option>
        <option value="CourseName">Name</option>
        <option value="Teacher">Teacher</option>
        <option value="full">Fullness</option>
        <option value="department">Department</option>
        <option value="gradeLevel">Grade Level</option>
        <option value="WeekDays">Day</option>
        <option value="TimePlace">Time</option>
        </select>

        <select v-if ="query === 'gradeLevel'" v-model="choices" >
            <option value="" selected disabled >Select Grade Level</option>
            <option v-for="i in gradeLevel" :value="i" :key="i">{{ i }} </option> 
        </select>
        <select v-else-if = "query === 'department'" v-model="choices" >
            <option value="" selected disabled >Select Department</option>
            <option v-for="i in department" :value="i" :key="i">{{ i }} </option> 
        </select>
        <select v-else-if = "query === 'full'" v-model="choices" >
            <option value="" selected disabled >Select </option>
            <option value="true">Full</option>
            <option value="false" >Not Full</option> 
        </select>
        <select v-else-if = "query === 'WeekDays'" v-model="choices" >
            <option value="" selected disabled >Select Week</option>
            <option v-for="i in WeekDays" :value="i" :key="i">{{ i }} </option> 
        </select>
        <select v-else-if = "query === 'TimePlace'" v-model="choices" >
            <option value="" selected disabled >Select Time</option>
            <option v-for="i in TimePlace" :value="i" :key="i">{{ i }} </option> 
        </select>
        <input v-else id="choices" value="" v-model="choices">

        <select id="search" v-model="search">
        <option value="default" selected disabled>Organized by ...</option>
        <option value="CourseName">Organized By Name</option>
        <option value="department">Organized By Department</option>
        <option value="gradeLevel">Organized By Grade Level</option>
        <option value="capacity">Organized By Capacity</option>
        <option value="TimePlace">Organized By Time</option>
        <option value="WeekDays">Organized By Day</option>
        </select>
        </div>

        <div v-else-if ="this.$route.path === '/teacher/course_managing'" >
        <h1>List your Courses</h1>

        <select id="query" v-model="query">
        <option value="default" selected>Choose the attribute you search</option>
        <option value="CourseName">Name</option>
        <option value="gradeLevel">Grade Level</option>
        <option value="WeekDays">Day</option>
        <option value="TimePlace">Time</option>
        </select>

        <select v-if ="query === 'gradeLevel'" v-model="choices" >
            <option value="" selected disabled >Select Grade Level</option>
            <option v-for="i in gradeLevel" :value="i" :key="i">{{ i }} </option> 
        </select>
        <select v-else-if = "query === 'WeekDays'" v-model="choices" >
            <option value="" selected disabled >Select Day</option>
            <option v-for="i in WeekDays" :value="i" :key="i">{{ i }} </option> 
        </select>
        <select v-else-if = "query === 'TimePlace'" v-model="choices" >
            <option value="" selected disabled >Select Time</option>
            <option v-for="i in TimePlace" :value="i" :key="i">{{ i }} </option> 
        </select>
        <input v-else id="choices" value="" v-model="choices">


        <select id="search" v-model="search">
        <option value="default" selected disabled>Organized by ...</option>
        <option value="CourseName">Organized By Name</option>
        <option value="gradeLevel">Organized By Grade Level</option>
        <option value="capacity">Organized By Capacity</option>
        <option value="TimePlace">Organized By Time</option>
        <option value="WeekDays">Organized By Day</option>
        </select>
        </div>

        <div v-else-if ="path[2] === 'user_managing'" >
        <h1>List your Courses</h1>

        <select id="query" v-model="query">
        <option value="default" selected>Choose the attribute you search</option>
        <option value="Username">Name</option>
        <option value="UserPseudo">Pseudo</option>
        <option value="Roles">Role</option>
        <option value="Email">Email</option>
        </select>

        <select v-if ="query === 'Roles'" v-model="choices" >
            <option value="" selected disabled >Select Role</option>
            <option v-for="i in Roles" :value="i" :key="i">{{ i }} </option> 
        </select>
        <input v-else id="choices" value="" v-model="choices">

        <select id="search" v-model="search">
        <option value="default" selected disabled>Organized by ...</option>
        <option value="Username">Organized by Name</option>
        <option value="UserPseudo">Organized by Pseudo</option>
        <option value="Roles">Organized by Role</option>
        <option value="Email">Organized by Email</option>
        </select>
        </div>

        <div v-if ="path[2] !== `messaging`">
            <button @click="Search">Search</button>
        </div>

        <div v-if="searched === true"> 
            <button @click="Cancel_Search">Cancel the Search</button>
        </div>

        <button v-if="(path[2] === 'course_selection' && role !== 'student') || path[2] === 'messaging' || role !== 'student'" @click="Add">Add</button>

        <div v-if="items.length>0"> 
            <ul>
            <item v-for="item in items" :key="item.UserID || item.CourseID || item.MessageID" :item="item" @edit-task="Edit"  @delete="Delete"/>
            </ul>
        </div>
        <p id="no" v-else>Nothing here</p>
      
    </div>
</template>

<script>
import item from '../components/item.vue';

export default{
  components:{
    item
  },
  data() {
    return {
        role : '',
        items : [],
        path : [],
        userid : '',
        query: 'default',
        choices: '',
        search: 'default',
        type : '',
        localitems : [],
        searched : false,
        Roles : ['student','teacher','admin'],
        department : ['Humanities','Social Sciences','Natural Sciences','Mathematic and Computer Science','Engeneering','Business and Management','Health Sciences','Art and Design','Education','Law','Agriculture and Environmental Studies','Interdisciplinary Studies'],
        gradeLevel : ['9th (HighSchool )','10th (HighSchool )','11th (HighSchool)','12th (HighSchool)','1st year (Undergraduate)','2nd year (Undergraduate)','3rd year (Undergraduate)','4th year (Undergraduate)','Master Degree','Doctoral'],
        TimePlace : ['9h50 - 12h15','14h00 - 16h30'],
        WeekDays : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    }
  },
  methods:{
    Edit(id){
        console.log('id to edit',id);
        if(this.type === "UserList")
        {
            var path = 'User';
            this.$router.push({path :`/${path}/${id}`})
        } else if(this.type === "MessageList")
        {
            var path = 'New_Message';
                fetch('http://localhost:3000/get', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ getAllWhat: 'MessageList' })})
                .then((response) => {
                    if (response.ok) {
                        return response.json(); }
                    })
                .then((data) => {

                    //let's find the smaller id available
                    const ids = data.List.map(item => item.MessageID);
                    ids.sort((a, b) => a - b);

                    let missingId = 1; 
                    for (const i of ids) {
                        if (i === missingId) {
                            missingId++; 
                        } else if (i > missingId) {
                            break; 
                        }
                    }
                    this.$router.push({path :`/${path}/${missingId}`})
                })
                .catch((error) =>{ console.log('Error:', error)});

        }else if(this.type === "CourseList")
        {
            var path = 'Course';
            this.$router.push({path :`/${path}/${id}`})

        }
    },
    Cancel_Search(){
        this.items = this.localitems;
        this.searched = false;
        this.query = 'default';
        this.search = 'default';
        this.choices = '';
    },

    Search(){
        if(this.query === 'default' ||this.choices ==='')
        {
            alert("please fill all the input for a proper search !");
            this.query = 'default';
            this.search = 'default';
            this.choices = 'default';
        }
        else
        {
            
            const results = this.localitems.filter(item => item[this.query] === this.choices);
            if(this.search !== "default"){
                this.items = results.sort((a, b) => a[this.search].localeCompare(b[this.search]));
            }
            else{
                this.items = results;
            }
            this.searched = true;

            for(var item in this.items)
            {
                console.log(item.CoursID);
            }
            
           
        }

    },

    Delete(currentID){
        

            if(this.path[2] === `messaging`){

                fetch('http://localhost:3000/search', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ what : 'UserList',by : 'UserID', where : this.userid })})
                .then((response) => {
                    if (response.ok) {
                        return response.json(); }
                    })
                .then((data) => {
                    var receiver = data.List[0].Messages;

                    console.log(receiver)
                    const result = receiver
                            .split(' ')              
                            .filter(value => value !== String(currentID)) 
                            .join(' ');
                    console.log('id' ,result ,String(currentID)  )
                    fetch('http://localhost:3000/update', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ table : 'UserList',update : `Messages = '${result}'`,where :`UserID = ${this.userid}` })})
                    .then((response) => {
                        if (response.ok) {
                            return response.json(); }
                        })
                    .then((data) => {
                        this.$router.push({ path: `/${this.role}` });
                    })
                    .catch((error) =>{ console.log('Error:', error)});
                        
                })
                .catch((error) =>{ console.log('Error:', error)});

                

            }
            else{
                fetch('http://localhost:3000/delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ table : this.type, where : currentID })})
                .then((response) => {
                    if (response.ok) {
                        return response.json(); }
                    })
                .then((data) => {
                    alert(`element successfully deleted.`);
                    fetch('http://localhost:3000/get', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ getAllWhat: this.type })})
                    .then((response) => {
                        if (response.ok) {
                            
                            return response.json(); }
                        })
                    .then((data) => {
                        this.items = data.List;
                        this.localitems = this.items;
                    })
                    .catch((error) =>{ console.log('Error:', error)});
                })
                .catch((error) =>{ console.log('Error:', error)});
                    
            }

            fetch('http://localhost:3000/get', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ getAllWhat: this.type })})
                .then((response) => {
                    if (response.ok) {
                        
                        return response.json(); }
                    })
                .then((data) => {
                    this.items = data.List;
                    this.localitems = this.items;
                })
                .catch((error) =>{ console.log('Error:', error)});

        
    },

    Add(){

        if(this.type === "UserList")
        {
            var path = 'New_User';
            var typeID ='UserID';
        } else if(this.type === "MessageList")
        {
            var path = 'New_Message';
            var typeID ='MessageID';

        }else if(this.type === "CourseList")
        {
            var path = 'New_Course';
            var typeID ='CourseID';

        }

        fetch('http://localhost:3000/get', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ getAllWhat: this.type })})
        .then((response) => {
            if (response.ok) {
                return response.json(); }
            })
        .then((data) => {

            //let's find the smaller id available
            const ids = data.List.map(item => item[typeID]);
            ids.sort((a, b) => a - b);

            let missingId = 1; 
            for (const i of ids) {
                if (i === missingId) {
                    missingId++; 
                } else if (i > missingId) {
                    break; 
                }
            }

            this.$router.push({path :`/${path}/${missingId}`})
        })
        .catch((error) =>{ console.log('Error:', error)});

    }

    },
    mounted() {

        var current = this.$route.path.split('/');
        this.path = current;

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
            this.userid = data.userId;

            var currentpage = this.$route.path.split('/');
            if(currentpage[1] != `${this.role}`)
            {
                this.$router.push({ path: `/${this.role}` });
            }

            if(this.path[2] === 'messaging')
            {
                fetch('http://localhost:3000/getMessage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: this.userid })})
                .then((response) => {
                    if (response.ok) {
                        return response.json(); }
                    })
                .then((data) => {
                    this.items = data.List;
                    this.type = 'MessageList';
                    this.localitems = this.items;
                })
                .catch((error) =>{ console.log('Error:', error)});
                
            }
            else if ( this.path[2] === "course_selection" || this.$route.path === "/admin/course_managing" )
            {
                fetch('http://localhost:3000/get', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ getAllWhat: 'CourseList' })})
                .then((response) => {
                    if (response.ok) {
                        return response.json(); }
                    })
                .then((data) => {
                    this.items = data.List;
                    this.type = 'CourseList';
                    this.localitems = this.items;
                })
                .catch((error) =>{ console.log('Error:', error)});
            }
            else if ( this.$route.path === "/teacher/course_managing")
            {
                fetch('http://localhost:3000/getlist', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: this.userid })})
                .then((response) => {
                    if (response.ok) {
                        return response.json(); }
                    })
                .then((data) => {
                    this.items = data.List;
                    this.type = 'CourseList';
                    this.localitems = this.items;
                
                })
                .catch((error) =>{ console.log('Error:', error)});
            }
            else if ( this.path[2] === "user_managing")
            {
                
                fetch('http://localhost:3000/get', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ getAllWhat: 'UserList' })})
                .then((response) => {
                    if (response.ok) {
                        return response.json(); }
                    })
                .then((data) => {
                    this.items = data.List;
                    this.type = 'UserList';
                    this.localitems = this.items;
                })
                .catch((error) =>{ console.log('Error:', error)});
            }

            

        })
        .catch((err) => {
            console.log('Error', err);
        });

        
    },

}
</script>

<style scoped>
  #list{
    align-items: center;
      padding: 15px;
      margin-right: 100px;
      margin-left: 100px;
      margin-top: 15px;
      background-color: rgb(215, 216, 216);
      border-color: rgb(161, 161, 161);
      border-style:groove;
  }

  h1{
      color: rgb(71, 169, 114);
      text-align: center;

  }

  #no{ align-items: center;}
</style>
