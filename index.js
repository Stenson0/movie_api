const express = require('express'),
 	  morgan = require('morgan'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  uuid = require('uuid'),
	  mongoose = require('mongoose'),
	  Models = require('./models.js');

const Movies = Models.Movie;	
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB');
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('common'));  

app.use(express.json());

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

const {check, validationResult} = require('express-validator');

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// get request
app.get('/', (req, res) => {
	res.send('Welcome to my app!');
});

app.get('/movies', passport.authenticate('jwt', {session: false}), async (req, res) => {
	await Movies.find()
		.then((movies) => {
			res.status(201).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), async (req, res) => {
	Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.Name })
        .then((genre) => {
            res.json(genre.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/director/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.Name })
        .then((director) => {
            res.json(director.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
    });
});

// CREATE
app.post('/users', [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail(),
    ], async (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

    let hashedPassword = Users.hashPassword(req.body.Password);
	await Users.findOne({ Username: req.body.Username })
	  .then((user) => {
		if (user) {
		  return res.status(400).send(req.body.Username + 'already exists');
		} else {
		  Users.create({
			  Username: req.body.Username,
			  Password:  hashedPassword,
			  Email: req.body.Email,
			  Birthday: req.body.Birthday
			})
			.then((user) =>{
                res.status(201).json(user);
            })
		    .catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		    })
		}
	})
	  .catch((error) => {
		console.error(error);
		res.status(500).send('Error: ' + error);
	});
});

//UPDATE
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $set: {
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                }
            },
            { new: true })
            .then((updatedUser) => {
            res.json(updatedUser);
        })
        if (!updatedUser) {
            res.status(404).send('User not found');
        } else {
            res.json(updatedUser);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

app.patch('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) 
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//DELETE
app.delete('/users/:Username/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
	const { id, movieTitle } = req.params;

	let user = Users.find( user => user.id == id);

	if (user) {
		user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
		res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
	} else {
		res.status(400).send('User not found.');
	}
})

app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
	Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// err handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});