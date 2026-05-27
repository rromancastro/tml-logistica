<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since");
header('Access-Control-Allow-Methods: GET, POST, PUT');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require("class.phpmailer.php");
require("class.smtp.php");

/*
$nombre = "Rafael";
$email = "defelicerafael@gmail.com";
$telefono = "1144370599";
$comentario = "Prueba";
*/


if(isset($_POST["nombre"]) && isset($_POST["apellido"])&& isset($_POST["email"]) ){

function ValidarDatos($campo){
//Array con las posibles cabeceras a utilizar por un spammer
$badHeads = array("Content-Type:",
"MIME-Version:",
"Content-Transfer-Encoding:",
"Return-path:",
"Subject:",
"From:",
"Envelope-to:",
"To:",
"bcc:",
"cc:");

foreach($badHeads as $valor){
if(strpos(strtolower($campo), strtolower($valor)) !== false){
header( "HTTP/1.0 403 Forbidden");
exit;
}
}
}
//Ejemplo de llamadas a la funcion
ValidarDatos($_POST['nombre']);
ValidarDatos($_POST['apellido']);
ValidarDatos($_POST['email']);
ValidarDatos($_POST['mensaje']);    
ValidarDatos($_POST['celular']);    
ValidarDatos($_POST['seccion']);   
    
$nombre = $_POST["nombre"];
$apellido = $_POST["apellido"];
$email =  $_POST["email"];
$celular = $_POST["celular"];
$mensaje = $_POST["mensaje"];
$seccion = $_POST["seccion"];
    
$smtpHost = "smtp.gmail.com";  // Dominio alternativo brindado en el email de alta 
$smtpUsuario = "sistemas@tmlogistica.com.ar";  // Mi cuenta de correo
$smtpClave = 'adoyuxfcjmkuhfpe';  // Mi ex contraseña //  kdskcsuonosihkwx


$cuerpo = "Hola, han dejado un mensaje v&iacute;a web :) \n\n";
$cuerpo .= $nombre." se ha contactado por medio de nuestro formulario de contacto. \n\n";
$cuerpo .= "Su email es: ".$email."\n\n";
$cuerpo .= "tel&eacute;fono: ".$celular."\n\n";
$cuerpo .= "Mensaje:".$mensaje."\n\n";
$cuerpo .= "Sección:".$seccion."\n\n";
$cuerpo.= " - Eso es todo. - ";

    
                             
$mail = new PHPMailer(true);
$mail->IsSMTP();
//$mail->SMTPDebug = 2;
$mail->SMTPAuth = true;
$mail->Port = 587; 
//$mail->Port = 465; 
$mail->IsHTML(true); 
$mail->CharSet = "utf-8";

$mail->Host = $smtpHost; 
$mail->Username = $smtpUsuario; 
$mail->Password = $smtpClave;

$mail->From = $smtpUsuario; // Email desde donde envío el correo.
$mail->FromName = $nombre;
$mail->AddAddress("info@tmlogistica.com.ar"); 
//$mail->AddAddress("defelicerafael@gmail.com");
//$mail->AddAddress("jantunez@gmail.com");
                    //$mail->AddAddress($emailJuli);// Esta es la dirección a donde enviamos los datos del formulario
$mail->AddReplyTo("info@tmlogistica.com.ar"); // Esto es para que al recibir el correo y poner Responder, lo haga a la cuenta del visitante. 
$mail->Subject = "Se han contactado desde la WEB :)"; // Este es el titulo del email.
$mensaje = $cuerpo;
$mensajeHtml = nl2br($cuerpo);
$mail->Body = "{$mensajeHtml}"; // Texto del email en formato HTML
$mail->AltBody = "{$mensaje}"; // Texto sin formato HTML
                    // FIN - VALORES A MODIFICAR //
                    //$mail->SMTPSecure = 'ssl';
$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);

$estadoEnvio = $mail->Send(); 
    if($estadoEnvio){
        echo 1;
    } else {
        echo 0;
    }
}