<?php
    require("functions.php");
    $headers = getallheaders();
    $bearerToken = getBearerToken($headers['Authorization']);
    $urls = explode("/", $_SERVER['REDIRECT_URL']);
    $endpoint = $urls[2];
    $endpointId = $urls[3];
    $rMethod = strtolower($_SERVER['REQUEST_METHOD']);
    if ($endpoint === "login") {
        if ($rMethod === 'post') {
            login($_POST['username'], $_POST['password']);
        } else {
            header("HTTP/1.0 403 Forbidden");
            response(403, "Invalid Request Method", true);
        }
    } else {
        header("HTTP/1.0 404 Not Found");
    }
