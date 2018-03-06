<?php

require_once 'connection.php';

class DeleteEvent{
    
    public function __construct($id){
        $this->eliminarEvento($id);
    }
    
    public function conexion(){
        $con = new Connection();
        return $con;
    }
    
    public function eliminarEvento($id){
        $sql = mysqli_query($this->conexion(), "delete from eventos where id_evento = '$id'");       
        
        if ($sql) {
            $respuesta = array('msg' => 'OK');
        }
        else{
            $respuesta = array('msg' => 'error');
        }
        
        echo json_encode($respuesta);
    } 
    
    public function cerrarConexion(){
        mysqli_close($this->conexion());
    }
    
}

header("Content-type: application/json");
$borrar = new DeleteEvent($_POST['id']);


 ?>
