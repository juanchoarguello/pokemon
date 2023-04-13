
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const mysql = require('mysql');
const https = require('https');

const app = express();
function getIdFromUrl(url) {
  const parts = url.split('/');
  return parts[parts.length - 2];
}
// Configuración de la sesión
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));

// Configuración de passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '2546',
  database: 'pokemon'
});

// Definición de la estrategia de autenticación local
passport.use(new LocalStrategy(
  (username, password, done) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
      if (err) {
        return done(err);
      }
      if (!result.length) {
        return done(null, false, { message: 'Usuario incorrecto' });
      }
      const user = result[0];
      if (password !== user.password) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      return done(null, user);
    });
  }
));


// Serialización del usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialización del usuario
passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      return done(err);
    }
    const user = result[0];
    done(null, user);
  });
});

// Ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
  res.send(`
  <h1>Iniciar sesión</h1>
  <form method="post" action="/login" class="mt-4">
    <div class="form-group">
      <label for="username">Usuario:</label>
      <input type="text" class="form-control" id="username" name="username">
    </div>
    <div class="form-group">
      <label for="password">Contraseña:</label>
      <input type="password" class="form-control" id="password" name="password">
    </div>
    <button type="submit" class="btn btn-primary">Iniciar sesión</button>
    <a href="/register.html" class="btn btn-secondary">Registro</a>
  </form>
</main>
    
  `);
});

// Ruta para procesar el inicio de sesión
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);
// Ruta para procesar el registro de usuario
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
      connection.release();
      if (err) throw err;
      res.send('Usuario registrado exitosamente.');
    });
  });
});

// Ruta para la página principal
app.get('/', (req, res) => {
  // Comprueba si el usuario está autenticado
  if (!req.user) {
    return res.redirect('/login');
  }
  

  // Realiza una solicitud GET a la API de Pokemon
  https.get('https://pokeapi.co/api/v2/pokemon/', (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
        // Parsea los datos de la API y los muestra en la página
        const pokemon = JSON.parse(data);
        const pokemonList = pokemon.results.map((p) => `<li><a href="/pokemon?id=${getIdFromUrl(p.url)}">${p.name}</a></li>`).join('');
      const html = `<h1>Lista de Pokémon</h1><ul>${pokemonList}</ul>`;
      res.send(html);
      });
    });
});
// Ruta para mostrar la información de un Pokémon
app.get('/pokemon', (req, res) => {
    // Comprueba si el usuario está autenticado
    if (!req.user) {
      return res.redirect('/login');
    }
  
    // Obtiene el ID del Pokémon de la URL
    const id = req.query.id;
  
    // Realiza una solicitud GET a la API de Pokemon para obtener los detalles del Pokémon
    https.get(`https://pokeapi.co/api/v2/pokemon/${id}`, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
  
      apiRes.on('end', () => {
        // Parsea los datos de la API y los muestra en la página
        const pokemon = JSON.parse(data);
        const html = `
          <h1>${pokemon.name}</h1>
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          <ul>
            <li><strong>ID:</strong> ${pokemon.id}</li>
            <li><strong>Altura:</strong> ${pokemon.height} decímetros</li>
            <li><strong>Peso:</strong> ${pokemon.weight} hectogramos</li>
          </ul>
        `;
        res.send(html);
      });
    });
  });
  
  // Ruta para cerrar sesión
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
  app.get('/register.html', function(req, res) {
    res.sendFile(__dirname + '/public/register.html');
  });
  app.get('/index.html', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });
  
  
  const server = app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
  });
  
  function handleRegistrationFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
  
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Aquí puedes agregar código para redirigir al usuario a otra página después del registro exitoso
      })
      .catch(error => {
        console.error(error);
        // Aquí puedes agregar código para manejar el error en caso de que la solicitud falle
      });
  }

  
  
  