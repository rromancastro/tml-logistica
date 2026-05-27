<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);



function chequearStock($id,$indexColor){
    $actual_link = $_SERVER['HTTP_HOST'];

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    if($actual_link=='localhost'){
        $mysqli = new mysqli("localhost", "root", "manjarlo1", "anima");
    }else{
        $mysqli = new mysqli("localhost", "c1721667_ubuntu", "RO68kuzaka", "c1721667_ubuntu");
    }

    mysqli_set_charset($mysqli ,"utf8");
    
    $resultadoDelChequeo = false;

    $sql = "SELECT * FROM articulos WHERE id=? ORDER BY precio ASC";

    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->bind_param("i",$id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($myrow = $result->fetch_assoc()) {
            $elementos[] = array(
                "id"=>$myrow['id'],
                "nombre"=>$myrow['nombre'],
                "precio"=>$myrow['precio'],
                "descripcion"=>$myrow['descripcion'],
                "img"=>$myrow['img'],
                "medidas"=>$myrow['medidas'],
                "lavado"=>$myrow['lavado'],
                "caracteristicas"=>$myrow['caracteristicas'],
                "mostrar"=>$myrow['mostrar'],
                "orden"=>$myrow['orden'],
                "colores"=>$myrow['colores'],
                "stock"=>$myrow['stock']
            );
        }
    }
    

    if($result->num_rows===0){
        $mysqli->close();
       // echo "no se encontró stock";
        //return $resultadoDelChequeo;
        
    }else{
        if(strpos($elementos[0]['stock'], ",") !== false){
            $nuevoStock = explode(",",$elementos[0]['stock']);
            $nuevoStock[$indexColor];
            return $nuevoStock[$indexColor];
            
        } else{
            $nuevoStockString = $elementos[0]['stock'];
            if($nuevoStockString>0){
                return $nuevoStockString;
          
            }else{
                return $nuevoStockString;
            }
           
        }
    }
    $mysqli->close();
}

function descontarStock($id,$indexColor,$cuantoDescuento){
    $actual_link = $_SERVER['HTTP_HOST'];

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    if($actual_link=='localhost'){
        $mysqli = new mysqli("localhost", "root", "manjarlo1", "anima");
    }else{
        $mysqli = new mysqli("localhost", "c1721667_ubuntu", "RO68kuzaka", "c1721667_ubuntu");
    }

        mysqli_set_charset($mysqli ,"utf8");

        $sql = "SELECT * FROM articulos WHERE id=? ORDER BY precio ASC";

    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->bind_param("i",$id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($myrow = $result->fetch_assoc()) {
            $elementos[] = array(
                "id"=>$myrow['id'],
                "nombre"=>$myrow['nombre'],
                "precio"=>$myrow['precio'],
                "descripcion"=>$myrow['descripcion'],
                "img"=>$myrow['img'],
                "medidas"=>$myrow['medidas'],
                "lavado"=>$myrow['lavado'],
                "caracteristicas"=>$myrow['caracteristicas'],
                "mostrar"=>$myrow['mostrar'],
                "orden"=>$myrow['orden'],
                "colores"=>$myrow['colores'],
                "stock"=>$myrow['stock']
            );
        }
    }

    if($result->num_rows===0){
        echo "[]";
    }else{
        if(strpos($elementos[0]['stock'], ",") !== false){
            $nuevoStock = explode(",",$elementos[0]['stock']);
            $nuevoStock[$indexColor] = (int) $nuevoStock[$indexColor] - (int)$cuantoDescuento;
            $nuevoStockString = implode(",",$nuevoStock);
        // echo $nuevoStockString;
        } else{
            $nuevoStockString = (int) $elementos[0]['stock'] - (int) $cuantoDescuento;
            //echo $nuevoStockString;
        }
        $sqlUpdateStock ="UPDATE elementos SET stock = '$nuevoStockString' WHERE id=?";    
        if ($stmt = $mysqli->prepare($sqlUpdateStock)) {
            $stmt->bind_param("i",$id);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
        }
        $mysqli->close();
    }
}