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
?>

<html>
    <head>
        <!-- Global site tag (gtag.js) - Google Analytics -->


        <title></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>
        <script src="https://www.mercadopago.com/v2/security.js" view="home"></script>
        
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
        <h3 class="mt-md-5 mt-5 pt-5 text-center">El pago ha fallado!</h3>
        <script>
        function redireccionarPagina() {
            window.location = "https://espacioanima.com.ar";
            }
            setTimeout("redireccionarPagina()", 5000);
        </script>
    </body>
</html> 