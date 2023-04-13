# pokemon
prueba tecnica

hay que recordar que para que este algoritmo funcione se necesita una base de datos en mysql que lleva por nombre pokémon y posee una tabla usuarios con los campos user name , password Y ID en donde la llave primaria es esta última “ID”.
Como una ayuda para crear la base de datos dejaré el archivo SQL para la creación de la base de datos la tabla con sus correspondientes campos y un único dato para ingresar al sistema.
-- -------------------------------------------------------- ---------------------------------------------------
También hay que recordar cambiar las credenciales dentro del algoritmo específicamente en el archivo app.js en la en las líneas de la 32 a la 36 las cuales poseen las credenciales de mysql instalado en el ordenador de manera local
“
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '2546',
  database: 'pokemon'
});
"
deberá cambiar, el host, el puerto, el usuario, la contraseña y el nombre de la base de datos si usted las modificó. 

muchas gracias por leer y hasta luego.

