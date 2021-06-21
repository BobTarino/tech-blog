const path = require('path');
const express = require('express');
const controllers = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');


const app = express();
const PORT = process.env.PORT || 3001;

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middleware for parsing incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// middleware function that can take all of the contents of public folder and serve them as static assets
app.use(express.static(path.join(__dirname, 'public')));







app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// middleware function that can take all of the contents of public folder and serve them as static assets
app.use(express.static(path.join(__dirname, 'public')));

// turn on controllers
app.use(controllers);





sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});