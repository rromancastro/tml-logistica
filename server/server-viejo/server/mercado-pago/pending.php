<?php
$collection_id = $_GET['collection_id'];
$collection_status = $_GET['collection_status'];
$external_reference = $_GET['external_reference'];
$payment_type = $_GET['payment_type'];
$preference_id = $_GET['preference_id'];
$site_id = $_GET['site_id'];
$processing_mode = $_GET['processing_mode'];
$merchant_order_id = $_GET['merchant_order_id'];
$merchant_account_id = $_GET['merchant_account_id'];
/*
echo "<pre>";
print_r($_GET);
echo "<pre>";
*/

require("../server/class_sql.php");

$sql = new Sql;
$array['id_mercado_pago'] = $collection_id;
$array['status'] = $collection_status;

foreach($array as $key=>$dato){
    $sql->edit('pagos',$key,$dato,"id",$external_reference);
}


?>
<!DOCTYPE html>
<html>
    <head>
        <!-- Global site tag (gtag.js) - Google Analytics -->


        <title></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>
        <script src="https://www.mercadopago.com/v2/security.js" view="home"></script>
        <link rel="stylesheet" type="text/css" href="../css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="../css/app.css">
        <meta name="description" content="">
    
        <meta property="og:url"           content="" />
        <meta property="og:type"          content="website" />
        <meta property="og:title"         content="" />
        <meta property="og:description"   content="" />
        <meta property="og:image"         content="" />
    </head>
    <body>
        <?php include_once "../templates/top_nav_mp.php";?>
        <div class="mt-md-5 mt-4"> </div>
        <div class="mt-md-5 mt-4"> </div>
        <h3 class="mt-md-5 mt-5 pt-5 text-center">Su pago esta pendiente!</h3>
        <h6 class="m-md-5 mt-5 text-center p-3"> Le informaremos su compra via email</h6>
        <h6 class="p-1">Lo redireccionaremos en unos segundos... </h6>
        <script>
        function redireccionarPagina() {
            window.location = "https://espacioanima.com.ar";
            }
            setTimeout("redireccionarPagina()", 8000);
        </script>
        
    </body>
</html>  
     