//app.bulletinboard.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
	extended: false
}));

const { Client } = require('pg')
const client = new Client({
	database: 'bulletinboard',				//process.env.PG_DB_BULLETINBOARD,
  host: 'localhost',
  user: 'postgres',									//process.env.PGUSER,
  password: 'p0stgr3SQL',						//process.env.PGPASSWORD
	port: 5432
})

client.connect();

// HOME PAGE

app.get('/', (req, res) => {
	res.render('home');
})

// PAGE 1

app.get('/create_a_message', (req, res) => {
	res.render('create_a_message');
})

app.post(`/create_a_message`, function(req, res){

		const nickname = req.body.nickname;
		const title = req.body.title;
		const yourmessage = req.body.yourmessage;

	client.query(`insert into messages (screenname, title, body) values ('${nickname}', '${title}', '${yourmessage}')`, (err) => {
	console.log(err ? err.stack : 'message created')

		res.render('message_posted', {data: req.body});

});
})

// PAGE 2

app.get('/show_all_messages', function(req, res){

    client.query('SELECT * FROM messages', function(err, result) {

			console.log(err? err.stack : result.rows)

  	var data = result.rows;
    res.render('show_all_messages', {data: data});
    //     }
    });
});

////////////////////////

app.listen(3009, () => {
	console.log('App is running on port 3009');
})
