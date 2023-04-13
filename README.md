# pokemon
prueba tecnica

hay que recordar que para que este algoritmo funcione se necesita una base de datos en mysql que lleva por nombre pokémon y posee una tabla usuarios con los campos user name , password Y ID en donde la llave primaria es esta última “ID”.
Como una ayuda para crear la base de datos dejaré el siguiente SQL para la creación de la base de datos la tabla con sus correspondientes campos y un único dato para ingresar al sistema.
-- -------------------------------------------------------- ------------------------------------------------------
-- Host: localhost    Database: pokemon
-- ------------------------------------------------------
-- Server version	8.0.31
create database pokemon;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--
-- Dumping data for table `users`
--
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('juanchoarguello@gmail.com','2546',1),(NULL,'2546',2),(NULL,'2546',3),(NULL,'2546',4),(NULL,'2546',5),('juanchoarguello@gmail.com','2546',6);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
-- -------------------------------------------------------- ------------------------------------------------------

También hay que recordar cambiar las credenciales dentro del algoritmo específicamente en el archivo app.js en la en las líneas de la 32 a la 36 las cuales poseen las credenciales de mysql instalado en el ordenador de manera local
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '2546',
  database: 'pokemon'
});

De ver a cambiar el host el puerto el usuario la contraseña y el nombre de la base de datos si usted las modificó 

muchas gracias por leer y hasta luego.
