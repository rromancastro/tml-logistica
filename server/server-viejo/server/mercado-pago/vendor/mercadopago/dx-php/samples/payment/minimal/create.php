<?php
  
  require_once dirname(__FILE__) . '/../../index.php';
  
  $config->set('TEST-8252776030650874-042714-9a05714165150fd297fa432441698541-25246282', 'TEST-8252776030650874-042714-9a05714165150fd297fa432441698541-25246282');
  
  $payment = new MercadoPago\Payment();
  
  $payment->transaction_amount = 100;
  $payment->token = "f9100f7e9ba98bc9777bfe321774ed5f";
  $payment->description = "Title of what you are paying for";
  $payment->installments = 1;
  $payment->payment_method_id = "visa";
  
  $payer = new MercadoPago\Payer();
  $payer->email = "mail@joelibaceta.com";
  
  $payment->payer = $payer;
  $payment->save(); 
  
  echo $payment->status;
  echo $payment->status_detail;
  
  echo "\n";
  
  echo "PaymentId: " . $payment->id . "\n";
  
?>
