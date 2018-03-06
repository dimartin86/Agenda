<?php

require_once 'connection.php';

Class CheckLogin {

    public function __construct($datos) {
        $this->verificarCredenciales($datos);
        $this->cerrarConexion();
    }

    private function conexion() {
        $con = new Connection();
        return $con;
    }

    public function verificarCredenciales($datos) {
        $respuesta = array();

        $sql = mysqli_query($this->conexion(), "SELECT * FROM usuarios WHERE email = '" . $datos['username'] . "'");

        if (mysqli_num_rows($sql) > 0) {
            while ($row = mysqli_fetch_assoc($sql)) {
                $password = $row['contrasena'];
                $id = $row['id_usuario'];
            }
            
            $respuesta['idusuario'] = $id;

            if (password_verify($datos['password'], $password)) {
                $respuesta['msg'] = "OK";
            } else {
                $respuesta['msg'] = "La contraseña es incorrecta";
            }
        } else {
            $respuesta['msg'] = "El usuario no se encuentra registrado";
        }

        echo json_encode($respuesta);
    }

    public function cerrarConexion() {
        mysqli_close($this->conexion());
    }

}

header("Content-type: application/json");
$loguear = new CheckLogin($_POST);
?>
