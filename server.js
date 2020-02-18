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

const db = knex({
	client: 'pg',
	connection: {
	    host : '127.0.0.1',
	    user : 'smart_brain',
	    password : 'smartbrain',
	    database : 'smartbrain'
	}
});

db.select('*').from('users').then(data => {
	console.log(data);
})

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 1. create the root end-point that returns all users from database
app.get('/', (req, res) => { res.send(db.users) })

// 2.1 move signin function into controllers and pass in dependcies it  needs - dependency injection
app.post('/signin', signin.handleSignin(db, bcrypt));

// 3.1 move register function into controllers and pass in dependcies it  needs - dependency injection
app.post('/register', register.handleRegister(db, bcrypt));

// 4.1 move profile function into controllers and pass in dependcies it  needs - dependency injection
app.get('/profile/:id', profile.handleProfile(db));

// 5.1 move image function into controllers and pass in dependcies it  needs - dependency injection
//app.put('/image', image.handleImage(db));
app.put('/image', image.handleImage(db));

// moved api call to back-end to hide key from browser/frontend
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

// app started and listening on port 3000
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


