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
                response(400, "Incorrect Username", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "Blank email/password provided", true);
        }
    }

    function createNewUser($postData)
    {
        if (!empty($postData['username']) && !empty($postData['password']) && !empty($postData['first_name']) && !empty($postData['last_name'])) {
            $db = $GLOBALS['db'];
            $userQuery = "SELECT `username` FROM `users` WHERE `username` = '".$postData['username']."'";
            $userResult = mysqli_query($db, $userQuery);
            $userExists = mysqli_num_rows($userResult);
            if (empty($userExists)) {
                $validKeys = ['first_name','last_name','email','client','account_type'];
                foreach ($postData as $key=>$value) {
                    if (in_array($key, $validKeys)) {
                        $postKeys[] = "`".$key."`";
                        $postValues[] = "'".$value."'";
                    }
                }
                $postUserQuery = 'INSERT INTO `users` ('.implode(", ", $postKeys).') VALUES ('.implode(", ", $postValues).')';
                $postUserResult = mysqli_query($db, $postUserQuery);
                $getUserQuery = "SELECT `id` FROM `users` WHERE `username` = '".$postData['username']."'";
                $getUserResult = mysqli_query($db, $getUserQuery);
                $userId = mysqli_fetch_assoc($getUserResult)['id'];
                $postPasswordQuery = "INSERT INTO `passwords` (`password`) VALUES ('".$postData['password']."')";
                $postPasswordResult = mysqli_query($db, $postPasswordQuery);
            } else {
                header("HTTP/1.0 409 Conflict");
                response(409, "User already exists", true);
            }
        } else {
            if (empty($postData['username'])) {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Username required", true);
            } elseif (empty($postData['password'])) {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Password required", true);
            } elseif (empty($postData['first_name'])) {
                header("HTTP/1.0 400 Bad Request");
                response(400, "First Name required", true);
            } elseif (empty($postData['last_name'])) {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Last Name required", true);
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Username, Password, First Name and Last Name need to be submitted", true);
            }
        }
    }

    function getAllUsers()
    {
        $db = $GLOBALS['db'];
        $currentUser = $GLOBALS['currentUser'];
        $checkUserQuery = "SELECT `id` FROM `users` WHERE `id` = ".$currentUser;
        $checkUserResult = mysqli_query($db, $checkUserQuery);
        $exists = mysqli_num_rows($checkUserResult);
        $accountType = mysqli_fetch_assoc($checkUserResult)['account_type'];
        $clientId = mysqli_fetch_assoc($checkUserResult)['client'];
        if (!empty($exists)) {
            if ($accountType == 1) {
                $getUsersQuery = "SELECT `id`,`first_name`,`last_name`,`account_type`,`profile_img`,`issues` FROM `users` WHERE `deleted` = 0 AND `client` = ".$clientId;
                $getUsersResult = mysqli_query($db, $getUsersQuery);
                $data = [];
                while ($row = mysqli_fetch_assoc($getUsersResult)) {
                    array_push($data, $row);
                }
                header("Content-Type: application/json");
                echo json_encode($data);
            } elseif ($accountType == 2) {
                $getUsersQuery = "SELECT * FROM `users` WHERE `deleted` = 0 AND `client` = ".$clientId;
                $getUsersResult = mysqli_query($db, $getUsersQuery);
                $data = [];
                while ($row = mysqli_fetch_assoc($getUsersResult)) {
                    array_push($data, $row);
                }
                header("Content-Type: application/json");
                echo json_encode($data);
            } elseif ($accountType == 3) {
                $getUsersQuery = "SELECT * FROM `users` WHERE `deleted` = 0";
                $getUsersResult = mysqli_query($db, $getUsersQuery);
                $data = [];
                while ($row = mysqli_fetch_assoc($getUsersResult)) {
                    array_push($data, $row);
                }
                header("Content-Type: application/json");
                echo json_encode($data);
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Invalid Account Type", true);
            }
        }
        // if user is an admin(2) show all users data for their clients
        // if user is a developer(3) show all users for all clients
        // if user is user(1) show all users (id, first name, last name, account_type, issues)
    }
