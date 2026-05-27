<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://apisqa.andreani.com/login",
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
/*
Código de cliente CL0003750
Contrato para envíos a sucursal 400006711
Contrato para envíos estándar a domicilio 400006709
Contrato para envíos urgentes a domicilio 400006710
Contrato para logística inversa de retiro 400006708
Contrato para logística inversa de cambio 400006707
*/
// CODIGO RAFU
//ZGVmZWxpY2VyYWZhZWxAZ21haWwuY29tOkQzZjNsMWMzIQ==
// CODIGO NACHO ZUNIGA
//enVuaWdhaWduYWNpb0Bob3RtYWlsLmNvbTpOYWNobzIyMTA=
// CODIGO EJEMPLO ANDREANI 

//dXN1YXJpb190ZXN0OkRJJGlLcU1DbEV0TQ==
$response = curl_exec($curl);

curl_close($curl);
/*echo $response;*/
$array_response = json_decode($response,true);
/*
echo "<pre>";
print_r($array_response);
echo "</pre>";
*/
$token = $array_response['token'];
echo $token;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YWJmMzljMS0wMWIzLTQ4YTItYjEzOC1jNGNkMTE2ZWIzNDciLCJ1c2VyTmFtZSI6InVzdWFyaW9fdGVzdCIsImdyb3VwSWQiOiJhNDFjMjU2Yi1kNGM3LTRiYzEtOTA5Mi1jM2FkZWQ5YzM5MWMiLCJpYXQiOjE2NTY5NDQ0NTYsImV4cCI6MTY1NzAzMDg1Nn0.jN1PB4_tFmrbeclicW0eeVSfw5N9StVcSs5qKRweuKE