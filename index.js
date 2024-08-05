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

app.use(bodyParser.json());

// let users = [
// 	{
// 		id: 1,
// 		name: 'Kim',
// 		favoriteMovies: []
// 	},
// 	{
// 		id: 2,
// 		name: 'Joe',
// 		favoriteMovies: ['Unforgiven']
// 	},
// ];

// let movies = [
// {	Title: 'Unforgiven',
// 	Description: 'Retired Old West gunslinger William Munny reluctantly takes on one last job, with the help of his old partner Ned Logan and a young man, The "Schofield Kid."',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'Clint Eastwood',
// 		Bio: 'Clint Eastwood is an American actor, film director, producer, and composer.',
// 		Birth: 'May 31, 1930',
// 	}
// },
// {	Title: 'The Searchers',
// 	Description: 'An American Civil War veteran embarks on a years-long journey to rescue his niece from the Comanches after the rest of his brother\'s family is massacred in a raid on their Texas farm.',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'John Ford',
// 		Bio: 'John Ford was an American film director. He is renowned both for Westerns such as Stagecoach, The Search',
// 		Birth: 'February 1, 1894',
// 	}
// }, 
// {	Title: 'The Good, the Bad and the Ugly',
// 	Description: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'Sergio Leone',
// 		Bio: 'Sergio Leone was an Italian film director, producer, and screenwriter, credited as the creator of the Spaghetti Western genre.',
// 		Birth: 'January 3, 1929',
// 	}
// },
// {	Title: 'Once Upon a Time in the West',
// 	Description: 'A mysterious stranger with a harmonica joins forces with a notorious desperado to protect a beautiful widow from a ruthless assassin working for the railroad.',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'Sergio Leone',
// 		Bio: 'Sergio Leone was an Italian film director, producer, and screenwriter, credited as the creator of the Spaghetti Western genre.',
// 		Birth: 'January 3, 1929',
	
// 	}
// },
// {	Title: 'High Noon',
// 	Description: 'A town Marshal, despite the disagreements of his newlywed bride and the townspeople around him, must face a gang of deadly killers alone at "high noon" when the gang leader, an outlaw he "sent up" years ago, arrives on the noon train.',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'Fred Zinnemann',
// 		Bio: 'Fred Zinnemann was an Austrian-born American film director.',
// 		Birth: 'April 29, 1907',
// 	}
// },
// {	Title: 'Shane',
// 	Description: 'An ex-gunfighter defends homesteaders in 1889 Wyoming.',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'George Stevens',
// 		Bio: 'George Stevens was an American film director, producer, screenwriter and cinematographer.',
// 		Birth: 'December 18, 1904',
// 	}
// },
// {	Title: 'Butch Cassidy and the Sundance Kid',
// 	Description: 'In 1890s Wyoming, Butch Cassidy and The Sundance Kid lead a band of outlaws. When a train robbery goes wrong, they find themselves on the run with a posse hard on their heels. After considering their options, they escape to South America.',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'George Roy Hill',
// 		Bio: 'George Roy Hill was an American film director.',
// 		Birth: 'December 20, 1921',
// 	}
// },
// {	Title: 'The Magnificent Seven',
// 	Description: 'Seven gunfighters are hired by Mexican peasants to liberate their village from oppressive bandits.',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'John Sturges',
// 		Bio: 'John Sturges was an American film director.',
// 		Birth: 'January 3, 1910',
// 	}
// },
// {	Title: 'The Wild Bunch',
// 	Description: 'An aging group of outlaws look for one last big score as the "traditional" American West is disappearing around them.',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'Sam Peckinpah',
// 		Bio: 'David Samuel Peckinpah was an American film director and screenwriter.',
// 		Birth: 'February 21, 1925',
// 	}
// },
// {	Title: 'Dances with Wolves',
// 	Description: 'Lieutenant John Dunbar, assigned to a remote western Civil War outpost, finds himself engaging with a neighbouring Sioux settlement, causing him to question his own purpose.',
// 	Genre: { 
// 		Name: 'Western',
// 		Description: 'A genre of films set in the American West, featuring cowboys, outlaws, and Native Americans.'
// 	},
// 	Director: {
// 		Name: 'Kevin Costner',
// 		Bio: 'Kevin Michael Costner is an American actor, film director, producer, and musician.',
// 		Birth: 'January 18, 1955',
// 	}
// },
// ];

app.use(express.static('public'));
app.use(morgan('common'));  

// get request
app.get('/', (req, res) => {
	res.send('Welcome to my app!');
});
app.get('/movies', (req, res) => {
	res.json(movies);
});
app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

// err handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});


app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});

// READ
app.get('/movies', (req, res) => {
	res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
	const { title } = req.params;
	const movie = movies.find( movie => movie.Title === title);

	if (movie) {
		res.status(200).json(movie);
	} else {
		res.status(400).send('Movie not found.');
	}
});

app.get('/movies/genre/:genreName', (req, res) => {
	const { genreName } = req.params;
	const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

	if (genre) {
		res.status(200).json(genre);
	} else {
		res.status(400).send('Genre not found.');
	}
});

app.get('/movies/director/:directorName', (req, res) => {
	const { directorName } = req.params;
	const director = movies.find( movie => movie.Director.Name === directorName).Director;

	if (director) {
		res.status(200).json(director);
	} else {
		res.status(400).send('Director not found.');
	}
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

//READ
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
// app.post('/users', (req, res) => {
// 	const newUser = req.body;

// 	if (newUser.name) {
// 		newUser.id = uuid.v4();
// 		users.push(newUser);
// 		res.status(201).json(newUser);
// 	} else {
// 		res.status(400).send('Please provide a name.');
// 	}
// })
app.post('/users', async (req, res) => {
	await Users.findOne({ Username: req.body.Username })
	  .then((user) => {
		if (user) {
		  return res.status(400).send(req.body.Username + 'already exists');
		} else {
		  Users
			.create({
			  Username: req.body.Username,
			  Password: req.body.Password,
			  Email: req.body.Email,
			  Birthday: req.body.Birthday
			})
			.then((user) =>{res.status(201).json(user) })
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

// UPDATE
app.put('/users/:id', (req, res) => {
	const { id } = req.params;
	const updatedUser = req.body;

	let user = users.find( user => user.id == id);

	if (user) {
		user.name = updatedUser.name;
		res.status(200).json(user);
	} else {
		res.status(400).send('User not found.');
	}
})

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
	const { id, movieTitle } = req.params;

	let user = users.find( user => user.id == id);

	if (user) {
		user.favoriteMovies.push(movieTitle);
		res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
	} else {
		res.status(400).send('User not found.');
	}
})

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
	const { id, movieTitle } = req.params;

	let user = users.find( user => user.id == id);

	if (user) {
		user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
		res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
	} else {
		res.status(400).send('User not found.');
	}
})

app.delete('/users/:id', (req, res) => {
	const { id } = req.params;

	let user = users.find( user => user.id == id);

	if (user) {
		users = users.filter(user => user.id != id);
		res.status(200).send(`user ${id} had been deleted`);
	} else {
		res.status(400).send('User not found.');
	}
})
