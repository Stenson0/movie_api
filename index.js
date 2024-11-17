const express = require('express'),
 	  morgan = require('morgan'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  uuid = require('uuid'),
	  mongoose = require('mongoose'),
	  Models = require('./models.js');

const Movies = Models.Movie;	
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB');
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('common'));  

app.use(express.json());

// get request
app.get('/', (req, res) => {
	res.send('Welcome to my app!');
});

app.get('/movies', async (req, res) => {
	await Movies.find()
		.then((movies) => {
			res.status(201).json(movies);
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

app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});

app.get('/movies/:Title', async (req, res) => {
	Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/genre/:Name', async (req, res) => {
    Genres.findOne({ Name: req.params.Name })   
        .then((genre) => {
            res.json(genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/director/:directorName', async (req, res) => {
	Directors.findOne({ Name: req.params.Name })
        .then((director) => {
            res.json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users', async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users/:Username', async (req, res) => {
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
app.post('/users', async (req, res) => {
	await Users.findOne({ Username: req.body.Username })
	  .then((user) => {
		if (user) {
		  return res.status(400).send(req.body.Username + 'already exists');
		} else {
		  Users.create({
			  Username: req.body.Username,
			  Password: req.body.Password,
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
app.put('/users/:Username', async (req, res) => {
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
            { new: true }
        );
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

app.patch('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// DELETE
// app.delete('/users/:id/:movieTitle', (req, res) => {
// 	const { id, movieTitle } = req.params;

// 	let user = Users.find( user => user.id == id);

// 	if (user) {
// 		user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
// 		res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
// 	} else {
// 		res.status(400).send('User not found.');
// 	}
// })

app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
    const { Username, MovieID } = req.params;

    console.log(`Attempting to remove movie ${MovieID} from user ${Username}'s favorites`);

    try {
        const user = await Users.findOne({ Username: Username });
        if (!user) {
            console.log(`User ${Username} not found`);
            return res.status(404).send('User not found');
        }

        console.log(`User ${Username} found with favorite movies: ${user.FavoriteMovies}`);

        // Ensure MovieID is treated as a string
        const movieIDString = String(MovieID);

        const updatedUser = await Users.findOneAndUpdate(
            { Username: Username },
            { $pull: { FavoriteMovies: movieIDString } },
            { new: true }
        );

        if (!updatedUser) {
            console.log(`Failed to update user ${Username}`);
            res.status(404).send('User not found');
        } else {
            console.log(`Movie ${movieIDString} has been removed from ${Username}'s list of favorite movies.`);
            res.status(200).send(`Movie ${movieIDString} has been removed from ${Username}'s list of favorite movies.`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

app.delete('/users/:Username', (req, res) => {
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