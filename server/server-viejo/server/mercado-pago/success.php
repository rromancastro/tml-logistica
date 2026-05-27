
<?php

    include_once '../chequearStockFunction.php';

    $collection_id = $_GET['collection_id'];
    $collection_status = $_GET['collection_status'];
    $payment_id = $_GET['payment_id'];
    $status = $_GET['status'];
    $external_reference = $_GET['external_reference'];
    $payment_type = $_GET['payment_type'];
    $preference_id = $_GET['preference_id'];
    $site_id = $_GET['site_id'];
    $processing_mode = $_GET['processing_mode'];
    $merchant_order_id = $_GET['merchant_order_id'];
    $merchant_account_id = $_GET['merchant_account_id'];
 
    /*
    https://espacioanima.com.ar/server/mercado-pago/success.php?
    collection_id=1308002853
    collection_status=approved
    payment_id=1308002853
    status=approved
    external_reference=12
    payment_type=credit_card
    merchant_order_id=5676894601
    preference_id=406624521-35841afe-270c-43fb-bcde-2ffe22b047c9
    site_id=MLA
    processing_mode=aggregator
    merchant_account_id=null
    */

    //HORARIO
    $recien = getdate();
    $horario = $recien['hours'].":".$recien['minutes'].":".$recien['seconds'];

    require("../class_sql.php");

    $sql = new Sql;
    $array['id_mercado_pago'] = $payment_id;
    $array['status'] = $status;
    $array['pago'] = "si"; 
    $array['payment_type'] = $payment_type; 

    foreach($array as $key=>$dato){
        $sql->edit('pedidos',$key,$dato,"id",$external_reference);
    }

    if($collection_status!='approved'){
        exit();
    }

    require("../contact/class.phpmailer.php");
    require("../contact/class.smtp.php");
    
    $carro = new Sql;
    $filtro = array('id'=>$external_reference);
    $pedido = $carro->selectTablaNew('pedidos',$filtro,'id','ASC',1);

    /*echo "<pre>";
    print_r($pedido);
    echo "</pre>";*/

    $email = $pedido[0]['email'];
    $apellido = $pedido[0]['apellido'];
    $nombre= $pedido[0]['nombre'];
    $telefono = $pedido[0]['celular'];
    $calle = $pedido[0]['calle'];
    $calle_num = $pedido[0]['calle_num'];
    $barrio = $pedido[0]['localidad'];
    $inputPiso = $pedido[0]['departamento'];
    $pedidoweb = $pedido[0]['pedido'];
    $envio = $pedido[0]['envio'];
    $delivery = $pedido[0]['delivery'];
    $precio = $pedido[0]['precio'];

    $pedidoweb = json_decode($pedidoweb,true);

    /*
    echo "<pre>";
    print_r($pedidoweb);
    echo "</pre>";
    */

    $cantidad_de_articulos = count($pedidoweb);
    //echo $pedidoweb;
    for($i=0;$i<$cantidad_de_articulos;$i++){
        // HAGO EL DESCUENTO DEL STOCK //
        descontarStock($pedidoweb[$i]['id'],$pedidoweb[$i]['colorIndex'],$pedidoweb[$i]['cantidad']);
    }
    

    $smtpHost = "c1781579.ferozo.com";  // Dominio alternativo brindado en el email de alta 
    $smtpUsuario = "info@espacioanima.com.ar";  // Mi cuenta de correo
    $smtpClave = 'estoEsEspacio4nima';  // Mi contraseña
    $agrego_delivery = "";

    $cuerpo = "Hola! Entró un pedido a las $horario de HOY! \n";
    $cuerpo .= "<b>SE PAGO CON MERCADO PAGO! ID: ".$collection_id."</b>  \n";
    $cuerpo .= "<hr> \n";
    $cuerpo .=  "DATOS DEL CLIENTE\n\n";
    $cuerpo .=  "<b>Nombre y Apellido:</b> ".$nombre." ".$apellido."\n";
    $cuerpo .=  "<b>Email:</b> ".$email."\n";
    $cuerpo .=  "<b>Celular:</b> ".$telefono."\n";
    if($envio =="enviar"){
        $cuerpo .=  "<b>Direcci&oacute;n:</b> ".$calle." ".$calle_num.", ".$inputPiso.", ".$barrio."\n";
        $cuerpo .=  "<b>Precio del envío:</b> $".$delivery." \n\n";
        $agrego_delivery = "- INCLUYENDO ENVÍO -";
    }else{
        $cuerpo .=  "Retira en Casa Anima \n";
    }
    $cuerpo .= "<b>EL PEDIDO:</b> \n\n";

    for($i=0;$i<$cantidad_de_articulos;$i++){
        $cuerpo .= "<b>ELEMENTO:</b> ".$pedidoweb[$i]['nombre']."\n";
        $cuerpo .= "<b>COLOR:</b> ".$pedidoweb[$i]['color']."\n";
        $cuerpo .= "<b>CANTIDAD:</b> ".$pedidoweb[$i]['cantidad']."\n";
        $cuerpo .= "<b>PRECIO: </b> $".$pedidoweb[$i]['precio']."\n\n";
        $cuerpo .= "<br/>";
    }
    $cuerpo .= "\n <b>PRECIO FINAL ".$agrego_delivery." : $".$precio."</b>\n";
    $cuerpo .= "<hr> \n";
    $cuerpo .= "Eso es todo, Saludos!";

    //echo $cuerpo;

    $mail = new PHPMailer(true);
    //$mail->IsSMTP();
    $mail->SMTPDebug = 2;
    $mail->SMTPAuth = true;
    $mail->Port = 587; 
    $mail->IsHTML(true); 
    $mail->CharSet = "utf-8";

    $mail->Host = $smtpHost; 
    $mail->Username = $smtpUsuario; 
    $mail->Password = $smtpClave;

    $mail->From = $smtpUsuario; // Email desde donde envío el correo.
    $mail->FromName = "Espacio Ánima - WEB";
    //$mail->AddAddress("defelicerafael@gmail.com"); 
    $mail->AddAddress("elementos@espacioanima.com.ar"); 
    //$mail->AddAddress("pedidos@lagran7.com.ar"); 
                    //$mail->AddAddress($emailMili);
                    //$mail->AddAddress($emailJuli);// Esta es la dirección a donde enviamos los datos del formulario
    $mail->AddReplyTo("elementos@espacioanima.com.ar"); // Esto es para que al recibir el correo y poner Responder, lo haga a la cuenta del visitante. 
    $mail->Subject = "Ingresó un PEDIDO!"; // Este es el titulo del email.
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
    // SE MANDO EL EMAIL?
    
    $estadoEnvio = $mail->Send(); 
        if($estadoEnvio){
            $array2['email_enviado'] = "si";
            foreach($array2 as $key=>$dato){
                $sql->edit('pedidos',$key,$dato,"id",$id_de_referencia);
            }
            
        } else {
            $array2['email_enviado'] = "no";
            foreach($array2 as $key=>$dato){
                $sql->edit('pedidos',$key,$dato,"id",$id_de_referencia);
            }
        }
    
    // EMAIL PARA EL CLIENTE //
    $cuerpo2 = "Hola ".$nombre."! Entró tu pedido! \n";
    $cuerpo2 .= "<b>SE PAGO CON MERCADO PAGO! ID: ".$collection_id."</b>  \n";
    
    $cuerpo2 .= "<hr> \n";
    $cuerpo2 .=  "TUS DATOS:\n\n";
    $cuerpo2 .=  "<b>Nombre y Apellido:</b> ".$nombre." ".$apellido."\n";
    $cuerpo2 .=  "<b>Email:</b> ".$email."\n";
    $cuerpo2 .=  "<b>Celular:</b> ".$telefono."\n";
    
    if($envio =="enviar"){
        $cuerpo2 .=  "<b>Direcci&oacute;n:</b> ".$calle." ".$calle_num.", ".$inputPiso.", ".$barrio."\n";
        $cuerpo2 .=  "<b>Precio del envío:</b> $".$delivery." \n\n";
        $agrego_delivery = "- INCLUYENDO ENVÍO -";
    }else{
        $cuerpo2 .=  "Retiras en Casa Ánima: Bartolomé Mitre 2350 | San Lorenzo | Salta  \n";
    }
    
    $cuerpo2 .= "<b>EL PEDIDO:</b> \n\n";

    for($i=0;$i<$cantidad_de_articulos;$i++){
        $cuerpo2 .= "<b>ELEMENTO:</b> ".$pedidoweb[$i]['nombre']."\n";
        $cuerpo2 .= "<b>COLOR:</b> ".$pedidoweb[$i]['color']."\n";
        $cuerpo2 .= "<b>CANTIDAD:</b> ".$pedidoweb[$i]['cantidad']."\n";
        $cuerpo2 .= "<b>PRECIO: </b> $".$pedidoweb[$i]['precio']."\n\n";
        $cuerpo2 .= "<br/>";
    }

    $cuerpo2 .= "\n <b>PRECIO FINAL ".$agrego_delivery." : $".$precio."</b>\n";
    $cuerpo2 .= "<hr> \n";
    $cuerpo2 .= "<br/><br/>Eso es todo!, Saludos!";
    $mail2 = new PHPMailer(true);
    //$mail->IsSMTP();
    $mail2->SMTPDebug = 2;
    $mail2->SMTPAuth = true;
    $mail2->Port = 587; 
    $mail2->IsHTML(true); 
    $mail2->CharSet = "utf-8";

    $mail2->Host = $smtpHost; 
    $mail2->Username = $smtpUsuario; 
    $mail2->Password = $smtpClave;

    $mail2->From = $smtpUsuario; // Email desde donde envío el correo.
    $mail2->FromName = "Espacio Ánima - WEB";
    $mail2->AddAddress($email); 
    $mail2->AddReplyTo("elementos@espacioanima.com.ar"); // Esto es para que al recibir el correo y poner Responder, lo haga a la cuenta del visitante. 
    $mail2->Subject = "Ingresó tu PEDIDO!"; // Este es el titulo del email.
    $mensaje2 = $cuerpo2;
    $mensajeHtml2 = nl2br($cuerpo2);
    $mail2->Body = "{$mensajeHtml2}"; // Texto del email en formato HTML
    $mail2->AltBody = "{$mensaje2}"; // Texto sin formato HTML
                        // FIN - VALORES A MODIFICAR //
                        //$mail->SMTPSecure = 'ssl';
    $mail2->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );
    // SE MANDO EL EMAIL?
    $estadoEnvio2 = $mail2->Send();     
    
   include_once 'landing-success.php'; 
?>

