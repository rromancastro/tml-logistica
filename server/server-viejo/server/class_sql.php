<?php
date_default_timezone_set('America/Argentina/Buenos_Aires');


class Sql
{
    
    public $servername;
    public $username;
    public $password;
    public $dbname;
    public $connection;
    public $select;
    public $columns;
    public $hoy;
    public $meses;
    public $mal;
    public $youtube;
    
    
    function getMal(){
        return $this->mal;
    }
    
    function connect(){
        $actual_link = $_SERVER['HTTP_HOST'];
        if($actual_link=='localhost'){
            $this->servername = "localhost";
            $this->username = "root";
            $this->password = "manjarlo1";
            $this->dbname = "tml";
        }else{
            $this->servername = "localhost";
            $this->username = "c1411263_nueva";
            $this->password = "peVElera51";
            $this->dbname = "c1411263_nueva";
        }
  
     // Create connection
     $this->connection = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
     $this->connection->query("SET NAMES 'utf8'");
     $acentos= "SELECT convert(cast(convert(content using latin1) as binary) using utf8) AS content";
     $this->connection->query($acentos);
     $this->connection->query("SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000");

    // Check connection
    if ($this->connection->connect_error) {
     die("Connection failed: " . $this->connection->connect_error);
        }

    }
    
    public function endKey( $array ){
        end( $array );
        return key( $array );
    }
    
    public function showColumnNames($tabla){
        $this->connect();
        $sql = "SHOW COLUMNS FROM $tabla";
      //  echo $sql;
        $result = $this->connection->query($sql);
        while($row = $result->fetch_assoc()) {
                    $this->columns[] = $row["Field"];
                }
        return $this->columns;        
    }
   
    public function selectTablaNew($tabla,$filtro,$filtro_por,$orden,$limit){
        $this->connect();
            if($filtro==="no"){
                $sql = "Select * FROM $tabla";
            }else{
                $sql = "SELECT * FROM $tabla WHERE ";
                    foreach($filtro as $dato=>$filtrar){
                        if ($dato === $this->endKey($filtro)) {
                            $sql .= "$dato = '$filtrar'";
                        }else{
                            $sql .= "$dato = '$filtrar' AND ";
                        }
                    }
                }
        $sql .= " ORDER BY $filtro_por $orden ";
        $sql .= " LIMIT $limit"; 
        //echo $sql;    
        $result = $this->connection->query($sql);
        $columnas = $this->showColumnNames($tabla);
        //$rows = $result->num_rows;
            
            while($row = $result->fetch_assoc()) {
                for($i=0;$i<count($columnas);$i++){
                    $dato = $columnas[$i];
                    $array[$dato] = $row[$dato];
                  
                }
                $this->select[] = $array;
            }
            
      return $this->select;  
    }
    
    
    
    
     public function jsonConverter($array){
         $json = json_encode($array);
         echo $json;
         
     }

   
    
   public function edit($tabla,$item,$dato,$where,$id){
        $this->connect();
        
        $sql = "UPDATE $tabla
                SET $item='$dato'
                WHERE $where = '$id'";
        //echo $sql;
        $result = $this->connection->query($sql);
        
            if ($result === TRUE) {
                
                $this->connection->close();  
            } else {
                $this->mal++;
                $this->connection->close();  
            }
                
        }
        
        
        
    public function insert_array($tabla,$array){
            $this->connect();
            $todos = ""; 
            $values = "";
            $sql = "INSERT INTO $tabla (id,";
        foreach($array as $dato=>$filtrar){
                        if ($dato === $this->endKey($array)) {
                            $todos .= "$dato";
                            $values .= "'$filtrar'";
                        }else{
                            $sql .= "$dato,";
                            $values .= "'$filtrar',";
                        }
                }
        $sql .= $todos;
        $sql .=") VALUES ('null',";
        $sql .= $values;
        $sql .=")";
        //echo $sql;
        $result = $this->connection->query($sql);
            if ($result === TRUE) {
            echo "0";
                $this->connection->close();  
            } else {
            echo "Error: " . $sql . "<br>" . $this->connection->error;
                $this->connection->close();  
            }
    }

