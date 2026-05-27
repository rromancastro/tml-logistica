<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since");
header('Access-Control-Allow-Methods: GET, POST, PUT');

require_once "../chequearStockFunction.php";
require_once "../class_sql.php";

//$recien = getdate();
//$horario = $recien['hours'].":".$recien['minutes'].":".$recien['seconds'];

$user = $_POST['user'];
$datos = $_POST['datos'];
$precio_envio = $_POST['precio_envio'];

$recien = getdate();
$horario = $recien['hours'].":".$recien['minutes'].":".$recien['seconds'];

//echo $user;
//echo $datos;
/*
$user= '{"nombre":"Rafael","apellido":"Defelice","email":"defelicerafael@gmail.com","envio":"enviar","codigopostal":"8370","calle":"Quela","numero":"544","departamento":"0","provincia":"NEUQUEN","localidad":"BUENA ESPERANZA","partido":"LACAR","celular":1144370599,"dni":25433229,"precio_envio":0}';
$datos= '[{"id":1,"nombre":"repasadores x 2","color": "negro","colorIndex": "2","img":"assets/img/carousel/HxmYuy1Xr2.jpeg","precio":2300,"cantidad":1},{"id":5,"nombre":"Gorra","color": "negro","colorIndex": "0","img":"assets/img/carousel/i2tzch4rma.jpeg","precio":2300,"cantidad":1}]';
$precio_envio = 800;
*/
// ACA voy a poner los errores...
$error = 0;

$user_j = str_replace("null,", "", $user);
$user_json = json_decode($user_j, true);
$datos_j = str_replace("null,", "", $datos);
$datos_json = json_decode($datos_j, true);
/*
echo "<pre>";
print_r($datos_json);
echo "</pre>";
*/
/*
echo "<pre>";
print_r($user_json);
echo "</pre>";
echo $precio_envio;
*/

// RECOJO LOS DATOS DE POST //
$nombre = $user_json['nombre'];
$apellido = $user_json['apellido'];
$email = $user_json['email'];
$telefono =  $user_json['celular'];
$envio = $user_json['envio'];
$calle = $user_json['calle'];
$calle_num = $user_json['numero'];
$inputPiso = $user_json['departamento'];
$provincia = $user_json['provincia'];
$partido = $user_json['partido'];
$localidad = $user_json['localidad'];
$dni = $user_json['dni'];
$codigo_postal = $user_json['codigopostal'];

$cantidad_de_articulos = count($datos_json);
$preciototal = 0;
//echo $cantidad_de_articulos;
// CUANTOS ARTICULOS
for($i=0;$i<$cantidad_de_articulos;$i++){
    if(empty($datos_json[$i])){
        unset($datos_json[$i]);
    }
    
    $preciototal+= $datos_json[$i]['precio'];
    
}
$cantidad_de_articulos = count($datos_json);

//PARA INGRESARA  A LA BASE PASO A UN ARRAY
$array['nombre'] = $nombre;
$array['apellido'] = $apellido;
$array['email'] = $email;
$array['celular'] = $telefono;
$array['envio'] = $envio;
$array['calle'] = $calle;
$array['calle_num'] = $calle_num;
$array['departamento'] = $inputPiso;
$array['provincia'] = $provincia;
$array['partido'] = $partido;
$array['localidad'] = $localidad;
$array['dni'] = $dni;
$array['codigopostal'] = $codigo_postal;
$array['pedido'] = $datos_j;
$array['cantidad'] = $cantidad_de_articulos;
$array['horario'] = $horario;
$array['delivery'] = $precio_envio;
$array['pago'] = 'no';
$array['formadepago'] = 'Mercado Pago';
$array['precio'] = $preciototal;


$sql = new Sql;
$insert = $sql->insert_array_sin_cero('pedidos',$array);
$id_de_referencia = $sql->getlastId('pedidos');

