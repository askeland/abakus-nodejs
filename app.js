var express = require('express');
var app = express();

// 1. Server tar imot request og returnerer en respons
app.get('/hello', function(request, response) {
	response.send("Hello, Abakus!");
});

// 2. Kall mot /api som returnerer JSON
app.get('/api', function(request, response) {
	response.send({hello:"Abakus",greetings_from:"Accenture"});
});

// 3. Send HTML-fil som respons
app.get('/', function(req, res) {
	res.sendfile('./views/index.html');
});

// 4. Legger til template engine
var hbs = require('hbs');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// 5. npm moviedb -  se mer: https://npmjs.org/package/moviedb
var moviedb = require('moviedb')('api_key');

hbs.registerPartials(__dirname + '/views/partials');

// 6. Lage side som tar imot søk
app.get('/search', function(req, res) {
	moviedb.searchMovie({query: req.query.q }, function(err, searchResult){
		var pageTitle = 'Search: '+req.query.q;
		res.render('search',{title:pageTitle, query:req.query.q, result:searchResult});
	});
});

// 7. Filminfoside - Gjør denne ferdig selv
app.get('/movie/:id', function(req, res) {
	moviedb.movieInfo({id: req.params.id }, function(err, result){
		res.send(result);
	});
});

// Pynt: Forteller hvor vi finner statiske filer (CSS, bilder, osv.)
app.use('/static', express.static(__dirname + '/static'));

// Cache & compress
//app.use(express.compress());
//var oneDay = 86400000; // Cacher filer i en dag
//app.use(express.static(__dirname + '/public', { maxAge: oneDay })); // Cacher bare filer som ligger i /public

app.listen(3000);

// Ta en titt på: http://net.tutsplus.com/tutorials/javascript-ajax/introduction-to-express/