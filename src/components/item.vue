<template>
  <li v-if="path === 'messaging'">
    <p class='sender'> sender : {{ sender }} </p>
    <br/>
    <p class='receiver'> received by : {{ receiver.join(' , ') }} </p>
    <br/>
    <p class='header'>{{ item.header }}</p>
    <br/>
    <p class='body'>{{ item.body }}</p>
    <br/>
    <button @click="$emit('edit-task', currentID)">Response</button>
    <button @click="$emit('delete', currentID)">Delete</button>
  </li>
  
  <li v-else-if="path === 'user_managing'">
    <p class='username'> Name : {{ item.Username }} </p>
    <br/>
    <p class='pseudo'> Pseudo : {{ item.UserPseudo }} </p>
    <br/>
    <p class='email'> Email : {{ item.Email }} </p>
    <br/>
    <p class='Role'> Role Access : {{ item.Roles }}</p>
    <br/>
    <button @click="$emit('edit-task', currentID)">Edit</button>
    <button @click="$emit('delete', currentID)">Delete</button>
  </li>

  <li v-else-if="path === 'course_managing' || path === 'course_selection'">
    <p class='coursename'> Name : {{ item.CourseName }} </p>
    <br/>
    <p class='teacher'> Teacher: {{ item.Teacher }} </p>
    <br/>
    <p class='department'> Department : {{ item.department }} </p>
    <br/>
    <p class='gradelevel'> Grade Level : {{ item.gradeLevel }}</p>
    <br/>
    <p class='capacity'> Capacity : {{ item.capacity }}</p>
    <br/>
    <p class='timeplace'> Time : {{ item.TimePlace }}</p>
    <br/>
    <p class='WeekDays'> Day : {{ item.WeekDays }}</p>
    <br/>
    <div v-if="path === 'course_managing'">
      <button @click="$emit('edit-task', currentID)">Edit</button>
      <button @click="$emit('delete', currentID)">Delete</button>
      
    </div>
    <div v-else>
      <button @click="Add">Add</button>
      <button @click="Delete">Delete</button> 
    </div>
  </li>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      path: '',
      sender: null,
      receiver: [],
      currentID: '',
      type: '',
    }
  },
  methods: {
    /**
     * Adds the selected course to the user's schedule.
     *
     * This method performs the following steps:
     * 
     * 1. **Check for Authentication**:
     *    - Retrieves the user's token from local storage.
     *    - If no token is found, alerts the user that they must be logged in to add a course and redirects them to the home page.
     * 
     * 2. **Validate Token**:
     *    - Sends a GET request to the `/token` endpoint with the token in the Authorization header.
     *    - If the response is not ok, throws an error indicating an invalid token.
     * 
     * 3. **Retrieve Current Course List**:
     *    - Sends a POST request to the `/search` endpoint to get the user's current list of courses based on their `UserID`.
     *    - If the response is not ok, throws an error indicating there was an issue retrieving the course list.
     * 
     * 4. **Check for Existing Course**:
     *    - Parses the current list of courses.
     *    - Checks if the selected course (`this.item.CourseID`) is already in the user's course list.
     *    - If it is, alerts the user that the course is already in their schedule and stops the process.
     * 
     * 5. **Add New Course**:
     *    - Appends the new course ID to the current list of courses.
     * 
     * 6. **Update Course List in Database**:
     *    - Sends a POST request to the `/update` endpoint to update the user's course list in the database.
     *    - Sends the updated list along with the `UserID`.
     *    - If the response is not ok, throws an error indicating there was an issue updating the course list.
     * 
     * 7. **Finalize**:
     *    - Alerts the user that the course was successfully added to their schedule.
     *    - Emits a `course-added` event with the course ID, which can be used to refresh the display or update other components.
     * 
     * 8. **Error Handling**:
     *    - Catches any errors that occur during the process.
     *    - Logs the error to the console and alerts the user that an error occurred while adding the course.
     */
    Add() {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('you need to be connected to select a course');
        this.$router.push({ path: '/' });
        return;
      }

      // Obtain the current user's information
      fetch('http://localhost:3000/token', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Token invalide');
          }
          return response.json();
        })
        .then(data => {
          const userId = data.userId;

          // Obtain the current user's course list via /search
          return fetch('http://localhost:3000/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ what: 'UserList', by: 'UserID', where: userId })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Erreur lors de la récupération de la liste des cours');
              }
              return response.json();
            })
            .then(data => {
              let currentList = data.List.length > 0 ? data.List[0].List : '';
              const courseId = this.item.CourseID.toString();

              // Verify if the course is already in the list
              const courses = currentList ? currentList.split(' ') : [];
              if (courses.includes(courseId)) {
                alert('This course is already in your schedule');
                return;
              }

              // Add the new course to the current list
              currentList = currentList ? `${currentList} ${courseId}` : courseId;

              // Update the database
              return fetch('http://localhost:3000/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  table: 'UserList',
                  update: `List = '${currentList}'`,
                  where: `UserID = ${userId}`
                })
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour de la liste des cours');
                  }
                  return response.json();
                })
                .then(() => {
                  alert('Course successfully added to your schedule');
                  // Optionnal : Update the display or emit an event to refresh the list
                  this.$emit('course-added', this.item.CourseID);
                });
            });
        })
        .catch(error => {
          console.error('Erreur:', error);
          alert('an error happen during the course selection please try later');
        });
    },

    
    /**
     * Deletes a course from the user's schedule.
     *
     * This method performs the following steps:
     * 1. **Authentication Check**:
     *    - Verifies if a token exists in `localStorage`.
     *    - If no token is found, alerts the user and redirects to the home page.
     * 2. **Retrieve User Information**:
     *    - Sends a GET request to `http://localhost:3000/token` with the Authorization header.
     *    - If the token is invalid, throws an error.
     *    - Extracts the `userId` from the response.
     * 3. **Fetch Current Course List**:
     *    - Sends a POST request to `http://localhost:3000/search` to retrieve the user's current list of courses.
     *    - If the request fails, throws an error.
     *    - Obtains the `currentList` of courses.
     * 4. **Check Course Existence**:
     *    - Converts the `currentList` into an array of course IDs.
     *    - Checks if the course to be deleted (`this.item.CourseID`) exists in the list.
     *    - If the course is not found, alerts the user.
     * 5. **Remove Course from List**:
     *    - Filters out the course ID from the array of courses.
     *    - Joins the array back into a string to form the updated `currentList`.
     * 6. **Update Database**:
     *    - Sends a POST request to `http://localhost:3000/update` to update the user's course list in the database.
     *    - If the update fails, throws an error.
     * 7. **User Notification and UI Update**:
     *    - Alerts the user that the course has been successfully removed.
     *    - Emits a `course-deleted` event with the course ID to update the parent component or refresh the list.
     */
    Delete() {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('you need to be connected to delet a course');
        this.$router.push({ path: '/' });
        return;
      }

      // Obtain the current user's information
      fetch('http://localhost:3000/token', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Token invalide');
          }
          return response.json();
        })
        .then(data => {
          const userId = data.userId;

          // Obtain the current user's course list via /search
          return fetch('http://localhost:3000/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ what: 'UserList', by: 'UserID', where: userId })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Erreur lors de la récupération de la liste des cours');
              }
              return response.json();
            })
            .then(data => {
              let currentList = data.List.length > 0 ? data.List[0].List : '';
              const courseId = this.item.CourseID.toString();

              //  verify if the course is in the list
              let courses = currentList ? currentList.split(' ') : [];
              if (!courses.includes(courseId)) {
                alert('this course isn\'t in your schedule');
                return;
              }

              // Delete the course from the list
              courses = courses.filter(id => id !== courseId);
              currentList = courses.join(' ');

              // Update the database
              return fetch('http://localhost:3000/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  table: 'UserList',
                  update: `List = '${currentList}'`,
                  where: `UserID = ${userId}`
                })
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour de la liste des cours');
                  }
                  return response.json();
                })
                .then(() => {
                  alert('Course successfully deleted from your schedule');
                  // Optional: Update the display or emit an event to refresh the list
                  this.$emit('course-deleted', this.item.CourseID);
                });
            });
        })
        .catch(error => {
          console.error('Erreur:', error);
          alert('an error happen during the suppression please try later');
        });
    },

   

  },

  mounted() {
    var current = this.$route.path.split('/');
    this.path = current[2];

    if (this.path === 'messaging') {
      this.currentID = this.item.MessageID;
      this.type = 'MessageList';

    } else if (this.path === 'course_managing') {
      this.currentID = this.item.CourseID;
      this.type = 'CourseList';

    } else if (this.path === 'user_managing') {
      this.currentID = this.item.UserID;
      this.type = 'UserList';
    }

    if (this.path === 'messaging') {
      fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ what: 'UserList', by: 'UserID', where: this.item.senderID })
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          this.sender = data.List[0].Username;
        })
        .catch((error) => { console.log('Error:', error) });

      if (this.item.receiverID === 'X') {
        this.receiver.push('Everyone');
      } else {
        fetch('http://localhost:3000/getlistByID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ IDs: this.item.receiverID, From: 'UserList' })
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            for (var j in data.List) {
              this.receiver.push(data.List[j].Username);
            };
          })
          .catch((error) => { console.log('Error:', error) });
      }
    }
  }
};
</script>

<style scoped>
li {
  list-style: none;
  padding: 15px;
  border-radius: 5px;
  background-color: aliceblue;
  /*display: flex;
  justify-content: space-between;*/
  align-items: center;
  width: 90%;
  margin-bottom: 15px;
}

button {
  margin-left: auto;
  margin-right: 15px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: rgb(71, 169, 114);
  border-radius: 5px;
  border-style: none;
  color: aliceblue;
}
</style>
