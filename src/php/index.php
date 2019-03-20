<?php
// https://developer.byu.edu/docs/consume-api/use-api/oauth-20/oauth-20-php-sample-code
$token_url = 'https://api.podbean.com/v1/oauth/token';
$auth_code = $_GET["code"];

$client_id = '_____ADD_YOUR_ID_HERE______';
$client_secret = '_______ADD_YOUR_SECRET_HERE_____';
$callback_uri = '___ADD_YOUR_CALLBACK_URI_HERE_____';

//	step I, J - turn the authorization code into an access token, etc.
function getAccessToken($auth_code) {
	global $token_url, $client_id, $client_secret, $callback_uri;

	$authorization = base64_encode("$client_id:$client_secret");
	$header = array("Authorization: Basic {$authorization}","Content-Type: application/x-www-form-urlencoded");
	$content = "grant_type=authorization_code&code=$auth_code&redirect_uri=$callback_uri";

	$curl = curl_init();
	curl_setopt_array($curl, array(
		CURLOPT_URL => $token_url,
		CURLOPT_HTTPHEADER => $header,
		CURLOPT_SSL_VERIFYPEER => false,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_POST => true,
		CURLOPT_POSTFIELDS => $content
	));
	
	$response = curl_exec($curl);
	print $response;
	curl_close($curl);
    die();	
}

if  ($auth_code) {
	getAccessToken($auth_code);
} else {
    print "No auth code";
}

?>