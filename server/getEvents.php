<?php

require_once 'connection.php';

class getEvents{
    
    public function __construct($idusuario){
        $this->getEventos($idusuario);
        $this->cerrarConexion();
    }
    
    private function conexion(){
        $con = new Connection();
        return $con;
    }
    
    public function getEventos($idusuario){
        $sql = mysqli_query($this->conexion(), "SELECT * FROM eventos WHERE id_usuario = '$idusuario'");
        
        $arr_eventos = array();
        
        while($row = mysqli_fetch_assoc($sql)){
            array_push($arr_eventos, array(
                'id' => $row['id_evento'],
                'title' => $row['titulo'], 
                'start' => $row['fecha_inicio'],
                'end' => $row['fecha_fin'],
                'allDay' => $row['dia_completo'],
            ));
        }
        
        echo json_encode(array("msg" => "OK", "eventos" => $arr_eventos));
    }

    public function cerrarConexion(){
        mysqli_close($this->conexion());
    }
    
}

header("Content-type: application/json");
$eventos = new getEvents($_GET['idusuario']);

 ?>
