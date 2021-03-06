<?php
    require("./dbconfig.php");

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

    function createSalt()
    {
        $seed = str_split('abcdefghijklmnopqrstuvwxyz'.'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.'0123456789!@#$%^&*()'); // and any other characters
    shuffle($seed); // probably optional since array_is randomized; this may be redundant
    $rand = '';
        foreach (array_rand($seed, 10) as $k) {
            $rand .= $seed[$k];
        }
        return $rand;
    }

    function encryptPwd($password, $salt)
    {
        $hashPassword = md5($password);
        $hashSalt = md5($salt);
        return md5($salt.' '.$password);
    }

    function isntValid($string)
    {
        if (preg_match($string, '/[^A-Za-z0-9]/i')) {
            return true;
        }
    }

    function sanitise($string)
    {
        return strtolower(strip_tags($string));
    }

    function login($username, $password)
    {
        if (!empty($username) || !empty($password)) {
            $username = sanitise($username);
            $db = $GLOBALS['db'];
            $userQuery = "SELECT `id`,`token`,`salt` FROM `users` WHERE `deleted` = 0 AND `username` = '".$username."'";
            $userResult = mysqli_query($db, $userQuery);
            $userExists = mysqli_num_rows($userResult);
            $userData = mysqli_fetch_assoc($userResult);
            $userId = $userData['id'];
            $userToken = $userData['token'];
            $salt = $userData['salt'];
            if (!empty($userExists)) {
                if (!empty($userToken)) {
                    //here
                    $encryptedPassword = encryptPwd($password, $salt);
                    $passwordQuery = "SELECT `id` FROM `passwords` WHERE `id` = '".$userId."' AND `password` = '".$encryptedPassword."'";
                    $passwordResult = mysqli_query($db, $passwordQuery);
                    $passwordExists = mysqli_num_rows($passwordResult);
                    if (!empty($passwordExists)) {
                        $loggedIn = [
                            'id'=>$userId,
                            'username'=>$username,
                            'token'=>$userToken,
                        ];
                        header("Content-Type: application/json");
                        echo json_encode($loggedIn);
                    } else {
                        header("HTTP/1.0 400 Bad Request");
                        response(400, "Incorrect password, please try again.", true);
                    }
                } else {
                    $encryptedPassword = encryptPwd($password, $salt);
                    $passwordQuery = "SELECT `id` FROM `passwords` WHERE `id` = '".$userId."' AND `password` = '".$encryptedPassword."'";
                    $passwordResult = mysqli_query($db, $passwordQuery);
                    $passwordExists = mysqli_num_rows($passwordResult);
                    if (!empty($passwordExists)) {
                        $token = md5(uniqid());
                        $setTokenQuery = "UPDATE `users` SET `token` = '".$token."' WHERE `id` = ".$userId;
                        $setTokenResult = mysqli_query($db, $setTokenQuery);
                        $loggedIn = [
                            'id'=>$userId,
                            'username'=>$username,
                            'token'=>$token,
                        ];
                        header("Content-Type: application/json");
                        echo json_encode($loggedIn);
                    } else {
                        header("HTTP/1.0 400 Bad Request");
                        response(400, "Incorrect password, please try again.", true);
                    }
                }
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Incorrect username, please try again.", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "Both a username and a password must be provided, please try again.", true);
        }
    }

    function logout($userId, $token)
    {
        if (!empty($userId)) {
            $db = $GLOBALS['db'];
            $userQuery = "SELECT `id` FROM `users` WHERE `token` = '".$token."' AND `id` = ".$userId;
            $userResult = mysqli_query($db, $userQuery);
            $userExists = mysqli_num_rows($userResult);
            $userData = mysqli_fetch_assoc($userResult);
            if (!empty($userExists)) {
                $setTokenQuery = "UPDATE `users` SET `token` = '0' WHERE `id` = ".$userId;
                $setTokenResult = mysqli_query($db, $setTokenQuery);
                response(200, "Logged Out");
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Failed to log out", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "Invalid User ID", true);
        }
    }

    function createUser($postData)
    {
        if (
            !empty($postData['first_name']) &&
            !empty($postData['last_name']) &&
            !empty($postData['username']) &&
            !empty($postData['password'])
        ) {
            if (!isntValid($postData['username']) && !isntValid($postData['first_name']) && !isntValid($postData['last_name'])) {
                $db = $GLOBALS['db'];
                $checkUserExistsQuery = "SELECT `username` FROM `users` WHERE `deleted` = 0 AND `username` = '".$postData['username']."'";
                $checkUserExistsResult = mysqli_query($db, $checkUserExistsQuery);
                $userExists = mysqli_num_rows($checkUserExistsResult);
                if (empty($userExists)) {
                    $validKeys = ['first_name','last_name','username'];
                    foreach ($postData as $key=>$value) {
                        if (in_array($key, $validKeys)) {
                            $postKeys[] = "`".$key."`";
                            $postValues[] = "'".$value."'";
                        }
                    }
                    $postKeys[] = '`salt`';
                    $salt = createSalt();
                    $postValues[] = "'".$salt."'";
                    $postKeys[] = '`profile_img`';
                    // $salt = createSalt();
                    $postValues[] = "''";
                    $thirtyDaysAgo = time() - (1);
                    $getDeletedUsersQuery = "SELECT * FROM `users` WHERE `deleted` = 1";
                    $getDeletedUsersResult = mysqli_query($db, $getDeletedUsersQuery);
                    while ($row = mysqli_fetch_assoc($getDeletedUsersResult)) {
                        if (!empty($row['deleted_timestamp']) && (int)$row['deleted_timestamp'] <= $thirtyDaysAgo) {
                            $idToRecycle = "'".$row['id']."'";
                            break;
                        }
                    }

                    if (isset($idToRecycle)) {
                        $postKeys[] = '`deleted`';
                        $postValues[] = 0;
                        $postKeys[] = '`deleted_timestamp`';
                        $postValues[] = 0;
                        $setValue = "";

                        foreach ($postKeys as $i=>$key) {
                            $setValue .= $postKeys[$i]." = ".$postValues[$i].", ";
                        }
                        $setValue = rtrim($setValue, ', ');
                        $recycleUserQuery = "UPDATE `users` SET ".$setValue." WHERE `id` = ".$idToRecycle;
                        $recycleUserResult = mysqli_query($db, $recycleUserQuery);
                        $encryptedPassword = encryptPwd($postData['password'], $salt);
                        $recyclePasswordQuery = "UPDATE `passwords` SET `password` = '".$encryptedPassword."' WHERE `id` = ".$idToRecycle;
                        $recyclePasswordResult = mysqli_query($db, $recyclePasswordQuery);
                    } else {
                        $postUserQuery = 'INSERT INTO `users` ('.implode(", ", $postKeys).') VALUES ('.implode(", ", $postValues).')';
                        $postUserResult = mysqli_query($db, $postUserQuery);
                        $getUserQuery = "SELECT `id` FROM `users` WHERE `username` = '".$postData['username']."'";
                        $getUserResult = mysqli_query($db, $getUserQuery);
                        $userId = mysqli_fetch_assoc($getUserResult)['id'];
                        $encryptedPassword = encryptPwd($postData['password'], $salt);
                        $postPasswordQuery = "INSERT INTO `passwords` (`password`,`id`) VALUES ('".$encryptedPassword."',".$userId.")";
                        $postPasswordResult = mysqli_query($db, $postPasswordQuery);
                    }
                    $getUserQuery = "SELECT * FROM `users` WHERE `username` = '".$postData['username']."'";
                    $getUserResult = mysqli_query($db, $getUserQuery);
                    $row = mysqli_fetch_assoc($getUserResult);
                    header("Content-Type: application/json");
                    echo json_encode($row);
                } else {
                    header("HTTP/1.0 409 Conflict");
                    response(409, "Username is already taken", true);
                }
            } else {
                header("HTTP/1.0 400 Bad Request");
                if (!isntValid($postData['username'])) {
                    response(400, "Username cannot contain special characters", true);
                } elseif (!isValid($postData['first_name'])) {
                    response(400, "First Name cannot contain special characters", true);
                } elseif (!isValid($postData['last_name'])) {
                    response(400, "Last Name cannot contain special characters", true);
                }
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            if (!empty($postData['first_name'])) {
                response(400, "First name cannot be blank", true);
            } elseif (!empty($postData['last_name'])) {
                response(400, "Last name cannot be blank", true);
            } elseif (!empty($postData['username'])) {
                response(400, "Username cannot be blank", true);
            } elseif (!empty($postData['password'])) {
                response(400, "Password cannot be blank", true);
            } else {
                response(400, "All fields must be filled in", true);
            }
        }
    }

    function changePassword($id, $password, $newPassword)
    {
        if (!empty($id) && !empty($password) && !empty($newPassword)) {
            $db = $GLOBALS['db'];
            $checkExistsQuery = "SELECT `salt` FROM `users` WHERE `id` = ".$id;
            $checkExistsResult = mysqli_query($db, $checkExistsQuery);
            $salt = mysqli_fetch_assoc($checkExistsResult)['salt'];
            if (!empty($salt)) {
                $encryptedPassword = encryptPwd($password, $salt);
                $checkPasswordQuery = "SELECT `id` FROM `passwords` WHERE `id` = ".$id." AND `password` = '".$encryptedPassword."'";
                $checkPasswordResult = mysqli_query($db, $checkPasswordQuery);
                $passwordCorrect = mysqli_num_rows($checkPasswordResult);
                if (!empty($passwordCorrect)) {
                    $newSalt = createSalt();
                    $changeSaltQuery = "UPDATE `users` SET `salt` = '".$newSalt."' WHERE `id` = ".$id;
                    $changeSaltResult = mysqli_query($db, $changeSaltQuery);

                    $encryptedNewPassword = encryptPwd($newPassword, $newSalt);
                    $changePasswordQuery = "UPDATE `passwords` SET `password` = '".$encryptedNewPassword."' WHERE `id` = ".$id;
                    $changePasswordResult = mysqli_query($db, $changePasswordQuery);
                    response(200, "Changed password!", true);
                } else {
                    header("HTTP/1.0 400 Bad Request");
                    response(400, "Incorrect password.", true);
                }
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "User doesn't exist.", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "Invalid ID, password or new password", true);
        }
    }

    function deleteRow($id, $table)
    {
        $db = $GLOBALS['db'];
        if (!empty($id) && !empty($table)) {
            if ($table === 'users') {
                $columnName = "`profile_img`";
            } elseif ($table === 'artists') {
                $columnName = "`profile_img`, `banner_img`";
            } elseif ($table === 'albums') {
                $columnName = "`album_art`";

                $getArtistQuery = "SELECT `artist` FROM `albums` WHERE `id` = ".$id;
                $getArtistResult = mysqli_query($db, $getArtistQuery);
                $artistId = mysqli_fetch_assoc($getArtistQuery)['artist'];

                $getAlbumsQuery = "SELECT `albums` FROM `artists` WHERE `id` = ".$artistId;
                $getAlbumsResult = mysqli_query($db, $getUsersQuery);
                $albums = mysqli_fetch_assoc($getAlbumsQuery)['albums'];

                if (strpos($albums, ",".$id) != false) {
                    $albums = str_replace(",".$id, "", $albums);
                } elseif (strpos($albums, $id) != false) {
                    $albums = str_replace($id, "", $albums);
                }

                $setDeleteQuery = "UPDATE `artists` SET `albums` = '".$albums."' WHERE `id` = ".$id;
                $setDeleteResult = mysqli_query($db, $setDeleteQuery);
            }
            $checkExistsQuery = "SELECT ".$columnName." FROM `".$table."` WHERE `id` = ".$id;
            $checkExistsResult = mysqli_query($db, $checkExistsQuery);
            $exists = mysqli_num_rows($checkExistsResult);
            if ($table === 'users') {
                $profileImg = mysqli_fetch_assoc($checkExistsResult)['profile_img'];
            } elseif ($table === 'artists') {
                $profileImg = mysqli_fetch_assoc($checkExistsResult)['profile_img'];
                $bannerImg = mysqli_fetch_assoc($checkExistsResult)['banner_img'];
            }
            if (!empty($exists)) {
                $now = time();
                $setDeleteQuery = "UPDATE `".$table."` SET `deleted` = 1, `deleted_timestamp` = '".$now."' WHERE `id` = ".$id;
                $setDeleteResult = mysqli_query($db, $setDeleteQuery);
                if ($table === 'users' && !empty($profileImg)) {
                    array_map('unlink', glob("images/".$profileImg));
                }
                if ($table === 'artists' && !empty($profileImg)) {
                    array_map('unlink', glob("images/artists/".$profileImg));
                }
                if ($table === 'artists' && !empty($bannerImg)) {
                    array_map('unlink', glob("images/banners/".$bannerImg));
                }
                header("HTTP/1.0 200 OK");
                response(200, "Deleted", true);
            } else {
                header("HTTP/1.0 404 Not Found");
                response(404, "No user found", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "No Id or Table provided", true);
        }
    }

    function getAllUsers()
    {
        $db = $GLOBALS['db'];
        $getUsersQuery = "SELECT * FROM `users` WHERE `deleted` = 0";
        $getUsersResult = mysqli_query($db, $getUsersQuery);
        $data = [];
        while ($row = mysqli_fetch_assoc($getUsersResult)) {
            array_push($data, $row);
        }
        header("Content-Type: application/json");
        echo json_encode($data);
    }


    function getUser($userId)
    {
        $db = $GLOBALS['db'];
        $getUsersQuery = "SELECT * FROM `users` WHERE `deleted` = 0  AND `id` = ".$userId;
        $getUsersResult = mysqli_query($db, $getUsersQuery);
        $row = mysqli_fetch_assoc($getUsersResult);
        header("Content-Type: application/json");
        echo json_encode($row);
    }

    function editUser($userId, $postData)
    {
        $db = $GLOBALS['db'];
        $currentUser = $GLOBALS['currentUser'];
        $checkUserQuery = "SELECT `account_type` FROM `users` WHERE `id` = ".$currentUser;
        $checkUserResult = mysqli_query($db, $checkUserQuery);
        $exists = mysqli_num_rows($checkUserResult);
        $accountType = mysqli_fetch_assoc($checkUserResult)['account_type'];
        if (!empty($exists)) {
            //edit user
        }
    }

    function createArtist($postData)
    {
        if (
             !empty($postData['name']) &&
             !empty($postData['description'])
         ) {
            $db = $GLOBALS['db'];
            $checkArtistExistsQuery = "SELECT `name` FROM `artists` WHERE `deleted` = 0 AND `name` = '".$postData['name']."'";
            $checkArtistExistsResult = mysqli_query($db, $checkArtistExistsQuery);
            $artistExists = mysqli_num_rows($checkArtistExistsResult);
            if (empty($artistExists)) {
                $validKeys = ['name','description'];
                foreach ($postData as $key=>$value) {
                    if (in_array($key, $validKeys)) {
                        $postKeys[] = "`".$key."`";
                        $postValues[] = "'".$value."'";
                    }
                }
                $thirtyDaysAgo = time() - (1);
                $getDeletedArtistsQuery = "SELECT * FROM `artists` WHERE `deleted` = 1";
                $getDeletedArtistsResult = mysqli_query($db, $getDeletedArtistsQuery);
                while ($row = mysqli_fetch_assoc($getDeletedArtistsResult)) {
                    if (!empty($row['deleted_timestamp']) && (int)$row['deleted_timestamp'] <= $thirtyDaysAgo) {
                        $idToRecycle = "'".$row['id']."'";
                        break;
                    }
                }

                if (isset($idToRecycle)) {
                    $postKeys[] = '`deleted`';
                    $postValues[] = 0;
                    $postKeys[] = '`deleted_timestamp`';
                    $postValues[] = 0;
                    $setValue = "";

                    foreach ($postKeys as $i=>$key) {
                        $setValue .= $postKeys[$i]." = ".$postValues[$i].", ";
                    }
                    $setValue = rtrim($setValue, ', ');
                    $recycleArtistQuery = "UPDATE `artists` SET ".$setValue." WHERE `id` = ".$idToRecycle;
                    $recycleArtistResult = mysqli_query($db, $recycleArtistQuery);
                } else {
                    $postArtistQuery = 'INSERT INTO `artists` ('.implode(", ", $postKeys).') VALUES ('.implode(", ", $postValues).')';
                    // echo $postArtistQuery;
                    $postArtistResult = mysqli_query($db, $postArtistQuery);
                }
                $getUserQuery = "SELECT * FROM `artists` WHERE `deleted` = 0 AND `name` = '".$postData['name']."'";
                $getUserResult = mysqli_query($db, $getUserQuery);
                $row = mysqli_fetch_assoc($getUserResult);
                header("Content-Type: application/json");
                echo json_encode($row);
            // header("HTTP/1.0 201 Created");
                // response(201, "Created Artist");
            } else {
                header("HTTP/1.0 409 Conflict");
                response(409, "Artist name already in use", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "name, description cannot be blank", true);
        }
    }

    function getAllArtists()
    {
        $db = $GLOBALS['db'];
        $getArtistsQuery = "SELECT * FROM `artists` WHERE `deleted` = 0 ORDER BY name ASC";
        $getArtistsResult = mysqli_query($db, $getArtistsQuery);
        $data = [];
        while ($row = mysqli_fetch_assoc($getArtistsResult)) {
            array_push($data, $row);
        }
        header("Content-Type: application/json");
        echo json_encode($data);
    }

    function getArtist($artistId)
    {
        $db = $GLOBALS['db'];
        $getArtistQuery = "SELECT * FROM `artists` WHERE `deleted` = 0  AND `id` = ".$artistId;
        $getArtistResult = mysqli_query($db, $getArtistQuery);
        header("Content-Type: application/json");
        echo json_encode(mysqli_fetch_assoc($getArtistResult));
    }

    function editArtist($artistId, $postData)
    {
        $db = $GLOBALS['db'];
        $getArtistQuery = "SELECT `id` FROM `artists` WHERE `deleted` = 0 AND `id` = ".$artistId;
        $getArtistResult = mysqli_query($db, $getArtistQuery);
        $artistExists = mysqli_num_rows($getArtistResult);
        if (!empty($artistExists)) {
            $postKeys = [];
            $postValues = [];

            $invalidKeys = ['id', 'deleted', 'deleted_timestamp'];
            $validKeys = ['name','description','video_links'];
            foreach ($postData as $key=>$value) {
                if (!in_array($key, $invalidKeys) && in_array($key, $validKeys)) {
                    $postKeys[] = "`".$key."`";
                    $postValues[] = "'".$value."'";
                }
            }
            foreach ($postKeys as $i=>$key) {
                $setValue .= $postKeys[$i]." = ".$postValues[$i].", ";
            }
            $setValue = rtrim($setValue, ', ');
            $changeQuery = "UPDATE `artists` SET ".$setValue." WHERE `deleted` = 0 AND `id` = ".$artistId;
            $changeResult = mysqli_query($db, $changeQuery);

            $getArtistQuery = "SELECT * FROM `artists` WHERE `deleted` = 0 AND `id` = ".$artistId;
            $getArtistResult = mysqli_query($db, $getArtistQuery);
            $row = mysqli_fetch_assoc($getArtistResult);
            header("Content-Type: application/json");
            echo json_encode($row);
        } else {
            header("HTTP/1.0 404 Not Found");
            response(404, "Artist not found", true);
        }
    }

    function getMe($bearerToken)
    {
        $db = $GLOBALS['db'];
        $getUsersQuery = "SELECT * FROM `users` WHERE `token` = '".$bearerToken."'";
        $getUsersResult = mysqli_query($db, $getUsersQuery);
        $row = mysqli_fetch_assoc($getUsersResult);
        header("Content-Type: application/json");
        echo json_encode($row);
    }

    function createAlbum($postData)
    {
        if (
              !empty($postData['title']) &&
              !empty($postData['artist']) &&
              !empty($postData['tracklist']) &&
              !empty($postData['year'])
          ) {
            $db = $GLOBALS['db'];
            $getAlbumQuery = "SELECT `id` FROM `albums` WHERE `deleted` = 0 AND `title` = '".$postData['title']."' AND `artist` = ".$postData['artist'];
            $getAlbumResult = mysqli_query($db, $getAlbumQuery);
            $albumExists = mysqli_num_rows($getAlbumResult);
            // print_r(mysqli_fetch_assoc($getAlbumResult));
            // die();
            // response(200, $getAlbumQuery." - ".$albumExists, true);
            if (empty($albumExists)) {
                $validKeys = ['title','artist','tracklist','year'];
                foreach ($postData as $key=>$value) {
                    if (in_array($key, $validKeys)) {
                        $postKeys[] = "`".$key."`";
                        $postValues[] = "'".$value."'";
                    }
                }
                $thirtyDaysAgo = time() - (1);
                $getDeletedAlbumsQuery = "SELECT * FROM `albums` WHERE `deleted` = 1";
                $getDeletedAlbumsResult = mysqli_query($db, $getDeletedAlbumsQuery);
                while ($row = mysqli_fetch_assoc($getDeletedAlbumsResult)) {
                    if (!empty($row['deleted_timestamp']) && (int)$row['deleted_timestamp'] <= $thirtyDaysAgo) {
                        $idToRecycle = "'".$row['id']."'";
                        break;
                    }
                }

                //////////
                // CHECK IF QUERY WORKED - IF (QUERY){}//
                /////////

                $isDone = false;

                if (isset($idToRecycle)) {
                    $postKeys[] = '`deleted`';
                    $postValues[] = 0;
                    $postKeys[] = '`deleted_timestamp`';
                    $postValues[] = 0;
                    $setValue = "";

                    foreach ($postKeys as $i=>$key) {
                        $setValue .= $postKeys[$i]." = ".$postValues[$i].", ";
                    }
                    $setValue = rtrim($setValue, ', ');
                    $recycleAlbumQuery = "UPDATE `albums` SET ".$setValue." WHERE `id` = ".$idToRecycle;
                    // $recycleAlbumResult = mysqli_query($db, $recycleAlbumQuery);
                    if (mysqli_query($db, $recycleAlbumQuery)) {
                        $isDone = true;
                    }
                } else {
                    $postAlbumQuery = 'INSERT INTO `albums` ('.implode(", ", $postKeys).') VALUES ('.implode(", ", $postValues).')';
                    // $postAlbumResult = mysqli_query($db, $postAlbumQuery);
                    if (mysqli_query($db, $postAlbumQuery)) {
                        $isDone = true;
                    }
                }

                if ($isDone) {
                    $getArtistIdQuery = "SELECT `id` FROM `albums` WHERE `deleted` = 0 AND `title` = '".$postData['title']."'";
                    $getArtistIdResult = mysqli_query($db, $getArtistIdQuery);
                    $lastId = mysqli_fetch_assoc($getArtistIdResult)['id'];

                    $getArtistQuery = "SELECT `albums` FROM `artists` WHERE `deleted` = 0 AND `id` = ".$postData['artist'];
                    $getArtistResult = mysqli_query($db, $getArtistQuery);
                    $artistAlbums = mysqli_fetch_assoc($getArtistResult)['albums'];

                    if (!empty($artistAlbums)) {
                        $postAlbumQuery = "UPDATE `artists` SET `albums` = '".$artistAlbums.",".$lastId."' WHERE `id` = ".$postData['artist'];
                        $postAlbumResult = mysqli_query($db, $postAlbumQuery);
                    } else {
                        $postAlbumQuery = "UPDATE `artists` SET `albums` = '".$lastId."' WHERE `id` = ".$postData['artist'];
                        $postAlbumResult = mysqli_query($db, $postAlbumQuery);
                    }
                    $getAlbumQuery = "SELECT * FROM `albums` WHERE `deleted` = 0 AND `id` = ".$lastId;
                    $getAlbumResult = mysqli_query($db, $getAlbumQuery);
                    $row = mysqli_fetch_assoc($getAlbumResult);
                    header("Content-Type: application/json");
                    echo json_encode($row);
                }
            } else {
                header("HTTP/1.0 409 Conflict");
                response(409, "This album already exists", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "Title, artist, year and tracklist cannot be blank", true);
        }
    }

    function getAllAlbums()
    {
        $db = $GLOBALS['db'];
        $getAlbumsQuery = "SELECT * FROM `albums` WHERE `deleted` = 0";
        $getAlbumsResult = mysqli_query($db, $getAlbumsQuery);
        $data = [];
        while ($row = mysqli_fetch_assoc($getAlbumsResult)) {
            array_push($data, $row);
        }
        header("Content-Type: application/json");
        echo json_encode($data);
    }


    function getAlbum($albumId)
    {
        $db = $GLOBALS['db'];
        $getAlbumsQuery = "SELECT * FROM `albums` WHERE `deleted` = 0  AND `id` = ".$albumId;
        $getAlbumsResult = mysqli_query($db, $getAlbumsQuery);
        $row = mysqli_fetch_assoc($getAlbumsResult);
        header("Content-Type: application/json");
        echo json_encode($row);
    }

    function editAlbum($albumId, $postData)
    {
        $db = $GLOBALS['db'];
        $checkAlbumQuery = "SELECT `id` FROM `albums` WHERE `id` = ".$albumId;
        $checkAlbumResult = mysqli_query($db, $checkAlbumQuery);
        $exists = mysqli_num_rows($checkAlbumResult);
        if (!empty($exists)) {
            $postKeys = [];
            $postValues = [];

            $invalidKeys = ['id', 'deleted', 'deleted_timestamp'];
            $validKeys = ['title','year','artist','tracklist'];
            foreach ($postData as $key=>$value) {
                if (!in_array($key, $invalidKeys) && in_array($key, $validKeys)) {
                    $postKeys[] = "`".$key."`";
                    $postValues[] = "'".$value."'";
                }
            }
            foreach ($postKeys as $i=>$key) {
                $setValue .= $postKeys[$i]." = ".$postValues[$i].", ";
            }
            $setValue = rtrim($setValue, ', ');
            $changeQuery = "UPDATE `albums` SET ".$setValue." WHERE `deleted` = 0 AND `id` = ".$albumId;
            $changeResult = mysqli_query($db, $changeQuery);

            $getAlbumQuery = "SELECT * FROM `albums` WHERE `deleted` = 0 AND `id` = ".$albumId;
            $getAlbumResult = mysqli_query($db, $getAlbumQuery);
            $row = mysqli_fetch_assoc($getAlbumResult);
            header("Content-Type: application/json");
            echo json_encode($row);
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "Album doesn't exist", true);
        }
    }

    function showAllAlbumsForThisArtist($ArtistID)
    {
        // $db = $GLOBALS['db'];
        // $albumQuery = "SELECT * FROM `albums` WHERE `deleted` = '0' AND `artist` = ".$ArtistID;
        // $albumResult = mysqli_query($db, $albumQuery);
        // $rowsExist = mysqli_num_rows($albumResult);
        // // if (mysqli_query($db, $albumQuery)) {
        // //     echo "true";
        // // }
        // if (!empty($rowsExist)) {
        //     $row = mysqli_fetch_assoc($albumResult);
        //     header("Content-Type: application/json");
        //     echo json_encode($row);
        // } else {
        //     header("HTTP/1.0 400 Bad Request");
        //     response(400, "Album doesn't exist", true);
        // }

        $db = $GLOBALS['db'];
        $getAlbumsQuery = "SELECT * FROM `albums` WHERE `deleted` = 0 AND `artist` = ".$ArtistID;
        $getAlbumsResult = mysqli_query($db, $getAlbumsQuery);
        $data = [];
        while ($row = mysqli_fetch_assoc($getAlbumsResult)) {
            array_push($data, $row);
        }
        header("Content-Type: application/json");
        echo json_encode($data);
    }
