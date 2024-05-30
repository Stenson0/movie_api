const express = require('express');
const morgan = require('morgan');
const app = express();

let topMovies = [
{	title: 'Unforgiven',
	directior: 'Clint Eastwood',
},
{	title: 'The Searchers',
	director: 'John Ford',
}, 
{	title: 'The Good, the Bad and the Ugly',
	director: 'Sergio Leone',
},
{	title: 'Once Upon a Time in the West',
	director: 'Sergio Leone',
},
{	title: 'High Noon',
	director: 'Fred Zinnemann',
},
{	title: 'Shane',
	director: 'George Stevens',
},
{	title: 'Butch Cassidy and the Sundance Kid',
	director: 'George Roy Hill',
},
{	title: 'The Magnificent Seven',
	director: 'John Sturges',
},
{	title: 'The Wild Bunch',
	director: 'Sam Peckinpah',
},
{	title: 'Dances with Wolves',
	director: 'Kevin Costner',
},
];

app.use(express.static('public'));
app.use(morgan('common'));  

// get request
app.get('/', (req, res) => {
	res.send('Welcome to my app!');
});
app.get('/movies', (req, res) => {
	res.json(topMovies);
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
