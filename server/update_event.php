<?php

require_once 'connection.php';

class UpdateEvent{
    
    public function __construct($id, $fecha_ini, $fecha_fin, $todo_dia, $hora_ini, $hora_fin){
        $this->ActualizarEvento($id, $fecha_ini, $fecha_fin, $todo_dia, $hora_ini, $hora_fin);
    }
    
    public function conexion(){
        $con = new Connection();
        return $con;
    }
    
    public function ActualizarEvento($id, $fecha_ini, $fecha_fin, $todo_dia, $hora_ini, $hora_fin){
        
        $sql = mysqli_query($this->conexion(), "update eventos set "
                . "fecha_inicio = '$fecha_ini', "
                . "fecha_fin = '$fecha_fin', "
                . "dia_completo = '$todo_dia', "
                . "hora_inicio = '$hora_ini', "
                . "hora_fin = '$hora_fin' "
                . "where id_evento = '$id'");      
        
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
$actualizar = new UpdateEvent($_POST['id'],$_POST['fecha_ini'],$_POST['fecha_fin'],$_POST['todo_dia'],$_POST['hora_ini'],$_POST['hora_fin']);


 ?>

