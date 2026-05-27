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
    
$nombre = $_POST["nombre"];
$apellido = $_POST["apellido"];
$email =  $_POST["email"];
$celular = $_POST["celular"];
$mensaje = $_POST["mensaje"];
$departamento = $_POST["departamento"];

switch ($departamento) {
    case 'operaciones':
        $emailDepartamento = "hcarrizo@tmlogistica.com.ar";
        break;
    case 'administracion':
        $emailDepartamento = "fnicora@tmlogistica.com.ar";
        break;
    case 'rrhh':
        $emailDepartamento = "lcavalcanti@tmlogistica.com.ar";
        break;
    case 'calidad':
        $emailDepartamento = "nmontenegro@tmlogistica.com.ar";
        break;
    case 'trafico':
        $emailDepartamento = "dcorti@tmlogistica.com.ar";
        break;
    case 'comercial':
        $emailDepartamento = "ckejwan@tmlogistica.com.ar";
        break;    
    
    default:
        # code...
        break;
}
    


$smtpHost = "c1411263.ferozo.com";  // Dominio alternativo brindado en el email de alta 
$smtpUsuario = "no-reply@c1411263.ferozo.com";  // Mi cuenta de correo
$smtpClave = 'rdi5nw0fgu';  // Mi contraseña

$cuerpo = "Hola, han dejado un Reclamo v&iacute;a web :) \n\n";
$cuerpo .= "(El reclamo puede ser anonimo) \n\n";
$cuerpo .= "Nombre y Apellido: ".$nombre." ".$apellido."\n\n";
$cuerpo .= "Email: ".$email."\n\n";
$cuerpo .= "Celular: ".$celular."\n\n";
$cuerpo .= "Departamento: ".$departamento."\n\n";
$cuerpo .= "Reclamo:".$mensaje."\n\n";
$cuerpo.= " - Eso es todo. - ";

    
                             
$mail = new PHPMailer(true);
$mail->IsSMTP();
//$mail->SMTPDebug = 2;
$mail->SMTPAuth = true;
$mail->Port = 587; 
$mail->IsHTML(true); 
$mail->CharSet = "utf-8";

$mail->Host = $smtpHost; 
$mail->Username = $smtpUsuario; 
$mail->Password = $smtpClave;

$mail->From = $smtpUsuario; // Email desde donde envío el correo.
$mail->FromName = $nombre;
$mail->AddAddress("lcavalcanti@tmlogistica.com.ar"); 
$mail->AddAddress($emailDepartamento);
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
          