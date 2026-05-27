<?php
error_reporting(E_ALL);
ini_set('display_errors',1);

require_once '../conexion.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since");
header('Access-Control-Allow-Methods: GET, POST, PUT');

$codigo_postal = filter_input(INPUT_GET, 'cp', FILTER_SANITIZE_SPECIAL_CHARS);

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://apis.andreani.com/v1/localidades?codigosPostales=$codigo_postal",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "Authorization: Basic dXN1YXJpb190ZXN0OkRJJGlLcU1DbEV0TQ==",
    ),
));
//cpDestino=1400&contrato=300006611&cliente=CL0003750&sucursalOrigen=BAR&bultos[0][valorDeclarado]=1200&bultos[0][kilos]=1.3
//?cpDestino=$codigo_postal&contrato=$contrato&cliente=$cliente&bultos[0][kilos]=$peso&sucursalOrigen=$sucursalOrigen&valorDeclarado=$precio
$response = curl_exec($curl);
curl_close($curl);
$array_response = json_decode($response,true);

echo $response;
/*
echo "<pre>";
print_r($array_response);
echo "</pre>";
*/