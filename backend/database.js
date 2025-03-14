import mysql from 'mysql2';

//enter YOUR OWN sql connection credential
const SqlUsername = '';
const SqlPassword = '';
import bcrypt from 'bcrypt';

const con = mysql.createConnection({
    host: 'localhost',
    user: SqlUsername,
    password: SqlPassword,
});

con.connect((err) => {
    if (err) 
    console.log('Connected to SQL server');
    con.query("CREATE DATABASE mydb", function (err,result){
        if (err) throw err;
        console.log("Database created")
    });
    con.query("USE mydb", function (err,result){
        if (err) throw err;
        console.log("Database selected")
    });
    var sql = 
    `CREATE TABLE UserList( -- Create a table for our user
   UserID INT NOT NULL, -- UserId our primary key
   UserPseudo VARCHAR(50) NOT NULL, -- the pseudo of thr user
   Username VARCHAR(50) NOT NULL, -- the name of the user 
   Email VARCHAR(50) NOT NULL, -- the email of the user
   PassWords VARCHAR(100) NOT NULL, -- the password of the user accound
   Roles ENUM('student','teacher','admin') NOT NULL, -- the role of the user
   List VARCHAR(50), -- can be the schedule or the teacher course, each time with all the id of the course conserned
   Messages VARCHAR(50), -- list of ID message 
   PRIMARY KEY(UserID),
   UNIQUE(UserID)
);`;
   con.query(sql,function(err,result){
    if (err) throw err;
    console.log("Table User created");
   });
   sql = `CREATE TABLE CourseList(
   CourseID INT NOT NULL, 
   CourseName VARCHAR(50) NOT NULL, 
   Teacher VARCHAR(50) NOT NULL,
   department ENUM('Humanities','Social Sciences','Natural Sciences','Mathematic and Computer Science','Engeneering','Business and Management','Health Sciences','Art and Design','Education','Law','Agriculture and Environmental Studies','Interdisciplinary Studies') NOT NULL, 
   gradeLevel ENUM('9th (HighSchool )','10th (HighSchool )','11th (HighSchool)','12th (HighSchool)','1st year (Undergraduate)','2nd year (Undergraduate)','3rd year (Undergraduate)','4th year (Undergraduate)','Master Degree','Doctoral') NOT NULL, 
   capacity INT NOT NULL, 
   full ENUM('false', 'true') NOT NULL,
   TimePlace ENUM('9h50 - 12h15','14h00 - 16h30')NOT NULL,
   WeekDays ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')NOT NULL,
   PRIMARY KEY(CourseID),
   UNIQUE(CourseID));`
   con.query(sql,function(err,result){
    if (err) throw err;
    console.log("Table Course created");
   });

   sql = `CREATE TABLE MessageList(
    MessageID INT NOT NULL, 
    senderID INT NOT NULL, 
    receiverID VARCHAR(50) NOT NULL, -- 'X' if everyone
    header VARCHAR(50) NOT NULL, 
    body VARCHAR(500) NOT NULL, 
    PRIMARY KEY(MessageID),
    UNIQUE(MessageID)
 )`;
 con.query(sql, function (err, result) {
     if (err) throw err;
     console.log("Table MessageList created");
 });


    const hashed = [];
    const salt = 10;
    const passwords = ['student','teacher','Ch@rlie#456','Gr33n#Ev3!','Fr@nk!Bl4ck','Hill@H@nk99','L@neIvY2023','J@ck#Sp@rr0w','H0pper$Gr@ce','admin'];
    async function hashPasswords() {
        for (const password of passwords) {
            const hash = await bcrypt.hash(password, salt);
            hashed.push(hash);
        }
        sql = `INSERT INTO UserList (UserID, UserPseudo, Username, Email, PassWords, Roles, List, Messages) VALUES ?`
        var values = [ 
            [1, 'student', 'Alice Johnson', 'alice.johnson@example.com', hashed[0], 'student','1 2 10','1',],
            [2, 'teacher', 'Bob Smith', 'bob.smith@example.com', hashed[1], 'teacher','3 5','1'],
            [3, 'AdminC', 'Charlie Brown', 'charlie.brown@example.com', hashed[2], 'teacher','4 12','1'],
            [4, 'StudentD', 'Dana Lee', 'dana.lee@example.com', hashed[3], 'student','7 13','1'],
            [5, 'TeacherE', 'Edward Green', 'edward.green@example.com', hashed[4], 'teacher','1 13','1'],
            [6, 'StudentF', 'Fiona White', 'fiona.white@example.com', hashed[5], 'student','10 15','1'],
            [7, 'StudentG', 'George Black', 'george.black@example.com', hashed[6], 'teacher','10 18','1'],
            [8, 'TeacherH', 'Hannah Brown', 'hannah.brown@example.com', hashed[7], 'student','9 16','1'],
            [9, 'StudentI', 'Isaac Taylor', 'isaac.taylor@example.com', hashed[8], 'teacher','8 16','1'],
            [10, 'admin', 'Jade Thomas', 'dana.white@example.com', hashed[9], 'admin','','1'] ];
            con.query(sql,[values],function(err,result){
                if (err) throw err;
                console.log("table UserList filled");
            });
            }

    hashPasswords();

    sql = `INSERT INTO CourseList (CourseID, CourseName, Teacher, department, gradeLevel, capacity, full, TimePlace, WeekDays)
VALUES ?`
    values = [
       [1, 'Introduction to Philosophy','Edward Green', 'Humanities', '1st year (Undergraduate)', 30, 'false', '9h50 - 12h15', 'Monday'],
       [2, 'Advanced Sociology','John Do', 'Social Sciences', '1st year (Undergraduate)', 25, 'false', '14h00 - 16h30', 'Tuesday'],
       [3, 'Organic Chemistry','Bob Smith', 'Natural Sciences', '2nd year (Undergraduate)', 20, 'false', '9h50 - 12h15', 'Wednesday'],
       [4, 'Data Structures','Charlie Brown', 'Mathematic and Computer Science', '1st year (Undergraduate)', 40, 'false', '9h50 - 12h15', 'Thursday'],
       [5, 'Thermodynamics','Bob Smith', 'Engeneering', '2nd year (Undergraduate)', 35, 'false', '14h00 - 16h30', 'Friday'],
       [6, 'Marketing 101','John Doe', 'Business and Management', '1st year (Undergraduate)', 50, 'false', '9h50 - 12h15', 'Monday'],
       [7, 'Human Anatomy','John Doe', 'Health Sciences', '3rd year (Undergraduate)', 30, 'false', '14h00 - 16h30', 'Tuesday'],
       [8, 'Graphic Design Basics','Isaac Taylor', 'Art and Design', '1st year (Undergraduate)', 20, 'false', '9h50 - 12h15', 'Wednesday'],
       [9, 'Child Psychology','John Doe', 'Education', 'Master Degree', 15, 'false', '9h50 - 12h15', 'Thursday'],
       [10, 'Environmental Law','George Black', 'Law', 'Doctoral', 10, 'false', '14h00 - 16h30', 'Monday'],
       [11, 'Crop Science','John Doe', 'Agriculture and Environmental Studies', '2nd year (Undergraduate)', 25, 'false', '9h50 - 12h15', 'Monday'],
       [12, 'Artificial Intelligence','Charlie Brown', 'Mathematic and Computer Science', '4th year (Undergraduate)', 40, 'false', '14h00 - 16h30', 'Tuesday'],
       [13, 'Shakespearean Literature','Edward Green', 'Humanities', '3rd year (Undergraduate)', 30, 'false', '9h50 - 12h15', 'Wednesday'],
       [14, 'Social Media Analytics','John Doe', 'Business and Management', '2nd year (Undergraduate)', 35, 'false', '9h50 - 12h15', 'Thursday'],
       [15, 'Neuroscience','John Doe', 'Health Sciences', 'Doctoral', 15, 'false', '14h00 - 16h30', 'Friday'],
       [16, 'Modern Art Techniques','Isaac Taylor', 'Art and Design', 'Master Degree', 20, 'false', '9h50 - 12h15', 'Monday'],
       [17, 'Educational Technology','John Doe', 'Education', '1st year (Undergraduate)', 25, 'false', '14h00 - 16h30', 'Tuesday'],
       [18, 'Constitutional Law','George Black', 'Law', '4th year (Undergraduate)', 30, 'false', '9h50 - 12h15', 'Wednesday'],
       [19, 'Climate Change Studies','John Doe', 'Agriculture and Environmental Studies', '3rd year (Undergraduate)', 20, 'false', '14h00 - 16h30', 'Thursday'],
       [20, 'Quantum Computing','John Doe', 'Mathematic and Computer Science', 'Master Degree', 10, 'false', '9h50 - 12h15', 'Friday'],
       [21, 'Ancient Civilizations','John Doe', 'Humanities', '2nd year (Undergraduate)', 30, 'false', '9h50 - 12h15', 'Monday'],
       [22, 'Behavioral Economics','John Doe', 'Social Sciences', '4th year (Undergraduate)', 20, 'false', '14h00 - 16h30', 'Tuesday'],
       [23, 'Biochemistry','John Doe', 'Natural Sciences', '1st year (Undergraduate)', 25, 'false', '9h50 - 12h15', 'Wednesday'],
       [24, 'Discrete Mathematics','John Doe', 'Mathematic and Computer Science', '2nd year (Undergraduate)', 40, 'true', '14h00 - 16h30', 'Thursday']
       ];
        con.query(sql,[values],function(err,result){
            if (err) throw err;
            console.log("table CourseList filled");
        });

        sql = `INSERT INTO MessageList (MessageID, senderID, receiverID, header, body) VALUES ?`
        var values = [ 
            [1, 10, 'X', 'Welcome to this School Website Manager!', 'Welcome please don\'t hesitate to contact me for any help']];
         con.query(sql,[values],function(err,result){
                if (err) throw err;
                console.log("table MessageList filled");
            });
});
