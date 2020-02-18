// basic skeleton express server

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// controllers end-points
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

/*const db = knex({
	client: 'pg',
	connection: {
	    host : '127.0.0.1',
	    user : 'smart_brain',
	    password : 'smartbrain',
	    database : 'smartbrain'
	}
});*/


const db = knex({
	client: 'pg',
	connection: {
	    host : process.env.DATABASE_URL,
	    ssl: true,
});

/*db.select('*').from('users').then(data => {
	console.log(data);
})*/

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => { res.send('it is working') })

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', profile.handleProfile(db));

app.put('/image', image.handleImage(db));

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`)
});

/*	summary: end-points
	/                --> GET   - returns all users from database
	/signin          --> POST  - checks for a valid user in the database via the sign in details entered in to app 
	/register        --> POST  - saves new user details to the users table and their login details to the login table in a transaction
	/profile/:id     --> GET   - pulls user details out based on the user id
	/image/          --> PUT   - updates entries by 1 every time you submit an image for face detection
*/