// FORMATEO LOS DATOS DEL PEDIDO //
for($i=0;$i<$cantidad_de_articulos;$i++){
    $id[$i] = $datos_json[$i]['id'];
    $articulo[$i] = $datos_json[$i]['nombre'];
    $cantidad[$i] = $datos_json[$i]['cantidad'];
    $foto[$i] = $datos_json[$i]['img'];
    $color[$i] = $datos_json[$i]['color'];
    $colorIndex[$i] = $datos_json[$i]['colorIndex'];
    $precio[$i] = $datos_json[$i]['precio'];
    $total[$i] = $datos_json[$i]['precio'][0] * $datos_json[$i]['cantidad'];

    
    if(chequearStock($id[$i],$colorIndex[$i])==0){
        $error++;
    }
}

if($error == 0){
    if (require __DIR__ .  '/vendor/autoload.php'){
        // echo "estamos con el vendor";
    }else{
        // echo "no estamos con el vendor";
    }
      
    //credenciales de prueba: TEST-4612733535270866-101709-c504eb5fa8731797c3cfa686e5fbad46-58691947
    //credenciales produccion APP_USR-4612733535270866-101709-854ec64066d9985aaea5e21e6801c09d-58691947
    MercadoPago\SDK::setAccessToken('TEST-4612733535270866-101709-c504eb5fa8731797c3cfa686e5fbad46-58691947');
    MercadoPago\SDK::setIntegratorId("dev_a0c4acb0b23111eaa3110242ac130004");
      
    $preference = new MercadoPago\Preference();
      
    for ($i=0;$i<$cantidad_de_articulos;$i++){
            
        $item = new MercadoPago\Item();
        
        $item_id[$i] = $id[$i];
        $item_nombre[$i] = $articulo[$i];
        $item_cantidad[$i] = $cantidad[$i];
        $item_precio[$i] = $precio[$i];
        $item_description[$i] = "";
        $item_picture[$i] = "https://espacioanima.com.ar/".$foto[$i];
    
        $item->id = $item_id[$i];
        $item->title = $item_nombre[$i];
        $item->quantity = $item_cantidad[$i];
        $item->currency_id = "ARS";
        $item->unit_price = $item_precio[$i];
        $item->description = $item_description[$i];
        $item->picture_url = $item_picture[$i];
        
        $pedidos [] = $item;
    }
    // AGREGO EL DELIVERY
    if($envio =='enviar'){
        $item = new MercadoPago\Item();
        $item->id = 'Delivery';
        $item->title = 'Envio a Domicilio por Andreani';
        $item->quantity = 1;
        $item->currency_id = "ARS";
        $item->unit_price = $precio_envio;
        $item->description = "Envio a domicilio";

        $pedidos [] = $item;
    }

    $preference->items = $pedidos;

    $payer = new MercadoPago\Payer();
    $payer->name = $nombre; //$nombre
    $payer->surname = $apellido;
    $payer->email = $email;
    $cod_area = "";
    $payer->phone = array(
        "area_code" => $cod_area,
        "number" => $telefono
    );
    $cp = $codigo_postal;
    if($envio == 'casa'){
        $calle = "Bartolomé Mitre, San Lorenzo, Salta";
        $calle_num = "2350";
    }
    
    $payer->address = array(
        "street_name" => $calle,
        "street_number" => $calle_num,
        "zip_code" => $cp
    );
    $preference->payer = $payer;
    $preference->external_reference = $id_de_referencia;
    
    $preference->back_urls = array(
        "success" => "https://espacioanima.com.ar/server/mercado-pago/success.php",
        "failure" => "https://espacioanima.com.ar/server/mercado-pago/failure.php",
        "pending" => "https://espacioanima.com.ar/server/mercado-pago/pending.php"
    );
    $preference->auto_return = "approved";
    $preference->notification_url = "https://espacioanima.com.ar/webhook/index.php";
    
    $preference->save();
    $link_mp = $preference->init_point;
    echo json_encode($link_mp,JSON_UNESCAPED_UNICODE);
}else{
    echo "999";
}

 

?>

