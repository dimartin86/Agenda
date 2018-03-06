<?php

require_once 'connection.php';

class CreateUser{
    
    public function __construct($email, $nombre, $contrasena, $f_nacimiento){
        $this->create($email, $nombre, $contrasena, $f_nacimiento);
        $this->cerrarConexion();
    }
    
    private function conexion(){
        $con = new Connection();
        return $con;
    }
    
    public function create($email,$nombre,$contrasena,$f_nacimiento){
        $verificar = mysqli_query($this->conexion(), "SELECT id_usuario FROM usuarios WHERE email = '$email'");
        
        if (mysqli_num_rows($verificar) > 0) {
            echo "El usuario $email ya se encuentra registrado <br>";
        }
        else{
            $sql = mysqli_query($this->conexion(), "INSERT INTO usuarios(email,nombre,contrasena,fecha_nacimiento)"
                    . "VALUES('$email','$nombre','$contrasena','$f_nacimiento')");

            if ($sql) {
                echo "Registro creado!<br>";
            }            
        }
    }
    
        public function cerrarConexion(){
            mysqli_close($this->conexion());
        }
    
}

$usu1 = new CreateUser('diego@diego.com','Diego Martin',password_hash('dimartin1', PASSWORD_DEFAULT),'1986-10-24');
$usu2 = new CreateUser('andres@andres.com','Andres Rojas',password_hash('dimartin2', PASSWORD_DEFAULT),'1987-10-24');
$usu3 = new CreateUser('leonardo@leonardo.com','Leonardo Martin',password_hash('dimartin3', PASSWORD_DEFAULT),'1988-10-24');

 ?>