    public function insert_array_sin_cero($tabla,$array){
        $this->connect();
        $todos = ""; 
        $values = "";
        $sql = "INSERT INTO $tabla (id,";
        foreach($array as $dato=>$filtrar){
                    if ($dato === $this->endKey($array)) {
                        $todos .= "$dato";
                        $values .= "'$filtrar'";
                    }else{
                        $sql .= "$dato,";
                        $values .= "'$filtrar',";
                    }
            }
        $sql .= $todos;
        $sql .=") VALUES ('null',";
        $sql .= $values;
        $sql .=")";
        //echo $sql;
         $result = $this->connection->query($sql);
        if ($result === TRUE) {
        //echo "0";
            $this->connection->close();  
        } else {
        //echo "Error: " . $sql . "<br>" . $this->connection->error;
            $this->connection->close();  
        }
    }
        
    public function getlastId($tabla){
        $this->connect();
        $sql = "SELECT id FROM $tabla ORDER BY id DESC LIMIT 1";
        $result = $this->connection->query($sql);
            if ($result->num_rows > 0) {
            // output data of each row
                while($row = $result->fetch_assoc()) {
                    $this->id = $row["id"];
                }
            } else {
        //        echo "0 results";
                $this->connection->close(); 
            }
            return $this->id;
             
    }
    
  
        function delete_foto($tabla,$foto_base,$nombre){
        $this->connect();
        $sql = "DELETE FROM $tabla WHERE $foto_base = '$nombre'";
               
        //echo $sql;
        $result = $this->connection->query($sql); 
        if ($result === TRUE) {
        //echo "Record DELETE successfully $tabla, $nombre";
        } else {
       // echo "Error DELETING record: " . $this->connection->error ."<br>";
        }
        
    }
    function delete($tabla, $item, $dato){
        $this->connect();
        //echo "dato: $dato";
        $sql = "DELETE FROM $tabla WHERE $item = '$dato'";
               
        //echo $sql;
        $result = $this->connection->query($sql); 
        if ($result === TRUE) {
        //echo "Record DELETE successfully $tabla, $dato";
        } else {
     //   echo "Error DELETING record: " . $this->connection->error ."<br>";
        }
        
        }
       
        
        function deleteDirectory($dir) {
            if(!$dh = @opendir($dir)) return;
            while (false !== ($current = readdir($dh))) {
                if($current != '.' && $current != '..') {
                    echo 'Se ha borrado el archivo '.$dir.'/'.$current.'<br/>';
                    if (!@unlink($dir.'/'.$current)) 
                        deleteDirectory($dir.'/'.$current);
                }       
            }
            closedir($dh);
            echo 'Se ha borrado el directorio '.$dir.'<br/>';
            @rmdir($dir);
    }
    
    function fechas30dias(){
        $this->connect();
        $hoy = date('Y/m/d');
        $mes = date("Y/m/d",strtotime($fecha_actual."+ 30 days")); 
        $sql = "SELECT * FROM fechas WHERE fecha BETWEEN '$hoy' AND '$mes' ORDER BY fecha ASC";
       // echo $sql;
        $result = $this->connection->query($sql);
        $columnas = $this->showColumnNames('fechas');
            while($row = $result->fetch_assoc()) {
                for($i=0;$i<count($columnas);$i++){
                    $dato = $columnas[$i];
                    $array[$dato] = $row[$dato];
                }
                $this->select[] = $array;
            }
            
      return $this->select; 
    } 

    function spotify(){
        $this->connect();
        $sql = "SELECT * FROM spotify WHERE mostrar = 'si' ORDER BY id ASC";
        $result = $this->connection->query($sql);
        $columnas = $this->showColumnNames('spotify');
            while($row = $result->fetch_assoc()) {
                for($i=0;$i<count($columnas);$i++){
                    $dato = $columnas[$i];
                    $array[$dato] = $row[$dato];
                }
                $this->select[] = $array;
            }
            
      return $this->select; 
    } 

    function youtube(){
        $this->connect();
        $sql = "SELECT * FROM youtube WHERE mostrar = 'si' ORDER BY id ASC";
        $result = $this->connection->query($sql);
        $columnas = $this->showColumnNames('youtube');
            while($row = $result->fetch_assoc()) {
                for($i=0;$i<count($columnas);$i++){
                    $dato = $columnas[$i];
                    $array[$dato] = $row[$dato];
                }
                $this->youtube[] = $array;
            }
            
      return $this->youtube; 
    } 
       
}








