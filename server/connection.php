<?php

class Connection extends mysqli{
    
    public function __construct(){
        parent::__construct('localhost', 'root', '', 'nextu_proyecto');
        $this->query("SET NAMES 'utf8'");
    }
    
}

