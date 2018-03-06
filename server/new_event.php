<?php
  
require_once 'connection.php';

class NuevoEvento{
    
    public function __construct($datos) {
        $this->crearEvento($datos);
    }
    
    private function conexion(){
        $con = new Connection();
        return $con;
    }
    
    public function crearEvento($datos){
        $respuesta = array();
        
        $sql = mysqli_query($this->conexion(), "INSERT INTO eventos(titulo,fecha_inicio, fecha_fin,hora_inicio,hora_fin,dia_completo,id_usuario)"
                . " VALUES('". $datos['titulo'] ."','". $datos['start_date']."','". $datos['end_date'] ."','". $datos['start_hour'] ."',"
                . "'". $datos['end_hour'] ."','". $datos['allDay'] ."','". $datos['idusuario'] ."')");
             
        
        if ($sql) {
            $respuesta['msg'] = 'OK';
        }
        
        echo json_encode($respuesta);
    }
    
    public function cerrarConexion(){
        mysqli_close($this->conexion());
    }
    
}

header("Content-type: application/json");
$evento = new NuevoEvento($_POST);

 ?>
