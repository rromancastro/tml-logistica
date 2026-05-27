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
    
    
    function getMal(){
        return $this->mal;
    }
    
    function connect(){
        $actual_link = $_SERVER['HTTP_HOST'];
        if($actual_link=='localhost'){
            // CASA  
            $this->servername = "localhost";
            $this->username = "c1611406_ada";
            $this->password = "92ZIkubelo";
            $this->dbname = "c1611406_ada";
        }else{
        //ONLINE  
        
           $this->servername = "localhost";
            $this->username = "c1411263_nueva";
            $this->password = "peVElera51";
            $this->dbname = "c1411263_nueva";
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
        
     
    public function editBlog($tabla, $item, $dato, $where, $id) {
    $this->connect();

    // Armamos SQL con placeholders
    $sql = "UPDATE `$tabla` SET `$item` = ? WHERE `$where` = ?";

    $stmt = $this->connection->prepare($sql);
    if (!$stmt) {
        $this->mal++;
        $this->connection->close();
        return;
    }

    // Bind de parámetros (ambos strings: "ss")
    $stmt->bind_param("ss", $dato, $id);

    if (!$stmt->execute()) {
        $this->mal++;
    }

    $stmt->close();
    $this->connection->close();
}
    

        
    public function insert_array($tabla,$array,$display_error){
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
                $last_id = $this->connection->insert_id;
                $error_message = '0';
                $error_array = array('error' => $error_message,'last_id' => $last_id);
                $error_json = json_encode($error_array);
                if($display_error == 'si'){
                    echo $error_json;
                }
                $this->connection->close();  
            } else {
                $error_message = $sql . "<br>" . $this->connection->error;
                $error_array = array('error' => $error_message);
                $error_json = json_encode($error_array);
                if($display_error == 'si'){
                    echo $error_json;
                }
                $this->connection->close();  
            }
    }

    public function insert_array_blog($tabla, $array, $display_error) {
        $this->connect();
        $columnas = "";
        $valores = "";
        $ultimaClave = $this->endKey($array);

        foreach ($array as $clave => $valor) {
            $columnas .= ($clave === $ultimaClave) ? "$clave" : "$clave,";
            if (is_array($valor) || is_object($valor)) {
                $valor = json_encode($valor, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
            $valor = $this->connection->real_escape_string($valor);
            $valores .= ($clave === $ultimaClave) ? "'$valor'" : "'$valor',";
        }

            $sql = "INSERT INTO $tabla (id,$columnas) VALUES (NULL,$valores)";
            $result = $this->connection->query($sql);

        if ($result === TRUE) {
            $last_id = $this->connection->insert_id;
            $respuesta = ['error' => '0', 'last_id' => $last_id];
        } else {
            $respuesta = ['error' => $sql . "<br>" . $this->connection->error];
        }

        if ($display_error === 'si') {
            echo json_encode($respuesta);
        }

        $this->connection->close();
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
        //echo $query;  // Verificar la consulta
        
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
    
    
    function traerItinerarioCompleto($id_itinerario) {
        $this->connect();

        $isAll = $id_itinerario == 0;

        $sql = "
            SELECT 
                i.id AS itinerario_id,
                i.titulo,
                i.subtitulo,
                i.img,
                i.review,
                i.region,
                i.sub_region,
                c.nombre AS nombre_carousel,
                c.imagenes,
                
                t.id AS tip_id,
                t.tip,
                
                d.id AS dia_id,
                d.destino,
                d.horas,
                d.velocidad,
                d.img AS img_dia,
                d.num_dia,
                d.texto AS texto_dia,
                d.nombre AS nombre_dia

            FROM itinerarios i
            LEFT JOIN tips t ON i.id = t.id_itinerario
            LEFT JOIN dias d ON i.id = d.id_itinerario
            LEFT JOIN carousel c ON i.carousel_id = c.id
        ";

        if (!$isAll) {
            $sql .= " WHERE i.id = ?";
        }

        $sql .= " ORDER BY i.id ASC, d.num_dia ASC";

        try {
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }

            if (!$isAll) {
                $stmt->bind_param('i', $id_itinerario);
            }

            $stmt->execute();
            $result = $stmt->get_result();

            $itinerarios = [];
            $diasAgrupados = [];
            $tipsAgrupados = [];

            while ($row = $result->fetch_assoc()) {
                $itId = $row['itinerario_id'];

                if (!isset($itinerarios[$itId])) {
                    $itinerarios[$itId] = [
                        'id' => $itId,
                        'titulo' => $row['titulo'],
                        'subtitulo' => $row['subtitulo'],
                        'img' => $row['img'],
                        'review' => $row['review'],
                        'region' => $row['region'],
                        'sub_region' => $row['sub_region'],
                        'carousel' => [
                            'nombre' => $row['nombre_carousel'],
                            'imagenes' => $row['imagenes'],
                        ],
                        'dias' => [],
                        'tips' => [],
                    ];
                    $diasAgrupados[$itId] = [];
                    $tipsAgrupados[$itId] = [];
                }

                if ($row['dia_id']) {
                    $diasAgrupados[$itId][$row['dia_id']] = [
                        'id' => $row['dia_id'],
                        'destino' => $row['destino'],
                        'horas' => $row['horas'],
                        'velocidad' => $row['velocidad'],
                        'num_dia' => $row['num_dia'],
                        'texto' => $row['texto_dia'],
                        'nombre' => $row['nombre_dia'],
                        'img_dia' => $row['img_dia'],
                    ];
                }

                if ($row['tip_id']) {
                    $tipsAgrupados[$itId][$row['tip_id']] = [
                        'id' => $row['tip_id'],
                        'tip' => $row['tip'],
                    ];
                }
            }

            // Asignar días y tips a cada itinerario
            foreach ($itinerarios as $id => &$it) {
                $it['dias'] = array_values($diasAgrupados[$id]);
                $it['tips'] = array_values($tipsAgrupados[$id]);
            }

            $stmt->close();
            return $isAll ? array_values($itinerarios) : array_values($itinerarios)[0];

        } catch (Exception $e) {
            error_log('Error en traerItinerarioCompleto: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }
    }


    function traerItinerariosPorTitulo($titulo) {
        $this->connect();

        $sql = "
            SELECT 
                i.id AS itinerario_id,
                i.titulo,
                i.subtitulo,
                i.img,
                i.review,
                i.region,
                i.sub_region,
                c.nombre AS nombre_carousel,
                c.imagenes,
                
                t.id AS tip_id,
                t.tip,
                
                d.id AS dia_id,
                d.destino,
                d.horas,
                d.velocidad,
                d.img AS img_dia,
                d.num_dia,
                d.texto AS texto_dia,
                d.nombre AS nombre_dia

            FROM itinerarios i
            LEFT JOIN tips t ON i.id = t.id_itinerario
            LEFT JOIN dias d ON i.id = d.id_itinerario
            LEFT JOIN carousel c ON i.carousel_id = c.id
            WHERE i.titulo = ?
            ORDER BY i.id ASC, d.num_dia ASC
        ";

        try {
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }

            $stmt->bind_param('s', $titulo);
            $stmt->execute();
            $result = $stmt->get_result();

            $itinerarios = [];

            while ($row = $result->fetch_assoc()) {
                $id = $row['itinerario_id'];

                if (!isset($itinerarios[$id])) {
                    $itinerarios[$id] = [
                        'id' => $id,
                        'titulo' => $row['titulo'],
                        'subtitulo' => $row['subtitulo'],
                        'img' => $row['img'],
                        'review' => $row['review'],
                        'region' => $row['region'],
                        'sub_region' => $row['sub_region'],
                        'carousel' => [
                            'nombre' => $row['nombre_carousel'],
                            'imagenes' => $row['imagenes'],
                        ],
                        'dias' => [],
                        'tips' => [],
                    ];
                }

                if ($row['dia_id']) {
                    $itinerarios[$id]['dias'][$row['dia_id']] = [
                        'id' => $row['dia_id'],
                        'destino' => $row['destino'],
                        'horas' => $row['horas'],
                        'velocidad' => $row['velocidad'],
                        'num_dia' => $row['num_dia'],
                        'texto' => $row['texto_dia'],
                        'nombre' => $row['nombre_dia'],
                        'img_dia' => $row['img_dia'],
                    ];
                }

                if ($row['tip_id']) {
                    $itinerarios[$id]['tips'][$row['tip_id']] = [
                        'id' => $row['tip_id'],
                        'tip' => $row['tip'],
                    ];
                }
            }

            // Limpieza: convertir arrays indexados simples
            foreach ($itinerarios as &$itinerario) {
                $itinerario['dias'] = array_values($itinerario['dias']);
                $itinerario['tips'] = array_values($itinerario['tips']);
            }

            $stmt->close();
            return array_values($itinerarios);

        } catch (Exception $e) {
            error_log('Error en traerItinerariosPorTitulo: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }
    }

    function traerItinerariosPorRegion($region) {
    $this->connect();

    $filtrarPorRegion = $region != 0;

    $sql = "
        SELECT 
            i.id AS itinerario_id,
            i.titulo,
            i.subtitulo,
            i.img,
            i.review,
            i.region,
            r.nombre AS region_nombre,
            r.name AS region_name,
            i.sub_region,
            c.nombre AS nombre_carousel,
            c.imagenes,
            
            t.id AS tip_id,
            t.tip,
            
            d.id AS dia_id,
            d.destino,
            d.horas,
            d.velocidad,
            d.img AS img_dia,
            d.num_dia,
            d.texto AS texto_dia,
            d.nombre AS nombre_dia

        FROM itinerarios i
        LEFT JOIN regiones r ON i.region = r.id
        LEFT JOIN tips t ON i.id = t.id_itinerario
        LEFT JOIN dias d ON i.id = d.id_itinerario
        LEFT JOIN carousel c ON i.carousel_id = c.id
    ";

    if ($filtrarPorRegion) {
        $sql .= " WHERE i.region = ?";
    }

    $sql .= " ORDER BY i.id ASC, d.num_dia ASC";

    try {
        $stmt = $this->connection->prepare($sql);
        if (!$stmt) {
            throw new Exception($this->connection->error);
        }

        if ($filtrarPorRegion) {
            $stmt->bind_param('i', $region);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $itinerarios = [];

        while ($row = $result->fetch_assoc()) {
            $id = $row['itinerario_id'];

            if (!isset($itinerarios[$id])) {
                $itinerarios[$id] = [
                    'id' => $id,
                    'titulo' => $row['titulo'],
                    'subtitulo' => $row['subtitulo'],
                    'img' => $row['img'],
                    'review' => $row['review'],
                    'region' => $row['region'],
                    'region_nombre' => $row['region_nombre'],
                    'region_name' => $row['region_name'],
                    'sub_region' => $row['sub_region'],
                    'carousel' => [
                        'nombre' => $row['nombre_carousel'],
                        'imagenes' => $row['imagenes'],
                    ],
                    'dias' => [],
                    'tips' => [],
                ];
            }

            if ($row['dia_id']) {
                $itinerarios[$id]['dias'][$row['dia_id']] = [
                    'id' => $row['dia_id'],
                    'destino' => $row['destino'],
                    'horas' => $row['horas'],
                    'velocidad' => $row['velocidad'],
                    'num_dia' => $row['num_dia'],
                    'texto' => $row['texto_dia'],
                    'nombre' => $row['nombre_dia'],
                    'img_dia' => $row['img_dia'],
                ];
            }

            if ($row['tip_id']) {
                $itinerarios[$id]['tips'][$row['tip_id']] = [
                    'id' => $row['tip_id'],
                    'tip' => $row['tip'],
                ];
            }
        }

        foreach ($itinerarios as &$itinerario) {
            $itinerario['dias'] = array_values($itinerario['dias']);
            $itinerario['tips'] = array_values($itinerario['tips']);
        }

        $stmt->close();
        return array_values($itinerarios);

    } catch (Exception $e) {
        error_log('Error en traerItinerariosPorRegion: ' . $e->getMessage());
        return null;
    } finally {
        $this->connection = null;
    }
}

    
    function traerItinerariosPorSubRegion($sub_region) {
        $this->connect();

        $sql = "
            SELECT 
                i.id AS itinerario_id,
                i.titulo,
                i.subtitulo,
                i.img,
                i.review,
                i.region,
                i.sub_region,
                c.nombre AS nombre_carousel,
                c.imagenes,
                
                t.id AS tip_id,
                t.tip,
                
                d.id AS dia_id,
                d.destino,
                d.horas,
                d.velocidad,
                d.img AS img_dia,
                d.num_dia,
                d.texto AS texto_dia,
                d.nombre AS nombre_dia

            FROM itinerarios i
            LEFT JOIN tips t ON i.id = t.id_itinerario
            LEFT JOIN dias d ON i.id = d.id_itinerario
            LEFT JOIN carousel c ON i.carousel_id = c.id
            WHERE i.sub_region = ?
            ORDER BY i.id ASC, d.num_dia ASC
        ";

        try {
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->connection->error);
            }

            $stmt->bind_param('i', $sub_region);
            $stmt->execute();
            $result = $stmt->get_result();

            $itinerarios = [];

            while ($row = $result->fetch_assoc()) {
                $id = $row['itinerario_id'];

                if (!isset($itinerarios[$id])) {
                    $itinerarios[$id] = [
                        'id' => $id,
                        'titulo' => $row['titulo'],
                        'subtitulo' => $row['subtitulo'],
                        'img' => $row['img'],
                        'review' => $row['review'],
                        'region' => $row['region'],
                        'sub_region' => $row['sub_region'],
                        'carousel' => [
                            'nombre' => $row['nombre_carousel'],
                            'imagenes' => $row['imagenes'],
                        ],
                        'dias' => [],
                        'tips' => [],
                    ];
                }

                if ($row['dia_id']) {
                    $itinerarios[$id]['dias'][$row['dia_id']] = [
                        'id' => $row['dia_id'],
                        'destino' => $row['destino'],
                        'horas' => $row['horas'],
                        'velocidad' => $row['velocidad'],
                        'num_dia' => $row['num_dia'],
                        'texto' => $row['texto_dia'],
                        'nombre' => $row['nombre_dia'],
                        'img_dia' => $row['img_dia'],
                    ];
                }

                if ($row['tip_id']) {
                    $itinerarios[$id]['tips'][$row['tip_id']] = [
                        'id' => $row['tip_id'],
                        'tip' => $row['tip'],
                    ];
                }
            }

            foreach ($itinerarios as &$itinerario) {
                $itinerario['dias'] = array_values($itinerario['dias']);
                $itinerario['tips'] = array_values($itinerario['tips']);
            }

            $stmt->close();
            return array_values($itinerarios);

        } catch (Exception $e) {
            error_log('Error en traerItinerariosPorSubRegion: ' . $e->getMessage());
            return null;
        } finally {
            $this->connection = null;
        }
    }

    function getNosotrosConDestino($id = 0, $order = 'ASC', $by = 'nosotros.id') {
        $this->connect();

        $columnsNosotros = [
            "nosotros.id AS id_nosotros", "nombre", "rol", "nosotros.texto", "nosotros.img", "email",
            "celular", "linkedin", "logo1", "logo2", "logo3", "id_barco_favorito", "id_destino_favorito"
        ];

        $columnsDestinos = [
            "destinos_principales.destinos AS destino_favorito_nombre",
            "destinos_principales.region AS destino_region",
            "destinos_principales.img AS destino_img",
            "destinos_principales.texto AS destino_texto"
        ];

        $columns = array_merge($columnsNosotros, $columnsDestinos);

        // ⚠️ Hacemos comparación estricta
        if ((int)$id === 0) {
            $query = "
                SELECT " . implode(",", $columns) . "
                FROM nosotros
                LEFT JOIN destinos_principales 
                    ON nosotros.id_destino_favorito = destinos_principales.id
                ORDER BY $by $order
                LIMIT 9999
            ";
            $stmt = $this->connection->prepare($query);
        } else {
            $query = "
                SELECT " . implode(",", $columns) . "
                FROM nosotros
                INNER JOIN destinos_principales 
                    ON nosotros.id_destino_favorito = destinos_principales.id
                WHERE nosotros.id = ?
                ORDER BY nosotros.id DESC
                LIMIT 9999
            ";
            $stmt = $this->connection->prepare($query);
            $stmt->bind_param("i", $id);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        $this->connection->close();
        return $data;
    }

    function traerRegiones() {
        $this->connect();
    
        $sql = "SELECT 
            r.nombre AS nombre_region, 
            d.destinos AS destino_url,
            d.texto AS nombre, 
            d.cod AS codigo
            FROM regiones r
            JOIN destinos_principales d ON r.id = d.id_region
            WHERE d.mostrar = 'si'
            ORDER BY r.id, d.texto";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();

        $regiones = [];

            while ($row = $result->fetch_assoc()) {
                $regionNombre = $row['nombre_region'];

                if (!isset($regiones[$regionNombre])) {
                    $regiones[$regionNombre] = [
                        'nombre' => $regionNombre,
                        'destinos' => []
                    ];
                }

                $regiones[$regionNombre]['destinos'][] = [
                    'id' => $row['codigo'],       // ej: "src5"
                    'nombre' => $row['nombre'], // ej: "Bahamas"
                    'url' => $row['destino_url'] // ej: "Bahamas"
                ];
            }

        $this->connection->close();

        // Convertir a array numérico (para evitar keys con nombre de región)
        return array_values($regiones);
    }

    function traerBlogConAutor($url) {
    $this->connect();

    $sql = "
        SELECT 
            b.*,
            n.nombre AS autor_nombre,
            n.img AS autor_img
        FROM blog b
        LEFT JOIN nosotros n ON b.autor = n.id
        WHERE b.url = ?
        LIMIT 1
    ";

    try {
        $stmt = $this->connection->prepare($sql);
        if (!$stmt) {
            throw new Exception($this->connection->error);
        }

        $stmt->bind_param('i', $url);
        $stmt->execute();
        $result = $stmt->get_result();

        $blog = $result->fetch_assoc();
        $stmt->close();
        return $blog;

    } catch (Exception $e) {
        error_log('Error en traerBlogConAutorPorId: ' . $e->getMessage());
        return null;
    } finally {
        $this->connection = null;
    }
}

function traerBlogConAutorId($id) {
    $this->connect();

    $sql = "
        SELECT 
            b.*,
            n.nombre AS autor_nombre,
            n.img AS autor_img
        FROM blog b
        LEFT JOIN nosotros n ON b.autor = n.id
        WHERE b.id = ?
        LIMIT 1
    ";

    try {
        $stmt = $this->connection->prepare($sql);
        if (!$stmt) {
            throw new Exception($this->connection->error);
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $blog = $result->fetch_assoc();
        $stmt->close();
        return $blog;

    } catch (Exception $e) {
        error_log('Error en traerBlogConAutorPorId: ' . $e->getMessage());
        return null;
    } finally {
        $this->connection = null;
    }
}

    

    

    
    
}








