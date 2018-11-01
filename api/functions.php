<?php
    require("dbconfig.php");

    $conn = new mysqli($dbConfig['host'], $dbConfig['user'], $dbConfig['password'], $dbConfig['db']);
    if ($conn->connect_errno) {
        $conn->close();
        header("HTTP/1.0 503 Service Unavailable");
        response(504, "Failed to connect to database", true);
    } else {
        $GLOBALS['db'] = $conn;
    }

    function response($code, $message, $die = false)
    {
        header("Content-Type: application/json");
        $response = [
            'code'=>$code,
            'message'=>$message
        ];
        echo json_encode($response);
        if ($die === true) {
            die();
        }
    }

    function getBearerToken($authHeader)
    {
        if (!empty($authHeader) && strpos($authHeader, "Bearer") !== false) {
            return explode(" ", $authHeader)[1];
        }
    }

    function authorised($token)
    {
        if (!empty($token)) {
            $db = $GLOBALS['db'];
            $authQuery = "SELECT `id` FROM `users` WHERE `token` = '".$token."'";
            $authResult = mysqli_query($db, $authQuery);
            $authExists = mysqli_num_rows($authResult);
            $GLOBALS['currentUser'] = mysqli_fetch_assoc($authResult)['id'];
            if (!empty($authExists)) {
                return true;
            } else {
                return false;
            }
        }
    }

    function login($username, $password)
    {
        if (!empty($username) || !empty($password)) {
            $db = $GLOBALS['db'];
            $userQuery = "SELECT `id`,`token` FROM `users` WHERE `username` = '".$username."'";
            $userResult = mysqli_query($db, $userQuery);
            $userExists = mysqli_num_rows($userResult);
            $userData = mysqli_fetch_assoc($userResult);
            $userId = $userData['id'];
            $userToken = $userData['token'];
            if (!empty($userExists)) {
                if (!empty($userToken)) {
                    $passwordQuery = "SELECT `id` FROM `passwords` WHERE `id` = '".$userId."' AND `password` = '".$password."'";
                    $passwordResult = mysqli_query($db, $passwordQuery);
                    $passwordExists = mysqli_num_rows($passwordResult);
                    if (!empty($passwordExists)) {
                        $loggedIn = [
                            'id'=>$userId,
                            'email'=>$email,
                            'token'=>$userToken,
                        ];
                        header("Content-Type: application/json");
                        echo json_encode($loggedIn);
                    }
                } else {
                    $passwordQuery = "SELECT `id` FROM `passwords` WHERE `id` = '".$userId."' AND `password` = '".$password."'";
                    $passwordResult = mysqli_query($db, $passwordQuery);
                    $passwordExists = mysqli_num_rows($passwordResult);
                    if (!empty($passwordExists)) {
                        $token = md5(uniqid());
                        $setTokenQuery = "UPDATE `users` SET `token` = '".$token."' WHERE `id` = ".$userId;
                        $setTokenResult = mysqli_query($db, $setTokenQuery);
                        $loggedIn = [
                            'id'=>$userId,
                            'email'=>$email,
                            'token'=>$token,
                        ];
                        header("Content-Type: application/json");
                        echo json_encode($loggedIn);
                    } else {
                        header("HTTP/1.0 400 Bad Request");
                        response(400, "Invalid Password", true);
                    }
                }
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Incorrect Email", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "Blank email/password provided", true);
        }
    }