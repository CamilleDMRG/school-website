<template>
    <div v-if="this.currentId !== 'nothing'">
        <div v-if = "currentType === 'MessageList'">
            <p class = 'sender'> sender : {{ edited.sender}} </p>
            <br/>
            <p class = 'receiver'> received by : {{ edited.receiver }} </p>
            <br/>
            <p class = 'header' >{{edited.header}}</p>
            <br/>
            <p class = 'body' >{{edited.body}}</p>
            
            <br/>
            <input type="text" placeholder="Name of the receiver" v-model="edited.receiver" />
            <br/>
            <input type="text" placeholder="Header of your message " v-model="edited.header" />
            <br/>
            <input type="text" placeholder="Body of your message " v-model="edited.body" />
        </div>
  
        <div v-else-if = "currentType === 'UserList'">
            <p class = 'username'> Name : {{ edited.Username}} </p>
            <br/>
            <p class = 'pseudo'> Pseudo : {{ edited.UserPseudo}} </p>
            <br/>
            <p class = 'email'> Email : {{ edited.Email}} </p>
            <br/>
            <p class = 'Role' > Role Access : {{edited.Roles}}</p>
            <br/>

            <input type="text" placeholder="Username" v-model="edited.Username" />
            <br/>
            <input type="text" placeholder="User Pseudo " v-model="edited.UserPseudo" />
            <br/>
            <input type="text" placeholder="User Email " v-model="edited.Email" />
            <br/>
            <select  v-model="edited.Roles" >
                <option value="" selected disabled >Select Role</option>
                <option v-for="i in Roles" :value="i" :key="i">{{ i }} </option>  
            </select>
        </div>

        <div v-else-if="currentType === 'CourseList'">
            <p class = 'coursename'> Name : {{ edited.CourseName}} </p>
            <br/>
            <p class = 'Teacher'> Teacher : {{ edited.Teacher}} </p>
            <br/>
            <p class = 'department'> Department : {{ edited.department}} </p>
            <br/>
            <p class = 'gradelevel' > Grade Level : {{edited.gradeLevel}}</p>
            <br/>
            <p class = 'capacity' >Capacity : {{edited.capacity}}</p>
            <br/>
            <p class = 'timeplace' >Time : {{edited.TimePlace}}</p>
            <br/>
            <p class = 'WeekDays' >Day : {{edited.WeekDays}}</p>
            <br/>

            <input type="text" placeholder="Course Name " v-model="edited.CourseName" />
            <br/>
            <input  v-if="role !== 'teacher'" type="text" placeholder="Teacher for this Course" v-model="edited.Teacher" />
            <p v-else>{{ this.name }}</p>
            <br/>
            
            <br/>
            <select v-model="edited.department" >
                <option value="" selected disabled >Select Department</option>
            <option v-for="i in department" :value="i" :key="i">{{ i }} </option> 
            </select>

            <br/>
            <select  v-model="edited.gradeLevel" >
                <option value="" selected disabled >Select Grade Level</option>
            <option v-for="i in gradeLevel" :value="i" :key="i">{{ i }} </option> 
            </select>
            <br/>

            <input type="text" placeholder="Capacity of the Course" v-model="edited.capacity" />
            <br/>
            <select  v-model= "edited.TimePlace" >
                <option value="" selected disabled >Select Time</option>
                <option v-for="i in TimePlace" :value="i" :key="i">{{ i }} </option> 
            </select>
            <br/>
            <select  v-model="edited.WeekDays" >
                <option value="" selected disabled >Select Day</option>
                <option v-for="i in WeekDays" :value="i" :key="i">{{ i }} </option> 
            </select>
        </div>
        
        <button v-if ="state === 'Edit'" @click="Edit">Edit</button>
        <button v-if ="state === 'Create'" @click="Create">Create</button>
        <button @click="cancel">Cancel</button>
    </div>

    <div v-else>
        <p id="nothing">This Page dont exist</p>
        <router-link to="/" class="nav-link">GO BACK HOME</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentId: null,
            currentType: null,
            edited: {},
            name:'',
            teacher :{},
            IDType : '',
            UserID : '',
            Roles : ['student','teacher','admin'],
            department : ['Humanities','Social Sciences','Natural Sciences','Mathematic and Computer Science','Engeneering','Business and Management','Health Sciences','Art and Design','Education','Law','Agriculture and Environmental Studies','Interdisciplinary Studies'],
            gradeLevel : ['9th (HighSchool )','10th (HighSchool )','11th (HighSchool)','12th (HighSchool)','1st year (Undergraduate)','2nd year (Undergraduate)','3rd year (Undergraduate)','4th year (Undergraduate)','Master Degree','Doctoral'],
            TimePlace : ['9h50 - 12h15','14h00 - 16h30'],
            WeekDays : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
            role : '',
            state : '',

        };
    },
    computed: {
        Starter() {
            fetch('http://localhost:3000/search', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ what : this.currentType, by : this.IDType, where : this.currentId })})
            .then((response) => {
                if (response.ok) {
                    return response.json(); }
                })
            .then((data) => {

                console.log(data)
                console.log(data.List.length > 0)

                if (data.List.length > 0)
                {
                    this.edited = data.List[0];
                    if(this.currentType === 'CourseList')
                    {
                        this.teacher = data.List[0].Teacher;}
                        
                }

                else {
                    this.currentId = 'nothing';
                }
                
            })
            .catch((error) =>{ console.log('Error:', error)});

            
        },
        
        
    },
    methods: {
        generatePassword() {
            const length = 12 ;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?';
            let password = '';
            
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                password += characters[randomIndex];
            }

            return password;
        },
        Edit() {

            if(this.currentType === 'UserList'){

                if(this.edited.UserPseudo !== '' && this.edited.Username !== ''&& this.edited.Email !== '' && this.edited.Roles !== '')
                {
                    var update = `UserPseudo = '${this.edited.UserPseudo}', Email = '${this.edited.Email}', Username = '${this.edited.Username}', Roles = '${this.edited.Roles}'`;
                    var where = `UserID = ${this.edited.UserID}`;
                    fetch('http://localhost:3000/update', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ table : this.currentType,update : update,where :where })})
                    .then((response) => {
                        if (response.ok) {
                            return response.json(); }
                        })
                    .then((data) => {
                        alert('User Edited ');
                        this.$router.push({ path: `/${this.role}` });
                    })
                    .catch((error) =>{ console.log('Error:', error)});
                        }

            }else if(this.currentType === 'CourseList'){
                
                if(this.edited.CourseName !==''& this.edited.Teacher !==''& this.edited.department !== ''& this.edited.gradeLevel !==''& this.edited.capacity !==''& this.edited.TimePlace!==''& this.edited.WeekDays !=='')
                {
                                var update = `CourseName = '${this.edited.CourseName}', Teacher = '${this.edited.Teacher}', department = '${this.edited.department}' , gradeLevel = '${this.edited.gradeLevel}',  capacity = '${this.edited.capacity}', TimePlace = '${this.edited.TimePlace}' , WeekDays = '${this.edited.WeekDays}'`;
                                var where = `CourseID = ${this.edited.CourseID}`;
                                fetch('http://localhost:3000/update', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({ table : this.currentType,update : update,where :where })})
                                .then((response) => {
                                    if (response.ok) {
                                        return response.json(); }
                                    })
                                .then((data) => {

                                    alert('Course Edited ');
                                    this.$router.push({ path: `/${this.role}` });
                                })
                                .catch((error) =>{ console.log('Error:', error)});
                    fetch('http://localhost:3000/search', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ what : 'UserList',by : 'Username', where : this.teacher })})
                        .then((response) => {
                            if (response.ok) {
                                return response.json(); }
                            })
                        .then((data) => {
                            if(data.List.length > 0)
                            {    var course = data.List[0].List;

                                const result = course
                                        .split(' ')              
                                        .filter(value => value !== String(this.currentId)) 
                                        .join(' ');
                                console.log('id' ,result , String(this.currentId)  )
                                fetch('http://localhost:3000/update', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({ table : 'UserList',update : `List = '${result}'`,where :`UserID = ${data.List[0].UserID}` })})
                                    .then((response) => {
                                        if (response.ok) {
                                            return response.json(); }
                                        })
                                    .then((data) => {
                                        this.$router.push({ path: `/${this.role}` });
                                    })
                                    .catch((error) =>{ console.log('Error:', error)});}
                        
                        })
                        .catch((error) =>{ console.log('Error:', error)});
            }
        }
            
        },
        Create(){

            
            if(this.currentType === 'UserList'){
                

                if(this.edited.UserPseudo !== '' && this.edited.Username !== ''&& this.edited.Email !== '' &&this.edited.Roles !== '')
                {
                    this.edited.PassWords = this.generatePassword();
                    fetch('http://localhost:3000/HashedPW', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ PW : this.edited.PassWords})})
                        .then((response) => {
                            if (response.ok) {
                                return response.json(); }
                            })
                        .then((data) => {

                            var entry = [[this.currentId, this.edited.UserPseudo, this.edited.Username, this.edited.Email, data.hashed, this.edited.Roles, '','1']];
                        
                            fetch('http://localhost:3000/insert', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ table : this.currentType, entry : entry })})
                            .then((response) => {
                                if (response.ok) {
                                    return response.json(); }
                                })
                            .then((data) => {
                                alert(`User Added with password ${this.edited.PassWords}`);
                                this.$router.push({ path: `/${this.role}` });
                            })
                            .catch((error) =>{ console.log('Error:', error)});
                            
                        })
                        .catch((error) =>{ console.log('Error:', error)});

                        
                        
                }

            }else if(this.currentType === 'CourseList'){

                if(this.edited.CourseName !==''&& this.edited.Teacher !==''&& this.edited.department !== '' && this.edited.gradeLevel !==''&&  !isNaN(Number(this.edited.capacity)) && this.edited.TimePlace !==''&& this.edited.WeekDays !=='')
                {
                    var entry = [[this.currentId, this.edited.CourseName, this.edited.Teacher,this.edited.department,this.edited.gradeLevel,Number(this.edited.capacity),'false',this.edited.TimePlace,this.edited.WeekDays]];
                    fetch('http://localhost:3000/insert', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ table : this.currentType, entry : entry })})
                    .then((response) => {
                        if (response.ok) {
                            return response.json(); }
                        })
                    .then((data) => {

                        alert('Course Added ');
                        this.$router.push({ path: `/${this.role}` });
                    })
                    .catch((error) =>{ console.log('Error:', error)});

                    fetch('http://localhost:3000/search', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ what : 'UserList', by : 'Username', where : this.edited.Teacher })})
                            .then((response) => {
                                if (response.ok) {
                                    return response.json(); }
                                })
                            .then((data) => {
                                if (data.List.length !== 0 && data.List[0].Roles === 'teacher' )
                                {
                                    data.List[0].List += ` ${this.currentId}`;
                                    fetch('http://localhost:3000/update', {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({ table : 'UserList',update : `List = '${data.List[0].List}'`,where : `UserID = ${data.List[0].UserID}` })})
                                    .then((response) => {
                                        if (response.ok) {
                                            return response.json(); }
                                        })
                                    .then((data) => {
                                        console.log('teacher course List updated');
                                    })
                                    .catch((error) =>{ console.log('Error:', error)});
                                }


                            })
                            .catch((error) =>{ console.log('Error:', error)});
                }
                else 
                {
                    alert('please fill correctly  all the entries !');
                }
            }else if(this.currentType === 'MessageList'){
  
                if(this.edited.receiver !== ''&& this.edited.header !== ''&& this.edited.body !== '' )
                {
                    
                    var valablereceiver = true;
                    if(this.edited.receiver === 'Everyone')
                    {
                        var ids = 'X';
                        var entry = [[this.currentId, this.UserID, ids, this.edited.header, this.edited.body]];
                                var where = `CourseID = ${this.edited.CourseID}`;
                                fetch('http://localhost:3000/insert', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({ table : this.currentType, entry : entry})})
                                .then((response) => {
                                    if (response.ok) {
                                        return response.json(); }
                                    })
                                .then((data) => {

                                    alert('Message Added ');
                                    this.$router.push({ path: `/${this.role}` });
                            })
                            .catch((error) =>{ console.log('Error:', error)});
                        }
                        else {
                            
                        try {
                        console.log('ids',this.edited.receiver)
                        const names = this.edited.receiver.split(',').map(String);
                        fetch('http://localhost:3000/get', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ getAllWhat: 'UserList' })})
                        .then((response) => {
                            if (response.ok) {
                                return response.json(); }
                            })
                        .then((data) => {
                            
                            const Users = data.List;
                            var ids = [];

                            const isValid = names.every(name => {
                            const user = Users.find(user => user.Username === name); // Recherche dans Users
                            if (user) {
                                ids.push(user.UserID); 
                                return true; 
                            } else {
                                console.log("non valide"); // Affiche "non valide" si un nom est introuvable
                                return false; // Arrête la vérification
                            }
                            });

                            console.log(ids, valablereceiver)

                            if(isValid){


                                var entry = [[this.currentId, this.UserID, ids.join(","), this.edited.header, this.edited.body]];
                                var where = `CourseID = ${this.edited.CourseID}`;
                                fetch('http://localhost:3000/insert', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({ table : this.currentType, entry : entry})})
                                .then((response) => {
                                    if (response.ok) {
                                        return response.json(); }
                                    })
                                .then((data) => {

                                    alert('Message Added ');
                                    this.$router.push({ path: `/${this.role}` });
                            })
                            .catch((error) =>{ console.log('Error:', error)});

                            for(var i in ids)
                            {
                                        fetch('http://localhost:3000/search', {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({ what : 'UserList', by : 'UserID', where : ids[i] })})
                                    .then((response) => {
                                        if (response.ok) {
                                            return response.json(); }
                                        })
                                    .then((data) => {

                                            data.List[0].Messages += ` ${this.currentId}`;
                                            console.log(data.List[0].Messages)
                                            fetch('http://localhost:3000/update', {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({ table : 'UserList',update : `Messages = '${data.List[0].Messages}'`,where : `UserID = ${data.List[0].UserID}` })})
                                            .then((response) => {
                                                if (response.ok) {
                                                    return response.json(); }
                                                })
                                            .then((data) => {
                                                console.log('user message List updated');
                                            })
                                            .catch((error) =>{ console.log('Error:', error)});
                                        })
                                    .catch((error) =>{ console.log('Error:', error)});
                                }
                            }
                            else {
                                alert('please enter valide Names for the receivers');
                            }

                            
                        })
                        .catch((error) =>{ console.log('Error:', error)});

                    } catch (error) {
                        alert('please enter valide id for the receiver');}}
                    
                    
                }
                else {
                    alert("Please fill correctly all entrie")
                }
                }
            },

        cancel() {
            this.$router.push({ path: '/' });
        },

        Access(data){
            this.role = data.role;
            this.UserID = data.userId;
            this.currentId = Number(this.$route.params.id);

            var currentpage = this.$route.path.split('/');

            console.log(this.role, this.UserID, currentpage);

            if(currentpage[1] === 'New_Message' || currentpage[1] === 'New_User' || currentpage[1] === 'New_Course'){
                this.state = 'Create';
                if(currentpage[1] === 'New_Message'){
                    this.IDType = 'MessageID';
                    this.currentType = "MessageList";
                } else if(currentpage[1] === 'New_User'){
                    this.IDType = 'UserID';
                    this.currentType = "UserList";
                } else if(currentpage[1] === 'New_Course'){
                    this.IDType = 'CourseID';
                    this.currentType = "CourseList";
                }
                

                fetch('http://localhost:3000/get', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ getAllWhat: this.currentType })})
                .then((response) => {
                    if (response.ok) {
                        return response.json(); }
                    })
                .then((data) => {

                    //let's find the smaller id available
                    const ids = data.List.map(item => item[this.IDType]);
                    ids.sort((a, b) => a - b);

                    let missingId = 1; 
                    for (const i of ids) {
                        if (i === missingId) {
                            missingId++; 
                        } else if (i > missingId) {
                            break; 
                        }
                    }

                    if (missingId === this.currentId )
                    {

                        if(this.currentType === "MessageList"){

                            fetch('http://localhost:3000/search', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ what : 'UserList',by : 'UserID', where : this.UserID })})
                            .then((response) => {
                                if (response.ok) {
                                    return response.json(); }
                                })
                            .then((data) => {
                                this.edited = {MessageID : this.currentId, sender : data.List[0].Username, receiver : '',header : '', body : '' }
                            })
                            .catch((error) =>{ console.log('Error:', error)});

                        } else if(this.currentType === "UserList")
                        {
                            this.edited = {UserID : this.currentId, UserPseudo: '',Username : '', Email: '',PassWords:'',Roles : '',List : '',Messages : ''}
                        } else if(this.currentType === "CourseList")
                        {
                            if(this.role === 'teacher')
                            {
                                this.edited = {CourseID : this.currentId,CourseName:'', Teacher:this.name,department:'', gradeLevel:'', capacity:'', full :false,TimePlace:'', WeekDays :'',}
                            }
                            else{
                                this.edited = {CourseID : this.currentId,CourseName:'', Teacher:'',department:'', gradeLevel:'', capacity:'', full :false,TimePlace:'', WeekDays :'',}
                            }
                        }
                        
                    }
                    else{
                        console.log('access not allowed')
                        this.$router.push({ path: `/${this.role}` });
                    }
                })
                .catch((error) =>{ console.log('Error:', error)});
            } else if(currentpage[1] === 'User'){
                this.state = 'Edit';
                

                if(this.role != 'admin')
                {
                    this.$router.push({ path: `/${this.role}` });
                }
                else {
                    console.log('hello2')
                    this.IDType = 'UserID';
                    this.currentType = "UserList";
                    fetch('http://localhost:3000/get', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ getAllWhat: 'UserList' })})
                    .then((response) => {
                        if (response.ok) {
                            return response.json(); }
                        })
                    .then((data) => {
                        var list = data.List;
                        if ((list.find(item => item.UserID === this.currentId)) === undefined)
                        {
                            this.currentId="nothing"
                        }
                        else {
                            this.Starter;
                        }
                    })
                    .catch((error) =>{ console.log('Error:', error)});
                }
    
            } else if(currentpage[1] === 'Course'){
                this.state = 'Edit';
                if(this.role === 'student')
                {
                    this.$router.push({ path: `/${this.role}` });
                }
                else if(this.role === 'teacher') {

                    fetch('http://localhost:3000/getlist', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id: this.UserID })})
                    .then((response) => {
                        if (response.ok) {
                        return response.json(); }
                    })
                    .then((data) => {
                        var list = data.List;
                        if ((list.find(item => item.CourseID === this.currentId)) === undefined)
                        {
                            console.log('access not allowed to this course')
                            this.$router.push({ path: `/${this.role}` });
                        }
                        else{
                            this.IDType = 'CourseID';
                            this.currentType = "CourseList";
                            this.Starter;
                        }
                    })
                    .catch((error) =>{ console.log('Error:', error)});

                } else if(this.role === 'admin') {
                
                this.IDType = 'CourseID';
                this.currentType = "CourseList";
                this.Starter;
                }
                
            }

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
    this.name = data.username;
    this.Access(data);

})
.catch((err) => {
console.log('Error', err);
});
    }
};
</script>

<style scoped>
h1{
      color: rgb(71, 169, 114);
      text-align: center;

  }
  p{
    text-align: center;
  }
div{
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

  input{
    border-radius: 5px;
    margin-bottom: 15px;
    padding: 15px;

  }

  button{


    border-radius: 5px;
    margin-bottom: 15px;
    padding: 15px;
    background-color: rgb(71, 169, 114);
    border-radius: 15px;
    border-style: none;
    color: aliceblue;
  }

  #nothing{
    color:red;
  }

  .nav-link{
    text-align: center;
    color: green;

  }
</style>

