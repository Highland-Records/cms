<?php
    require("functions.php");
    $headers = getallheaders();
    $bearerToken = getBearerToken($headers['Authorization']);
    $urls = explode("/", $_SERVER['REDIRECT_URL']);
    $endpoint = $urls[2];
    $endpointId = $urls[3];
    $rMethod = strtolower($_SERVER['REQUEST_METHOD']);
    if ($endpoint === "login") {
        if ($rMethod === "post") {
            login($_POST['username'], $_POST['password']);
        } else {
            header("HTTP/1.0 403 Forbidden");
            response(403, "Invalid Request Method", true);
        }
    } elseif ($endpoint === "users") {
        if (authorised($bearerToken)) {
            if ($rMethod === "post") {
                createNewUser($_POST);
            } elseif ($rMethod === "get") {
                getAllUsers();
            } else {
                header("HTTP/1.0 403 Forbidden");
                response(403, "Invalid Request Method", true);
            }
        } else {
            header("HTTP/1.0 401 Unauthorized");
            response(401, "You aren't authorised to do this", true);
        }
    } else {
        header("HTTP/1.0 404 Not Found");
    }
