<?php
date_default_timezone_set('America/Argentina/Buenos_Aires');

require 'config/config.php';

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
    public $id;
    public $youtube;
    
    function __construct()
    {
        $this->mal = 0; // Inicializar mal aquí
        $this->connect(); // Conectarse una sola vez al instanciar
    }

    function getMal(){
        return $this->mal;
    }
    
    function connect(){
        $actual_link = $_SERVER['HTTP_HOST'];
        if($actual_link=='localhost'){
            // CASA  
            $this->servername = DB_HOST;
            $this->username = DB_USER;
            $this->password = DB_PASS;
            $this->dbname = DB_NAME;

        }else{
        //ONLINE  
        
            $this->servername = DB_HOST;
            $this->username = DB_USER;
            $this->password = DB_PASS;
            $this->dbname = DB_NAME;
        }
     // Create connection
     $this->connection = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
     $this->connection->query("SET NAMES 'utf8'");
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
        $this->columns = [];
        $sql = "SHOW COLUMNS FROM $tabla";
      //  echo $sql;
        $result = $this->connection->query($sql);
        if ($result === false) {
            return [];
        }
        while($row = $result->fetch_assoc()) {
                    $this->columns[] = $row["Field"];
                }
        return $this->columns;        
    }

    public function showColumnNamesPdo($tabla): array {
        $this->connect(); // $this->connection debe ser una instancia de PDO

        // Sanitizar identificador
        if (!preg_match('/^[a-zA-Z0-9_]{1,64}$/', $tabla)) {
            throw new Exception("Nombre de tabla inválido");
        }

        $stmt = $this->connection->prepare("SHOW COLUMNS FROM `$tabla`");
        $stmt->execute();
        $columnas = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $columnas[] = $row['Field'];
        }

        return $columnas;
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
    public function insert_array_new($tabla, $array, $display_error) {
    $this->connect();

    if (!preg_match('/^[a-zA-Z0-9_]+$/', $tabla)) {
        $out = ['error' => 'Nombre de tabla inv�lido.'];
        if ($display_error === 'si') echo json_encode($out, JSON_UNESCAPED_UNICODE);
        $this->connection->close();
        return $out;
    }

    $columnasValidas = $this->showColumnNames($tabla);
    $arrayFiltrado = [];

    foreach ($array as $col => $val) {
        if (!is_string($col) || $col === 'id' || !in_array($col, $columnasValidas, true)) {
            continue;
        }

        if ($val === null) {
            continue;
        }

        if (in_array(strtolower($col), ['pass','password','contraseña'])) {
            $val = password_hash((string)$val, PASSWORD_DEFAULT);
        }

        $arrayFiltrado[$col] = $val;
    }

    if (count($arrayFiltrado) === 0) {
        $out = ['error' => 'No hay campos v�lidos para insertar.'];
        if ($display_error === 'si') echo json_encode($out, JSON_UNESCAPED_UNICODE);
        $this->connection->close();
        return $out;
    }

    $cols = [];
    $placeholders = [];
    $types = '';
    $values = [];

    foreach ($arrayFiltrado as $col => $val) {
        $cols[] = "`$col`";
        $placeholders[] = '?';

        if (is_int($val)) {
            $types .= 'i';
        } elseif (is_float($val)) {
            $types .= 'd';
        } else {
            $types .= 's';
        }

        $values[] = $val;
    }

    $sql = sprintf(
        "INSERT INTO `%s` (%s) VALUES (%s)",
        $tabla,
        implode(',', $cols),
        implode(',', $placeholders)
    );

    $stmt = $this->connection->prepare($sql);
    if ($stmt === false) {
        $out = ['error' => $this->connection->error];
        if ($display_error === 'si') echo json_encode($out, JSON_UNESCAPED_UNICODE);
        $this->connection->close();
        return $out;
    }

    $stmt->bind_param($types, ...$values);
    $ok = $stmt->execute();

    if ($ok) {
        $last_id = $this->connection->insert_id;
        $out = ['error' => '0', 'last_id' => $last_id];
    } else {
        $out = ['error' => $stmt->error];
    }

        if ($display_error === 'si') echo json_encode($out, JSON_UNESCAPED_UNICODE);
        $stmt->close();
        $this->connection->close();
        return $out;
    }
    
     public function jsonConverter($array){
         $json = json_encode($array);
         echo $json;
         
     }

   
    public function edit_new($tabla, $item, $dato, $where, $id) {
        $this->connect();

    // Sólo hash si parece texto plano
        if (in_array(strtolower($item), ['pass','password','contraseña']) &&
            !preg_match('/^\$2[ayb]\$\d{2}\$[0-9A-Za-z\.\/]{53}$/', $dato)
            ) {
                $dato = password_hash($dato, PASSWORD_DEFAULT);
            }

        $sql = "UPDATE `$tabla` SET `$item` = ? WHERE `$where` = ?";
        $stmt = $this->connection->prepare($sql);
        $stmt->bind_param('ss', $dato, $id);
        $ok = $stmt->execute();
        $this->connection->close();

        return json_encode(['error' => $ok ? '0' : $stmt->error]);
    }

    public function editBlog($tabla, $item, $dato, $where, $id) {
        // Compatibilidad con endpoints viejos que esperan este nombre de m�todo.
        // Reutilizamos el update preparado para no romper HTML ni valores con comillas.
        return $this->edit_new($tabla, $item, $dato, $where, $id);
    }

    public function edit($tabla, $item, $dato, $where, $id) {
    //echo "Punto A: Dentro del método edit.\n";
    $this->connect();
    //echo "Punto B: Conexión a la base de datos establecida.\n";

    if (in_array(strtolower($item), ['pass', 'password', 'contraseña'])) {
        if (!preg_match('/^\$2[ayb]\$\d{2}\$[0-9A-Za-z\.\/]{53}$/', $dato)) {
            $dato = password_hash($dato, PASSWORD_DEFAULT);
            //echo "Punto C: Se ha hasheado la contraseña.\n";
        }
    }

    $sql = "UPDATE $tabla SET $item ='$dato' WHERE $where = '$id'";
    //echo "Punto D: SQL generado: " . htmlspecialchars($sql) . "\n";
    
    // Ejecutar la consulta
    $result = $this->connection->query($sql);
    //echo "Punto E: Consulta ejecutada.\n";
    
    if ($result === TRUE) {
        //echo "Punto F: La consulta se ejecutó con éxito.\n";
        return json_encode(['error' => '0']);
    } else {
        //echo "Punto G: La consulta falló.\n";
        $error_message = $sql . "<br>" . $this->connection->error;
        $this->mal++;
        //echo "Punto H: 'mal' incrementado a: " . $this->mal . "\n";
        return json_encode(['error' => $error_message]);
    }
}
        
        
        
    public function insert_array($tabla, $array, $display_error) {
        $this->connect();
        $todos = ""; 
        $values = "";
        $sql = "INSERT INTO $tabla (id,";
        
        foreach ($array as $dato => $filtrar) {
            // Si la clave es una contraseña, la ciframos con password_hash()
            if (in_array(strtolower($dato), ['pass', 'password', 'contraseña'])) {
                $filtrar = password_hash($filtrar, PASSWORD_DEFAULT);
            }
    
            if ($dato === $this->endKey($array)) {
                $todos .= "$dato";
                $values .= "'$filtrar'";
            } else {
                $sql .= "$dato,";
                $values .= "'$filtrar',";
            }
        }
    
        $sql .= $todos;
        $sql .= ") VALUES ('null',";
        $sql .= $values;
        $sql .= ")";
    
        // Ejecutar la consulta
        $result = $this->connection->query($sql);
        if ($result === TRUE) {
            $last_id = $this->connection->insert_id;
            $error_message = '0';
            $error_array = array('error' => $error_message, 'last_id' => $last_id);
            $error_json = json_encode($error_array);
            if ($display_error == 'si') {
                echo $error_json;
            }
            $this->connection->close();  
        } else {
            $error_message = $sql . "<br>" . $this->connection->error;
            $error_array = array('error' => $error_message);
            $error_json = json_encode($error_array);
            if ($display_error == 'si') {
                echo $error_json;
            }
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
                echo 0;
            } else {
                echo 1;
            }
        }
       
        
        function deleteDirectory($dir) {
            if(!$dh = @opendir($dir)) return;
            while (false !== ($current = readdir($dh))) {
                if($current != '.' && $current != '..') {
                    echo 'Se ha borrado el archivo '.$dir.'/'.$current.'<br/>';
                    if (!@unlink($dir.'/'.$current)) 
                        $this->deleteDirectory($dir.'/'.$current);
                }       
            }
            closedir($dh);
            echo 'Se ha borrado el directorio '.$dir.'<br/>';
            @rmdir($dir);
    }
    
    function fechas30dias($fecha_actual){
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
    public function excel ($tabla){
        $this->connect();
        $result = $this->connection->query("SHOW COLUMNS FROM $tabla");
        $columns = array();
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row['Field'];
        }
        $sql = "SELECT * from $tabla ORDER By id LIMIT 9999";
        $result = $this->connection->query($sql);
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $this->connection->close();
        return $data;
    } 

    function getTableData($tableName,$id,$order,$by) {
        $this->connect();
        // Obtener las columnas de la tabla
        $result = $this->connection->query("SHOW COLUMNS FROM $tableName");
        $columns = array();
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row['Field'];
        }
        // SI EL ID ES IGUAL A 0 TRAE
        if($id == 0){
            // Crear la consulta preparada
            $query = "SELECT " . implode(",", $columns) . " FROM $tableName order by $by $order LIMIT 9999";
            $stmt = $this->connection->prepare($query);
        }else{
            $query = "SELECT " . implode(",", $columns) . " FROM $tableName WHERE id = ? order by id DESC LIMIT 9999";
            $stmt = $this->connection->prepare($query);
            $stmt->bind_param("i", $id);
        }
    
        // Ejecutar la consulta
        $stmt->execute();
    
        // Obtener el resultado en un array
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $this->connection->close();
        return $data;
    }

    function getTableDataUnique($tableName,$columna) {
        $this->connect();
        // Obtener las columnas de la tabla
        $result = $this->connection->query("SHOW COLUMNS FROM $tableName");
        $columns = array();
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row['Field'];
        }
        // SI EL ID ES IGUAL A 0 TRAE
        if($this->id == 0){
            // Crear la consulta preparada
            $query = "SELECT " . implode(",", $columns) . " FROM $tableName";
            $stmt = $this->connection->prepare($query);
        }else{
            $query = "SELECT " . implode(",", $columns) . " FROM $tableName WHERE id = ?";
            $stmt = $this->connection->prepare($query);
            $stmt->bind_param("i", $this->id);
        }
    
        // Ejecutar la consulta
        $stmt->execute();
    
        // Obtener el resultado en un array
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $this->connection->close();
        return $data;
    }

    function getTableDataFiltro($tableName,$id,$filtro) {
        $this->connect();
        // Obtener las columnas de la tabla
        $result = $this->connection->query("SHOW COLUMNS FROM $tableName");
        $columns = array();
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row['Field'];
        }
        // SI EL ID ES IGUAL A 0 TRAE
        if($id == 0){
            // Crear la consulta preparada
            $query = "SELECT " . implode(",", $columns) . " FROM $tableName";
            $stmt = $this->connection->prepare($query);
        }else{
            $query = "SELECT " . implode(",", $columns) . " FROM $tableName WHERE id = ?";
            $stmt = $this->connection->prepare($query);
            $stmt->bind_param("i", $id);
        }
    
        // Ejecutar la consulta
        $stmt->execute();
    
        // Obtener el resultado en un array
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $this->connection->close();
        return $data;
    }
    function getTableDataBusqueda($tableName, $columnsAndWords) {
        $this->connect();
        
        // Obtener las columnas de la tabla
        $result = $this->connection->query("SHOW COLUMNS FROM $tableName");
        $columns = array();
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row['Field'];
        }
    
        // Crear la cláusula WHERE
        $whereClause = "";
        $values = array();
        $types = "";
        $i = 0;
        foreach ($columnsAndWords as $column => $word) {
            if($i > 0){
                $whereClause .= " AND ";
            }
            $whereClause .= "$column = ?";
            $values[] = $word;
            $types .= "s";  // Asumiendo que todos los parámetros son strings
            $i++;
        }
        if($whereClause != ""){
            $whereClause = " WHERE " . $whereClause;
        }
        
        // Crear la consulta preparada
        $query = "SELECT " . implode(",", $columns) . " FROM $tableName" . $whereClause;
       // echo $query;  // Verificar la consulta
        
        $stmt = $this->connection->prepare($query);
        
        if ($stmt === false) {
            die('Error en la preparación de la consulta: ' . $this->connection->error);
        }
    
        // Vincular los parámetros de la consulta
        if (!empty($values)) {
            $stmt->bind_param($types, ...$values);  // Usar el operador splat (...) en lugar de call_user_func_array
        }
    
        // Ejecutar la consulta
        $stmt->execute();
        
        // Obtener el resultado en un array
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        
        $stmt->close();  // Cerrar la sentencia preparada
        $this->connection->close();
        
        return $data;
    }
    
    function getTableDataBusquedaOrderBy($tableName, $columnsAndWords,$order,$by) {
        $this->connect();
        // Obtener las columnas de la tabla
        $result = $this->connection->query("SHOW COLUMNS FROM $tableName");
        $columns = array();
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row['Field'];
        }
    
        // Crear la cláusula WHERE
        $whereClause = "";
        $values = array();
        $types = "";
        $i = 0;
        foreach ($columnsAndWords as $column => $word) {
            if($i > 0){
                $whereClause .= " AND ";
            }
            $whereClause .= "$column = ?";
            $values[] = $word;
            $types .= "s";
            $i++;
        }
        if($whereClause != ""){
            $whereClause = " WHERE " . $whereClause;
        }
        // Crear la consulta preparada
        $query = "SELECT " . implode(",", $columns) . " FROM $tableName" . $whereClause;
        $query .=' order by '.$order.' '.$by;
        //echo $query;

        $stmt = $this->connection->prepare($query);
    
        // Vincular los parámetros de la consulta
        array_unshift($values, $types);
        call_user_func_array(array($stmt, 'bind_param'), $this->refValues($values));
    
        // Ejecutar la consulta
        $stmt->execute();
    
        // Obtener el resultado en un array
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $this->connection->close();
        return $data;
    }

    function refValues($arr){
        if (strnatcmp(phpversion(),'5.3') >= 0) //Reference is required for PHP 5.3+
        {
            $refs = array();
            foreach($arr as $key => $value)
                $refs[$key] = &$arr[$key];
            return $refs;
        }
        return $arr;
    }
    public function doyLaConsulta($consulta){
        $this->connect();
        $sql = $consulta; 
        //echo $sql;
        $result = $this->connection->query($sql);
        $rows = $result->num_rows;
            
            while($row = $result->fetch_assoc()) {
                for($i=0;$i<$rows;$i++){
                    $array = $row;
                }
                $this->select = $array;
            }
        return $this->select;  
    }

    
    function traerModulos($empresa) {
        $this->connect();
        $sql = "SELECT 
                p.id AS postre_id,
                p.empresa AS postre_empresa,
                p.postre_boolean AS postre_boolean,
                p.postre_empresa AS postres,
                p.usar_modulo_fijo AS postre_fijo_boolean,
                p.id_modulo_fijo AS postres_modulos_fijos,
                
                m.empresa AS modulo_empresa,
                m.modulo_boolean AS modulo_boolean,
                m.modulo_empresa AS modulos,
                m.usar_modulo_fijo AS usar_modulo_fijo,
                m.id_modulo_fijo AS modulos_fijos,
                m.usar_solo_modulo_fijo AS usar_solo_modulo_fijo,
               
                b.empresa AS bebida_empresa,
                b.bebidas_boolean AS bebida_boolean,
                b.bebida_empresa AS bebidas
            FROM 
                asignar_postre p
            INNER JOIN 
                asignar_modulo m ON p.empresa = m.empresa
            INNER JOIN 
                asignar_bebidas b ON p.empresa = b.empresa
            WHERE 
                p.empresa = ?";  // Usamos ? como placeholder en lugar de :empresa
        //echo $sql;
        try {
            // Preparamos la consulta usando MySQLi
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }
            
            // Enlazamos el parámetro
            $stmt->bind_param('s', $empresa);
            
            // Ejecutamos la consulta
            $stmt->execute();
            
            // Obtenemos el resultado
            $result = $stmt->get_result();
            
            $modulos = [];
            
            // Iteramos sobre el resultado
            while ($row = $result->fetch_assoc()) {
                $modulos[] = [
                    'postre_id' => $row['postre_id'],
                    'postre_empresa' => $row['postre_empresa'],
                    'postre_boolean' => $row['postre_boolean'],
                    'postre_fijo_boolean' => $row['postre_fijo_boolean'],
                    'postres' => $row['postres'],
                    'postres_modulos_fijos' => $row['postres_modulos_fijos'],
                    'modulo_empresa' => $row['modulo_empresa'],
                    'modulo_boolean' => $row['modulo_boolean'],
                    'modulos' => $row['modulos'],
                    'usar_modulo_fijo' =>$row['usar_modulo_fijo'],
                    'modulos_fijos' =>$row['modulos_fijos'],
                    'bebida_empresa' => $row['bebida_empresa'],
                    'bebida_boolean' => $row['bebida_boolean'],
                    'bebidas' => $row['bebidas'],
                    'usar_solo_modulo_fijo' => $row['usar_solo_modulo_fijo']
                ];
            }
            
            // Cerramos el statement
            $stmt->close();
            
            return $modulos;  // Devuelve el array con todos los datos
            
        } catch (Exception $e) {
            error_log('Error en traerModulos: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }
    }
    

    
       
    function filterFilters($filters) {
        $filteredFilters = [];
        
        foreach ($filters as $filter) {
            $filteredFilter = [];
            foreach ($filter as $key => $value) {
                // Solo agregamos el par clave-valor si el valor no es 'todas'
                if (trim($value) !== 'todas') {
                    $filteredFilter[$key] = $value;
                }
            }
            // Solo agregamos el filtro si tiene elementos después de la filtración
            if (!empty($filteredFilter)) {
                $filteredFilters[] = $filteredFilter;
            }
        }
        
        return $filteredFilters;
    }

    function addQuotesToValues($array) {
        foreach ($array as &$subArray) {
            foreach ($subArray as $key => &$value) {
                $value = '"' . $value . '"';
            }
        }
        return $array;
    }
    
    function traerPlatos($modulo){
        $this->connect();
        $sql ="SELECT 
            m.id AS modulo_id,
            m.nombre AS modulo_nombre,
            m.platos AS platos_en_modulo,
            p.id AS plato_id,
            p.nombre AS plato_nombre,
            p.img AS plato_img,
            p.descripcion AS plato_descripcion,
            p.categoria AS plato_categoria,
            p.mostrar AS plato_mostrar,
            p.condicion AS plato_condicion
            p.precio AS plato_precio
            FROM 
                modulos m
            INNER JOIN 
                platos p ON FIND_IN_SET(TRIM(p.nombre), REPLACE(m.platos, ', ', ',')) > 0
            WHERE 
                m.mostrar = 1  -- Filtra solo los módulos activos
                AND p.mostrar = 1  -- Filtra solo los platos activos
                AND m.nombre = ?"; 
        try {
            // Preparamos la consulta usando MySQLi
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }
            
            // Enlazamos el parámetro
            $stmt->bind_param('s', $modulo);
            
            // Ejecutamos la consulta
            $stmt->execute();
            
            // Obtenemos el resultado
            $result = $stmt->get_result();
            
            $modulos = [];
            
            // Iteramos sobre el resultado
            while ($row = $result->fetch_assoc()) {
                $modulos[] = [
                    'modulo_id' => $row['modulo_id'],
                    'modulo_nombre' => $row['modulo_nombre'],
                    'platos_en_modulo' => $row['platos_en_modulo'],
                    'plato_id' => $row['plato_id'],
                    'plato_nombre' => $row['plato_nombre'],
                    'plato_img' => $row['plato_img'],
                    'plato_descripcion' => $row['plato_descripcion'],
                    'plato_categoria' => $row['plato_categoria'],
                    'plato_mostrar' => $row['plato_mostrar'],
                    'plato_condicion' => $row['plato_condicion'],
                    'plato_precio' => $row['plato_precio']
                ];
            }
            
            // Cerramos el statement
            $stmt->close();
            
            return $modulos;  // Devuelve el array con todos los datos
            
        } catch (Exception $e) {
            error_log('Error en traerModulos: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }        
    }

    function traerPlatosPorNombre($nombre){
        $this->connect();
        $sql ="SELECT 
            *
            FROM 
                platos m
            WHERE 
                nombre = ?"; 
        try {
            // Preparamos la consulta usando MySQLi
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }
            
            // Enlazamos el parámetro
            $stmt->bind_param('s', $nombre);
            
            // Ejecutamos la consulta
            $stmt->execute();
            
            // Obtenemos el resultado
            $result = $stmt->get_result();
            
            $modulos = [];
            
            // Iteramos sobre el resultado
            while ($row = $result->fetch_assoc()) {
                $modulos = [
                    'plato_id' => $row['id'],
                    'plato_nombre' => $row['nombre'],
                    'plato_img' => $row['img'],
                    'plato_descripcion' => $row['descripcion'],
                    'plato_categoria' => $row['categoria'],
                    'plato_mostrar' => $row['mostrar'],
                    'plato_condicion' => $row['condicion'],
                    'plato_precio' => $row['precio']
                ];
            }
            
            // Cerramos el statement
            $stmt->close();
            
            return $modulos;  // Devuelve el array con todos los datos
            
        } catch (Exception $e) {
            error_log('Error en traerModulos: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }        
    }

    function traerPlatosDeMenuFijo($modulo){
        $this->connect();
        $sql ="SELECT 
            m.nombre AS modulo_nombre,
            m.platos AS platos_en_modulo,
            p.nombre AS plato_nombre,
            p.mostrar
            FROM 
                modulos_fijos m
            INNER JOIN 
                platos p ON FIND_IN_SET(p.nombre, REPLACE(REPLACE(m.platos, '[', ''), ']', '')) > 0 
            WHERE 
                    m.mostrar = 'si'  -- Filtra solo los módulos activos
                AND p.mostrar = 'si'  -- Filtra solo los platos activos
                AND m.nombre = $modulo"; 
                echo $sql;
        try {
            // Preparamos la consulta usando MySQLi
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }
            
            // Enlazamos el parámetro
            //$stmt->bind_param('s', $modulo);
            
            // Ejecutamos la consulta
            $stmt->execute();
            
            // Obtenemos el resultado
            $result = $stmt->get_result();
            
            $modulos = [];
            
            // Iteramos sobre el resultado
            while ($row = $result->fetch_assoc()) {
                $modulos = [
                    'platos_en_modulo' => $row['platos_en_modulo'],
                ];
            }
            
            // Cerramos el statement
            $stmt->close();
            
            return $modulos;  // Devuelve el array con todos los datos
            
        } catch (Exception $e) {
            error_log('Error en traerModulos: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }        
    }

    function tienePedidos($id){
        $sql = "SELECT 
            m.mes AS mes, 
            m.dia AS dia,
            m.anio AS anio, 
            m.menu AS menu,
            p.plato AS plato,
            p.menu AS modulo,
            p.id AS pedido_id,
            CASE 
                WHEN p.id IS NOT NULL THEN '1' 
                ELSE '0' 
            END AS estado_pedido
            FROM mes m
            LEFT JOIN pedidos p
            ON m.dia = p.dia 
            AND m.mes = p.mes
            AND m.anio = p.anio 
            AND p.id_usuario = ?
            WHERE m.mostrar = 'si'";
            try {
                // Preparamos la consulta usando MySQLi
                $stmt = $this->connection->prepare($sql);
                if (!$stmt) {
                    throw new Exception($this->connection->error);
                }
                
                // Enlazamos el parámetro
                $stmt->bind_param('s', $id);
                
                // Ejecutamos la consulta
                $stmt->execute();
                
                // Obtenemos el resultado
                $result = $stmt->get_result();
                
                $modulos = [];
                
                // Iteramos sobre el resultado
                while ($row = $result->fetch_assoc()) {
                    $modulos[] = [
                        'mes' => $row['mes'],
                        'dia' => $row['dia'],
                        'anio' => $row['anio'],
                        'pedido_id' => $row['pedido_id'],
                        'estado_pedido' => $row['estado_pedido'],
                        'menu' => $row['menu'],
                        'plato' => $row['plato'],
                        'modulo' => $row['modulo'],
                    ];
                }
                
                // Cerramos el statement
                $stmt->close();
                
                return $modulos;  // Devuelve el array con todos los datos
                
            } catch (Exception $e) {
                error_log('Error en traerModulos: ' . $e->getMessage());
                return null;
            } finally {
                $this->connection = null;
            }  
    }

    function traerMesConMasInfo($dia,$mes,$anio) {
        $this->connect();
        $intDia = (int)$dia;
        $sql = "
                SELECT 
                    m.anio, 
                    m.mes, 
                    m.dia, 
                    m.menu, 
                    m.mostrar, 
                    m.semana, 
                    h.id AS plato_id, 
                    h.nombre AS plato_nombre, 
                    h.img AS plato_img, 
                    h.descripcion AS plato_descripcion, 
                    h.categoria AS plato_categoria, 
                    h.mostrar AS plato_mostrar, 
                    h.condicion AS plato_condicion, 
                    h.precio AS plato_precio 
                FROM mes m 
                INNER JOIN platos h 
                    ON m.menu LIKE CONCAT('%[', h.nombre, ']%') 
                WHERE m.mostrar = 'si' 
                    AND m.anio = $anio 
                    AND m.mes = '$mes' 
                    AND m.dia = $intDia";
    
        try {
            // Preparamos la consulta usando MySQLi
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }
            
            // Ejecutamos la consulta
            $stmt->execute();
    
            // Obtenemos el resultado
            $result = $stmt->get_result();
    
            $modulos = [];
    
            // Iteramos sobre el resultado
            while ($row = $result->fetch_assoc()) {
                $modulos[] = [
                    'anio' => $row['anio'],
                    'mes' => $row['mes'],
                    'dia' => $row['dia'],
                    'menu' => $row['menu'],
                    'mostrar' => $row['mostrar'],
                    'semana' => $row['semana'],
                    'plato_id' => $row['plato_id'],
                    'plato_nombre' => $row['plato_nombre'],
                    'plato_img' => $row['plato_img'],
                    'plato_descripcion' => $row['plato_descripcion'],
                    'plato_categoria' => $row['plato_categoria'],
                    'plato_mostrar' => $row['plato_mostrar'],
                    'plato_condicion' => $row['plato_condicion'],
                    'plato_precio' => $row['plato_precio']
                ];
            }
    
            // Cerramos el statement
            $stmt->close();
    
            return $modulos;  // Devuelve el array con todos los datos
    
        } catch (Exception $e) {
            error_log('Error en traerMesConMasInfo: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }
    }


    function traerPedidosUsuario($id_user){
        $this->connect();
        $sql = 
            "SELECT 
                pp.id_usuario AS usuario_plato, 
                pp.mes AS mes_plato, 
                pp.dia AS dia_plato, 
                pp.anio AS anio_plato, 
                pp.plato AS plato,
                pp.pagado AS plato_pagado,
                
                po.id_usuario AS usuario_postre, 
                po.mes AS mes_postre, 
                po.dia AS dia_postre, 
                po.anio AS anio_postre, 
                po.plato AS postre, 
                po.pagado AS postre_pagado,
                
                pb.id_usuario AS usuario_bebida, 
                pb.mes AS mes_bebida, 
                pb.dia AS dia_bebida, 
                pb.anio AS anio_bebida,
                pb.bebida,
                pb.pagado AS bebida_pagado
            FROM pedidos pp
            INNER JOIN pedidos_postres po 
                ON pp.id_usuario = po.id_usuario 
                AND pp.dia = po.dia 
                AND pp.mes = po.mes 
                AND pp.anio = po.anio
            INNER JOIN pedidos_bebidas pb 
                ON pp.id_usuario = pb.id_usuario 
                AND pp.dia = pb.dia 
                AND pp.mes = pb.mes 
                AND pp.anio = pb.anio
            WHERE pp.id_usuario = ?";
        //echo $sql;
    
        try {
            // Preparamos la consulta usando MySQLi
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }
            // Enlazamos el parámetro
            $stmt->bind_param('s', $id_user);
            // Ejecutamos la consulta
            $stmt->execute();
    
            // Obtenemos el resultado
            $result = $stmt->get_result();
    
            $modulos = [];
    
            // Iteramos sobre el resultado
            while ($row = $result->fetch_assoc()) {
                $modulos[] = [
                    'anio' => $row['anio_plato'],
                    'mes' => $row['mes_plato'],
                    'dia' => $row['dia_plato'],
                    'plato' => $row['plato'],
                    'postre' => $row['postre'],
                    'bebida' => $row['bebida'],
                    'bebida_pagado' => $row['bebida_pagado'],
                    'plato_pagado' => $row['plato_pagado'],
                    'postre_pagado' => $row['postre_pagado'],
                ];
            }
    
            // Cerramos el statement
            $stmt->close();
    
            return $modulos;  // Devuelve el array con todos los datos
    
        } catch (Exception $e) {
            error_log('Error en traerMesConMasInfo: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }

    }

    function traerPedidosTodosUsuarios() {
    $this->connect();
    $this->connection->query("SET SQL_BIG_SELECTS=1");

    $sql = "SELECT 
        id_usuario,
        anio,
        mes,
        dia,
        MAX(plato) AS plato,
        MAX(plato_pagado) AS plato_pagado,
        MAX(postre) AS postre,
        MAX(postre_pagado) AS postre_pagado,
        MAX(bebida) AS bebida,
        MAX(bebida_pagado) AS bebida_pagado,
        MAX(nombre) AS nombre,
        MAX(apellido) AS apellido,
        MAX(id_empresa) AS id_empresa,
        MAX(nombre_empresa) AS nombre_empresa,
        MAX(celular) AS celular,
        MAX(email) AS email
    FROM (
        SELECT 
            pp.id_usuario,
            pp.anio,
            pp.mes,
            pp.dia,
            pp.plato,
            pp.pagado AS plato_pagado,
            NULL AS postre,
            NULL AS postre_pagado,
            NULL AS bebida,
            NULL AS bebida_pagado,
            e.nombre,
            e.apellido,
            e.empresa AS id_empresa,
            e.celular,
            e.email,
            emp.nombre AS nombre_empresa
        FROM pedidos pp
        INNER JOIN empleados e ON pp.id_usuario = e.id
        INNER JOIN empresa emp ON e.empresa = emp.id

        UNION ALL

        SELECT 
            po.id_usuario,
            po.anio,
            po.mes,
            po.dia,
            NULL,
            NULL,
            po.plato AS postre,
            po.pagado AS postre_pagado,
            NULL,
            NULL,
            e.nombre,
            e.apellido,
            e.empresa AS id_empresa,
            e.celular,
            e.email,
            emp.nombre AS nombre_empresa
        FROM pedidos_postres po
        INNER JOIN empleados e ON po.id_usuario = e.id
        INNER JOIN empresa emp ON e.empresa = emp.id

        UNION ALL

        SELECT 
            pb.id_usuario,
            pb.anio,
            pb.mes,
            pb.dia,
            NULL,
            NULL,
            NULL,
            NULL,
            pb.bebida,
            pb.pagado AS bebida_pagado,
            e.nombre,
            e.apellido,
            e.empresa AS id_empresa,
            e.celular,
            e.email,
            emp.nombre AS nombre_empresa
        FROM pedidos_bebidas pb
        INNER JOIN empleados e ON pb.id_usuario = e.id
        INNER JOIN empresa emp ON e.empresa = emp.id
    ) AS combinado
    GROUP BY id_usuario, anio, mes, dia
    ORDER BY anio DESC, mes DESC, dia DESC";

    $result = $this->connection->query($sql);

    $pedidos = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $pedidos[] = [
                'id_usuario' => $row['id_usuario'],
                'anio' => $row['anio'],
                'mes' => $row['mes'],
                'dia' => $row['dia'],
                'plato' => $row['plato'],
                'postre' => $row['postre'],
                'bebida' => $row['bebida'],
                'plato_pagado' => $row['plato_pagado'],
                'postre_pagado' => $row['postre_pagado'],
                'bebida_pagado' => $row['bebida_pagado'],
                'nombre' => $row['nombre'],
                'apellido' => $row['apellido'],
                'id_empresa' => $row['id_empresa'],
                'nombre_empresa' => $row['nombre_empresa'],
                'celular' => $row['celular'],
                'email' => $row['email']
            ];
        }
    }

    $this->connection->close();
    return $pedidos;
}





    function traerPedidosUsuarioPorFecha($id_user, $dia, $mes, $anio) {
        $this->connect();

        $sql = "
            SELECT 
                pp.id_usuario AS usuario_plato, 
                pp.mes AS mes_plato, 
                pp.dia AS dia_plato, 
                pp.anio AS anio_plato, 
                pp.plato AS plato,
                pp.pagado AS plato_pagado,
                
                po.plato AS postre, 
                po.pagado AS postre_pagado,
                
                pb.bebida AS bebida,
                pb.pagado AS bebida_pagado
            FROM pedidos pp
            INNER JOIN pedidos_postres po 
                ON pp.id_usuario = po.id_usuario 
                AND pp.dia = po.dia 
                AND pp.mes = po.mes 
                AND pp.anio = po.anio
            INNER JOIN pedidos_bebidas pb 
                ON pp.id_usuario = pb.id_usuario 
                AND pp.dia = pb.dia 
                AND pp.mes = pb.mes 
                AND pp.anio = pb.anio
            WHERE pp.id_usuario = ? AND pp.dia = ? AND pp.mes = ? AND pp.anio = ?
        ";

        try {
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }

            $stmt->bind_param('ssss', $id_user, $dia, $mes, $anio);
            $stmt->execute();
            $result = $stmt->get_result();

            $pedidos = [];

            while ($row = $result->fetch_assoc()) {
                $pedidos[] = [
                    'anio' => $row['anio_plato'],
                    'mes' => $row['mes_plato'],
                    'dia' => $row['dia_plato'],
                    'plato' => $row['plato'],
                    'postre' => $row['postre'],
                    'bebida' => $row['bebida'],
                    'plato_pagado' => $row['plato_pagado'],
                    'postre_pagado' => $row['postre_pagado'],
                    'bebida_pagado' => $row['bebida_pagado'],
                ];
            }

            $stmt->close();
            return $pedidos;

        } catch (Exception $e) {
            error_log('Error en traerPedidosUsuarioPorFecha: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }
    }

    function traerLosTresPedidosUsuario($id_user) {
        $this->connect();
        
        error_log("Iniciando traerLosTresPedidosUsuario para id_user: $id_user");
    
        // Función para obtener un precio dado un ID y una consulta SQL, utilizando cache para evitar consultas repetidas.
        $obtenerPrecio = function ($sql, $id, &$cache) {
            if (!$id) {
                error_log("obtenerPrecio: ID es nulo, retornando null.");
                return null; // Si el ID es null, retorna null.
            }
            if (isset($cache[$id])) {
                error_log("obtenerPrecio: Precio obtenido desde cache para ID $id.");
                return $cache[$id]; // Retorna el precio ya consultado.
            }
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                error_log("obtenerPrecio: Error en prepare: " . $this->connection->error);
                throw new Exception($this->connection->error);
            }
            $stmt->bind_param('s', $id);
            if (!$stmt->execute()) {
                error_log("obtenerPrecio: Error en execute: " . $stmt->error);
                throw new Exception($stmt->error);
            }
            $result = $stmt->get_result();
            if (!$result) {
                error_log("obtenerPrecio: Error en get_result: " . $stmt->error);
            }
            $row = $result->fetch_assoc();
            $stmt->close();
            $cache[$id] = $row ? $row['precio'] : null;
            error_log("obtenerPrecio: Precio para ID $id es " . print_r($cache[$id], true));
            return $cache[$id];
        };
    
        try {
            // Consultas individuales para cada tabla de pedidos.
            $sqlPlatos = "SELECT id_usuario, id_empresa, id_plato, anio, mes, dia, plato, pagado, id AS id_pedido_plato FROM pedidos WHERE id_usuario = ?";
            $sqlPostres = "SELECT id_usuario, id_empresa, id_plato AS id_postre, anio, mes, dia, plato AS postre, pagado AS postre_pagado, id AS id_pedido_postre  FROM pedidos_postres WHERE id_usuario = ?";
            $sqlBebidas = "SELECT id_usuario, id_empresa, id_bebida, anio, mes, dia, bebida, pagado AS bebida_pagado, id AS id_pedido_bebida FROM pedidos_bebidas WHERE id_usuario = ?";
    
            // Función auxiliar para ejecutar consultas y obtener un array de resultados.
            $ejecutarConsulta = function ($sql) use ($id_user) {
                $stmt = $this->connection->prepare($sql);
                if (!$stmt) {
                    error_log("ejecutarConsulta: Error en prepare: " . $this->connection->error);
                    throw new Exception($this->connection->error);
                }
                $stmt->bind_param('s', $id_user);
                if (!$stmt->execute()) {
                    error_log("ejecutarConsulta: Error en execute: " . $stmt->error);
                    throw new Exception($stmt->error);
                }
                $result = $stmt->get_result();
                if (!$result) {
                    error_log("ejecutarConsulta: Error en get_result: " . $stmt->error);
                }
                $data = [];
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
                $stmt->close();
                error_log("ejecutarConsulta: Datos obtenidos: " . print_r($data, true));
                return $data;
            };
    
            // Ejecutar las consultas para pedidos, postres y bebidas.
            $platos = $ejecutarConsulta($sqlPlatos);
            $postres = $ejecutarConsulta($sqlPostres);
            $bebidas = $ejecutarConsulta($sqlBebidas);
    
            // Unir los resultados en un solo array asociativo, agrupándolos por fecha (anio, mes, dia).
            $modulos = [];
    
            foreach ($platos as $plato) {
                $key = "{$plato['anio']}-{$plato['mes']}-{$plato['dia']}";
                $modulos[$key] = [
                    'anio'            => $plato['anio'],
                    'mes'             => $plato['mes'],
                    'dia'             => $plato['dia'],
                    'plato'           => $plato['plato'],
                    'id_plato'        => $plato['id_plato'],
                    'id_pedido_plato' => $plato['id_pedido_plato'],
                    'plato_pagado'    => $plato['pagado'],
                    'postre'          => null,
                    'id_postre'       => null,
                    'id_pedido_postre'=> null,
                    'postre_pagado'   => null,
                    'bebida'          => null,
                    'bebida_pagado'   => null,
                    'id_bebida'       => null,
                    'id_pedido_bebida'=> null,
                    'id_empresa'      => $plato['id_empresa'],
                ];
            }
    
            foreach ($postres as $postre) {
                $key = "{$postre['anio']}-{$postre['mes']}-{$postre['dia']}";
                if (!isset($modulos[$key])) {
                    $modulos[$key] = [
                        'anio'            => $postre['anio'],
                        'mes'             => $postre['mes'],
                        'dia'             => $postre['dia'],
                        'plato'           => null,
                        'id_plato'        => null,
                        'id_pedido_plato' => null,
                        'plato_pagado'    => null,
                        'postre'          => $postre['postre'],
                        'id_postre'       => $postre['id_postre'],
                        'id_pedido_postre'=> $postre['id_pedido_postre'],
                        'postre_pagado'   => $postre['postre_pagado'],
                        'bebida'          => null,
                        'bebida_pagado'   => null,
                        'id_bebida'       => null,
                        'id_pedido_bebida'=> null,
                        'id_empresa'      => $postre['id_empresa'],
                    ];
                } else {
                    $modulos[$key]['postre']        = $postre['postre'];
                    $modulos[$key]['postre_pagado']   = $postre['postre_pagado'];
                    $modulos[$key]['id_postre']       = $postre['id_postre'];
                    $modulos[$key]['id_pedido_postre']       = $postre['id_pedido_postre'];
                }
            }
    
            foreach ($bebidas as $bebida) {
                $key = "{$bebida['anio']}-{$bebida['mes']}-{$bebida['dia']}";
                if (!isset($modulos[$key])) {
                    $modulos[$key] = [
                        'anio'            => $bebida['anio'],
                        'mes'             => $bebida['mes'],
                        'dia'             => $bebida['dia'],
                        'plato'           => null,
                        'id_plato'        => null,
                        'id_pedido_plato' => null,
                        'plato_pagado'    => null,
                        'postre'          => null,
                        'id_postre'       => null,
                        'id_pedido_postre'=> null,
                        'postre_pagado'   => null,
                        'bebida'          => $bebida['bebida'],
                        'id_bebida'       => $bebida['id_bebida'],
                        'bebida_pagado'   => $bebida['bebida_pagado'],
                        'id_pedido_bebida'=> $bebida['id_pedido_bebida'],
                        'id_empresa'      => $bebida['id_empresa'],
                    ];
                } else {
                    $modulos[$key]['bebida']        = $bebida['bebida'];
                    $modulos[$key]['bebida_pagado']   = $bebida['bebida_pagado'];
                    $modulos[$key]['id_bebida']       = $bebida['id_bebida'];
                    $modulos[$key]['id_pedido_bebida']= $bebida['id_pedido_bebida'];
                }
            }
    
            // Consultas para obtener precios de platos (para plato y postre) y bebidas.
            $sqlPlatosPrecios  = "SELECT precio FROM platos WHERE id = ?";
            $sqlBebidasPrecios = "SELECT precio FROM bebida_empresa WHERE id = ?";
    
            // Arrays para cache de precios.
            $cachePlatos  = [];
            $cacheBebidas = [];
    
            // Recorrer cada módulo y asignar los precios correspondientes usando la función de cache.
            foreach ($modulos as &$modulo) {
                $modulo['precio_plato']  = $obtenerPrecio($sqlPlatosPrecios, $modulo['id_plato'], $cachePlatos);
                $modulo['precio_postre'] = $obtenerPrecio($sqlPlatosPrecios, $modulo['id_postre'], $cachePlatos);
                $modulo['precio_bebida'] = $obtenerPrecio($sqlBebidasPrecios, $modulo['id_bebida'], $cacheBebidas);
                
                // Calcular el total sumando los precios, tratando nulos como 0.
                $precio_plato  = $modulo['precio_plato']  ? $modulo['precio_plato']  : 0;
                $precio_postre = $modulo['precio_postre'] ? $modulo['precio_postre'] : 0;
                $precio_bebida = $modulo['precio_bebida'] ? $modulo['precio_bebida'] : 0;
                $modulo['total'] = $precio_plato + $precio_postre + $precio_bebida;
            }
    
            error_log("Modulos final: " . print_r($modulos, true));
    
            // Convertir el array asociativo a un array indexado.
            $resultado = array_values($modulos);
            return $resultado;
    
        } catch (Exception $e) {
            error_log("Error en traerPedidosUsuario: " . $e->getMessage());
            return null;
        } finally {
            $this->connection->close();
            error_log("Conexión cerrada.");
        }
    }
    
    function traerLosTresPedidosUsuarioPorFecha($id_user, $dia, $mes, $anio) {
    $this->connect();
    
    error_log("Iniciando traerLosTresPedidosUsuarioPorFecha para id_user: $id_user - $dia/$mes/$anio");

    $obtenerPrecio = function ($sql, $id, &$cache) {
        if (!$id) return null;
        if (isset($cache[$id])) return $cache[$id];
        $stmt = $this->connection->prepare($sql);
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        $cache[$id] = $row ? $row['precio'] : null;
        return $cache[$id];
    };

    try {
        // Queries filtradas por fecha
        $sqlPlatos = "SELECT id_usuario, id_empresa, id_plato, anio, mes, dia, plato, pagado, id AS id_pedido_plato 
                      FROM pedidos 
                      WHERE id_usuario = ? AND dia = ? AND mes = ? AND anio = ?";
        $sqlPostres = "SELECT id_usuario, id_empresa, id_plato AS id_postre, anio, mes, dia, plato AS postre, pagado AS postre_pagado, id AS id_pedido_postre  
                       FROM pedidos_postres 
                       WHERE id_usuario = ? AND dia = ? AND mes = ? AND anio = ?";
        $sqlBebidas = "SELECT id_usuario, id_empresa, id_bebida, anio, mes, dia, bebida, pagado AS bebida_pagado, id AS id_pedido_bebida 
                       FROM pedidos_bebidas 
                       WHERE id_usuario = ? AND dia = ? AND mes = ? AND anio = ?";

        $ejecutarConsulta = function ($sql) use ($id_user, $dia, $mes, $anio) {
            $stmt = $this->connection->prepare($sql);
            $stmt->bind_param('ssss', $id_user, $dia, $mes, $anio);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $stmt->close();
            return $data;
        };

        $platos  = $ejecutarConsulta($sqlPlatos);
        $postres = $ejecutarConsulta($sqlPostres);
        $bebidas = $ejecutarConsulta($sqlBebidas);

        $modulos = [];

        foreach ($platos as $plato) {
            $key = "{$plato['anio']}-{$plato['mes']}-{$plato['dia']}";
            $modulos[$key] = [
                'anio'            => $plato['anio'],
                'mes'             => $plato['mes'],
                'dia'             => $plato['dia'],
                'plato'           => $plato['plato'],
                'id_plato'        => $plato['id_plato'],
                'id_pedido_plato' => $plato['id_pedido_plato'],
                'plato_pagado'    => $plato['pagado'],
                'postre'          => null,
                'id_postre'       => null,
                'id_pedido_postre'=> null,
                'postre_pagado'   => null,
                'bebida'          => null,
                'bebida_pagado'   => null,
                'id_bebida'       => null,
                'id_pedido_bebida'=> null,
                'id_empresa'      => $plato['id_empresa'],
            ];
        }

        foreach ($postres as $postre) {
            $key = "{$postre['anio']}-{$postre['mes']}-{$postre['dia']}";
            if (!isset($modulos[$key])) {
                $modulos[$key] = [
                    'anio' => $postre['anio'], 'mes' => $postre['mes'], 'dia' => $postre['dia'],
                    'plato' => null, 'id_plato' => null, 'id_pedido_plato' => null, 'plato_pagado' => null,
                    'postre' => $postre['postre'], 'id_postre' => $postre['id_postre'],
                    'id_pedido_postre' => $postre['id_pedido_postre'], 'postre_pagado' => $postre['postre_pagado'],
                    'bebida' => null, 'bebida_pagado' => null, 'id_bebida' => null, 'id_pedido_bebida' => null,
                    'id_empresa' => $postre['id_empresa'],
                ];
            } else {
                $modulos[$key]['postre'] = $postre['postre'];
                $modulos[$key]['id_postre'] = $postre['id_postre'];
                $modulos[$key]['id_pedido_postre'] = $postre['id_pedido_postre'];
                $modulos[$key]['postre_pagado'] = $postre['postre_pagado'];
            }
        }

        foreach ($bebidas as $bebida) {
            $key = "{$bebida['anio']}-{$bebida['mes']}-{$bebida['dia']}";
            if (!isset($modulos[$key])) {
                $modulos[$key] = [
                    'anio' => $bebida['anio'], 'mes' => $bebida['mes'], 'dia' => $bebida['dia'],
                    'plato' => null, 'id_plato' => null, 'id_pedido_plato' => null, 'plato_pagado' => null,
                    'postre' => null, 'id_postre' => null, 'id_pedido_postre' => null, 'postre_pagado' => null,
                    'bebida' => $bebida['bebida'], 'id_bebida' => $bebida['id_bebida'],
                    'id_pedido_bebida' => $bebida['id_pedido_bebida'], 'bebida_pagado' => $bebida['bebida_pagado'],
                    'id_empresa' => $bebida['id_empresa'],
                ];
            } else {
                $modulos[$key]['bebida'] = $bebida['bebida'];
                $modulos[$key]['id_bebida'] = $bebida['id_bebida'];
                $modulos[$key]['id_pedido_bebida'] = $bebida['id_pedido_bebida'];
                $modulos[$key]['bebida_pagado'] = $bebida['bebida_pagado'];
            }
        }

        $sqlPlatosPrecios  = "SELECT precio FROM platos WHERE id = ?";
        $sqlBebidasPrecios = "SELECT precio FROM bebida_empresa WHERE id = ?";
        $cachePlatos = [];
        $cacheBebidas = [];

        foreach ($modulos as &$modulo) {
            $modulo['precio_plato']  = $obtenerPrecio($sqlPlatosPrecios, $modulo['id_plato'], $cachePlatos);
            $modulo['precio_postre'] = $obtenerPrecio($sqlPlatosPrecios, $modulo['id_postre'], $cachePlatos);
            $modulo['precio_bebida'] = $obtenerPrecio($sqlBebidasPrecios, $modulo['id_bebida'], $cacheBebidas);

            $modulo['total'] = ($modulo['precio_plato'] ?? 0) + ($modulo['precio_postre'] ?? 0) + ($modulo['precio_bebida'] ?? 0);
        }

        return array_values($modulos);

    } catch (Exception $e) {
        error_log("Error en traerLosTresPedidosUsuarioPorFecha: " . $e->getMessage());
        return null;
    } finally {
        $this->connection->close();
        error_log("Conexión cerrada.");
    }
}

    
    


    function traerPagosUsuario($id_user){
        $this->connect();
        $sql = 
            "SELECT 
                pp.id_usuario AS usuario_plato, 
                pp.mes AS mes_plato, 
                pp.dia AS dia_plato, 
                pp.anio AS anio_plato, 
                pp.plato AS plato,
                
                po.id_usuario AS usuario_postre, 
                po.mes AS mes_postre, 
                po.dia AS dia_postre, 
                po.anio AS anio_postre, 
                po.plato AS postre, 
                
                pb.id_usuario AS usuario_bebida, 
                pb.mes AS mes_bebida, 
                pb.dia AS dia_bebida, 
                pb.anio AS anio_bebida,
                pb.bebida 
            FROM pedidos pp
            INNER JOIN pedidos_postres po 
                ON pp.id_usuario = po.id_usuario 
                AND pp.dia = po.dia 
                AND pp.mes = po.mes 
                AND pp.anio = po.anio
            INNER JOIN pedidos_bebidas pb 
                ON pp.id_usuario = pb.id_usuario 
                AND pp.dia = pb.dia 
                AND pp.mes = pb.mes 
                AND pp.anio = pb.anio
            WHERE pp.id_usuario = ?";
        //echo $sql;
    
        try {
            // Preparamos la consulta usando MySQLi
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }
            // Enlazamos el parámetro
            $stmt->bind_param('s', $id_user);
            // Ejecutamos la consulta
            $stmt->execute();
    
            // Obtenemos el resultado
            $result = $stmt->get_result();
    
            $modulos = [];
    
            // Iteramos sobre el resultado
            while ($row = $result->fetch_assoc()) {
                $modulos[] = [
                    'anio' => $row['anio_plato'],
                    'mes' => $row['mes_plato'],
                    'dia' => $row['dia_plato'],
                    'plato' => $row['plato'],
                    'postre' => $row['postre'],
                    'bebida' => $row['bebida'],
                ];
            }
    
            // Cerramos el statement
            $stmt->close();
    
            return $modulos;  // Devuelve el array con todos los datos
    
        } catch (Exception $e) {
            error_log('Error en traerMesConMasInfo: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }

    }



    function traerPlatosDeUnModuloFijo($modulo){
        $this->connect();
        $sql ="SELECT 
            m.nombre AS modulo_nombre,
            m.platos AS platos_en_modulo
            FROM 
                modulos_fijos m
            WHERE 
            m.nombre = ?"; 
            //echo $sql;
        try {
            // Preparamos la consulta usando MySQLi
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }
            
            // Enlazamos el parámetro
            $stmt->bind_param('s', $modulo);
            
            // Ejecutamos la consulta
            $stmt->execute();
            
            // Obtenemos el resultado
            $result = $stmt->get_result();
            
            $modulos = [];
            
            // Iteramos sobre el resultado
            while ($row = $result->fetch_assoc()) {
                $modulos = [
                    'platos_en_modulo' => $row['platos_en_modulo'],
                ];
            }
            
            // Cerramos el statement
            $stmt->close();
            
            return $modulos;  // Devuelve el array con todos los datos
            
        } catch (Exception $e) {
            error_log('Error en traerModulos: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }        
    }
    
    function verificarAsignacion($nombre_empresa, $tabla) {
        //echo "Nombre de la empresa recibido: [" . $nombre_empresa . "]<br>";
        $this->connect();
    
        try {
            $sql = "SELECT COUNT(*) as count FROM $tabla WHERE empresa = ?";
            $stmt = $this->connection->prepare($sql);
            
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }
    
            $stmt->bind_param("s", $nombre_empresa);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_assoc();
    
            $stmt->close();
    
            return ($data['count'] > 0) ? true : false; // Devuelve true si hay registros, false si no
    
        } catch (Exception $e) {
            error_log("Error en verificarAsignacion en tabla $tabla: " . $e->getMessage());
            return false;
        } finally {
            $this->connection = null;
        }
    }

    function traerPedidosEmpresa($id_empresa) {
    $this->connect();
    $this->connection->query("SET SQL_BIG_SELECTS=1");

    $id_empresa = intval($id_empresa); // Siempre limpiar el parámetro para evitar inyección

    $sql = "SELECT 
        id_usuario,
        anio,
        mes,
        dia,
        MAX(plato) AS plato,
        MAX(plato_pagado) AS plato_pagado,
        MAX(postre) AS postre,
        MAX(postre_pagado) AS postre_pagado,
        MAX(bebida) AS bebida,
        MAX(bebida_pagado) AS bebida_pagado,
        MAX(nombre) AS nombre,
        MAX(apellido) AS apellido,
        MAX(id_empresa) AS id_empresa,
        MAX(nombre_empresa) AS nombre_empresa,
        MAX(celular) AS celular,
        MAX(email) AS email
    FROM (
        SELECT 
            pp.id_usuario,
            pp.anio,
            pp.mes,
            pp.dia,
            pp.plato,
            pp.pagado AS plato_pagado,
            NULL AS postre,
            NULL AS postre_pagado,
            NULL AS bebida,
            NULL AS bebida_pagado,
            e.nombre,
            e.apellido,
            e.empresa AS id_empresa,
            e.celular,
            e.email,
            emp.nombre AS nombre_empresa
        FROM pedidos pp
        INNER JOIN empleados e ON pp.id_usuario = e.id
        INNER JOIN empresa emp ON e.empresa = emp.id
        WHERE e.empresa = $id_empresa

        UNION ALL

        SELECT 
            po.id_usuario,
            po.anio,
            po.mes,
            po.dia,
            NULL,
            NULL,
            po.plato AS postre,
            po.pagado AS postre_pagado,
            NULL,
            NULL,
            e.nombre,
            e.apellido,
            e.empresa AS id_empresa,
            e.celular,
            e.email,
            emp.nombre AS nombre_empresa
        FROM pedidos_postres po
        INNER JOIN empleados e ON po.id_usuario = e.id
        INNER JOIN empresa emp ON e.empresa = emp.id
        WHERE e.empresa = $id_empresa

        UNION ALL

        SELECT 
            pb.id_usuario,
            pb.anio,
            pb.mes,
            pb.dia,
            NULL,
            NULL,
            NULL,
            NULL,
            pb.bebida,
            pb.pagado AS bebida_pagado,
            e.nombre,
            e.apellido,
            e.empresa AS id_empresa,
            e.celular,
            e.email,
            emp.nombre AS nombre_empresa
        FROM pedidos_bebidas pb
        INNER JOIN empleados e ON pb.id_usuario = e.id
        INNER JOIN empresa emp ON e.empresa = emp.id
        WHERE e.empresa = $id_empresa
    ) AS combinado
    GROUP BY id_usuario, anio, mes, dia
    ORDER BY anio DESC, mes DESC, dia DESC";

    $result = $this->connection->query($sql);

    $pedidos = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $pedidos[] = [
                'id_usuario' => $row['id_usuario'],
                'anio' => $row['anio'],
                'mes' => $row['mes'],
                'dia' => $row['dia'],
                'plato' => $row['plato'],
                'postre' => $row['postre'],
                'bebida' => $row['bebida'],
                'plato_pagado' => $row['plato_pagado'],
                'postre_pagado' => $row['postre_pagado'],
                'bebida_pagado' => $row['bebida_pagado'],
                'nombre' => $row['nombre'],
                'apellido' => $row['apellido'],
                'id_empresa' => $row['id_empresa'],
                'nombre_empresa' => $row['nombre_empresa'],
                'celular' => $row['celular'],
                'email' => $row['email']
            ];
        }
    }

    $this->connection->close();
    return $pedidos;
}

}








