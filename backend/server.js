import mysql from 'mysql2';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const app = express();
const port = 3000;

//enter YOUR OWN sql connection credential
const SqlUsername = '';
const SqlPassword = '';

const con = mysql.createConnection({
    host: 'localhost',
    user: SqlUsername,
    password: SqlPassword,
});

con.connect((err) => {
    if(err)
    console.log('connected to SQL server');

    //i use the database
    con.query("USE mydb", function (err,result){
        if (err) throw err;
        console.log("Database selected")
    });
});

// server 
app.use(express.json()); // Middleware pour lire les JSON


//CORS Header otherwise my browser block it
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
    next();
  });

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    var query = `SELECT * FROM UserList WHERE UserPseudo = ?`
    con.query(query, [username], function (err,result){
        if(err){
            return res.status(500).send('ERROR_CONNECT_DATABASE');
        }
        if(result.length>0){
            const queryResult = result[0];
            bcrypt.compare(password,result[0].PassWords,(err,result)=>{
                if(result){
                    console.log('stored hashed password match entred hashed password')
                    
                    const token = jwt.sign({
                        id: queryResult.UserID,
                        username: queryResult.Username,
                        userpseudo: queryResult.UserPseudo,
                        role: queryResult.Roles
                    }, 'your_secret_key', { expiresIn: '1h' });
                    res.json({token , role : queryResult.Roles });
                }
                else{
                    res.status(401).send('WRONG_CREDENTIALS');
                }
            }) 
        }
        else{
            res.status(401).send('WRONG_CREDENTIALS');
        }
    });
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];  //get token from headers: {'Authorization': `Bearer ${token}`}

    if (!token) {
        return res.status(401).send('No token provided');
    }

    // verify token
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized');
        }

        req.user = decoded;  // uncrypte and store
        next();
    });
}

app.get('/token',verifyToken, (req, res) => {
    const token = req.headers['authorization'];
    if(!req.user){
        return res.status(401).send('Unauthorized');
    }

    res.json({
        userId: req.user.id,
        userpseudo : req.userpseudo,
        username: req.user.username,
        role: req.user.role
    });
});

function getItemFromList(stringWithSpaceBW, table, callback) {
const List = stringWithSpaceBW.split(' ').map(Number); 
var ItemList = [];
var id = null;
let counter = 0;
if (table === 'UserList')
{
    id = 'UserID';
}
else if(table === 'CourseList')
{
    id = 'CourseID';
}
else if(table === 'MessageList')
{
    id = 'MessageID';
}

for (var item in List)
{
    var query = `SELECT * FROM ${table} WHERE ${id} = ?`
    con.query(query, [List[item]], function (err,result){
        if(err){
            return res.status(500).send('ERROR_CONNECT_DATABASE');
        }
        if(result.length>0){
            ItemList.push(result[0]); 
        }

        counter++; // Incrémenter le compteur à chaque requête terminée

        // Vérifier si toutes les requêtes sont terminées
        if (counter === List.length) {
            callback(ItemList); // Appeler le callback lorsque toutes les requêtes sont terminées
        }
    })
}

return  ItemList;
}


function HashePW(PW, callback) {
    const saltRounds = 10;
    bcrypt.hash(PW, saltRounds)
        .then(hash => {
            callback(null, hash);
        })
        .catch(err => {
            callback(err, null)
        });
}

// get from user the list attribute 
app.post('/getlist', (req, res) => {
    const { id } = req.body;
    var query = `SELECT * FROM UserList WHERE UserID = ?`
    con.query(query, [id], function (err,result){
        if(err){
            return res.status(500).send('ERROR_CONNECT_DATABASE');
        }
        if(result.length>0){

            getItemFromList(result[0].List, 'CourseList', function(ItemList) {
               
                res.json({ List: ItemList });
            });
        }
    }) 

    

});

app.post('/getMessage', (req, res) => {
    const { id } = req.body;
    var query = `SELECT * FROM UserList WHERE UserID = ?`
    con.query(query, [id], function (err,result){
        if(err){
            return res.status(500).send('ERROR_CONNECT_DATABASE');
        }
        if(result.length>0){

            getItemFromList(result[0].Messages, 'MessageList', function(ItemList) {
               
                res.json({ List: ItemList });
            });
        }
    }) 

    

});

app.post('/getlistByID', (req, res) => {
    const { IDs, From} = req.body;
        getItemFromList(IDs, From, function(ItemList) {
            console.log(ItemList);
            res.json({ List: ItemList });
            
        });
});

app.post('/get', (req, res) => {
    const { getAllWhat } = req.body;
    var query = `SELECT * FROM ${getAllWhat}`;
    con.query(query, function (err,result){
        if(err){
            return res.status(500).send('ERROR_CONNECT_DATABASE');
        }
        if(result.length>0){

            res.json({ List: result });
            
        } else {
            res.json({ List: [] }); // Toujours retourner une réponse
        }
    });

    

});

app.post('/search', (req, res) => {
    const { what,by,where } = req.body;
    var query = `SELECT * FROM ${what} WHERE ${by} = ?`; 
    con.query(query, [where], function (err, result) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'ERROR_CONNECT_DATABASE' }); 
        }
        if(result){

            res.json({ List: result });
            
        }
        else
        {
            res.json({ List: [] });
        }
    }) 

    

});

app.post('/insert', (req, res) => {
    const { table,entry } = req.body;
    if(table === 'UserList'){
        var attribute = '(UserID, UserPseudo, Username, Email, PassWords, Roles, List, Messages)';
    }else if (table === 'CourseList'){
        var attribute = '(CourseID, CourseName, Teacher, department, gradeLevel, capacity, full, TimePlace, WeekDays)';
    }else if(table === 'MessageList'){
        var attribute = '(MessageID, senderID, receiverID, header, body)';
    }
    var query = `INSERT INTO ${table} ${attribute} VALUES ?`; 
    con.query(query, [entry], function (err, result) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'ERROR_CONNECT_DATABASE' }); 
        }
        if(result){

            res.json({ inserted: true });
            
        }
        else
        {
            res.json({ inserted: false });
        }
    }) 

    

});

app.post('/update', (req, res) => {
    const { table,update,where } = req.body;
    var query = `UPDATE ${table} SET ${update} WHERE ${where}`; 
    con.query(query, function (err, result) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'ERROR_CONNECT_DATABASE' }); 
        }
        if(result){

            res.json({ inserted: true });
            
        }
        else
        {
            res.json({ inserted: false });
        }
    }) 

    

});

app.post('/delete', (req, res) => {
    const { table,where } = req.body;
    if(table === 'UserList'){
        var id = 'UserID';
    }else if (table === 'CourseList'){
        var id = 'CourseID';
    }else if(table === 'MessageList'){
        var id = 'MessageID';
    }
    var query = `DELETE FROM ${table} WHERE ${id} = ?`; 
    console.log(query)
    con.query(query, [where], function (err, result) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'ERROR_CONNECT_DATABASE' }); 
        }
        if(result){
            console.log(result)
            res.json({ inserted: true });
            
        }
        else
        {
            res.json({ inserted: false });
        }
    }) 

    

});

app.post('/HashedPW', (req, res) => {
    const { PW } = req.body;

    HashePW(PW, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'ERROR_HASHED' }); 
        } else {
            res.json({ hashed: hashedPassword });
        }
    });
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });

