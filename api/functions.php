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

    function uploadProfileImage($files, $post)
    {
        $fileExtension = explode($files["fileToUpload"]["name"])[1];
        $files["fileToUpload"]["name"] = uniqid('');
        $db = $GLOBALS['db'];
        $target_dir = "images/";
        $target_file = $target_dir . uniqid('') . "." . $fileExtension;

        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        // Check if image file is a actual image or fake image
        if (isset($post["submit"])) {
            $check = getimagesize($files["fileToUpload"]["tmp_name"]);
            // print_r($check);
            if ($check !== false) {
                $uploadOk = 1;
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Not an Image", true);
                $uploadOk = 0;
            }
        }
        if ($check[0] > 500 || $check[1] > 500) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File too large, must be 500 x 500", true);
            $uploadOk = 0;
        }
        // Check if file already exists
        if (file_exists($target_file)) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File already exists", true);
            $uploadOk = 0;
        }
        // Check file size
        if ($files["fileToUpload"]["size"] > 500000) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File too large", true);
            $uploadOk = 0;
        }
        // Allow certain file formats
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif") {
            header("HTTP/1.0 400 Bad Request");
            response(400, "JPG, JPEG, PNG & GIF files only", true);
            $uploadOk = 0;
        }
        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 1) {
            if (move_uploaded_file($files["fileToUpload"]["tmp_name"], $target_file)) {
                echo "The file ". basename($files["fileToUpload"]["name"]). " has been uploaded.";
                $profileURL = $files["fileToUpload"]["name"].".".$fileExtension;
                $postImgUrlQuery = "UPDATE `users` SET `profile_img` = '".$profileURL."' WHERE `id` = ".$post['id'];
                $postImgUrlResult = mysqli_query($db, $postImgUrlQuery);
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "File failed to upload", true);
            }
        }
    }

    function uploadBanner($files, $post)
    {
        $fileExtension = explode($files["fileToUpload"]["name"])[1];
        $files["fileToUpload"]["name"] = uniqid('');
        $db = $GLOBALS['db'];
        $target_dir = "images/banners";
        $target_file = $target_dir . uniqid('') . "." . $fileExtension;

        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        // Check if image file is a actual image or fake image
        if (isset($post["submit"])) {
            $check = getimagesize($files["fileToUpload"]["tmp_name"]);
            // print_r($check);
            if ($check !== false) {
                $uploadOk = 1;
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Not an Image", true);
                $uploadOk = 0;
            }
        }
        if ($check[0] > 500 || $check[1] > 500) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File too large, must be 500 x 500", true);
            $uploadOk = 0;
        }
        // Check if file already exists
        if (file_exists($target_file)) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File already exists", true);
            $uploadOk = 0;
        }
        // Check file size
        if ($files["fileToUpload"]["size"] > 500000) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File too large", true);
            $uploadOk = 0;
        }
        // Allow certain file formats
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif") {
            header("HTTP/1.0 400 Bad Request");
            response(400, "JPG, JPEG, PNG & GIF files only", true);
            $uploadOk = 0;
        }
        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 1) {
            if (move_uploaded_file($files["fileToUpload"]["tmp_name"], $target_file)) {
                echo "The file ". basename($files["fileToUpload"]["name"]). " has been uploaded.";
                $profileURL = $files["fileToUpload"]["name"].".".$fileExtension;
                $postImgUrlQuery = "UPDATE `artists` SET `banner_img` = '".$profileURL."' WHERE `id` = ".$post['id'];
                $postImgUrlResult = mysqli_query($db, $postImgUrlQuery);
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "File failed to upload", true);
            }
        }
    }

    function uploadArtistProfile($files, $post)
    {
        $fileExtension = explode($files["fileToUpload"]["name"])[1];
        $files["fileToUpload"]["name"] = uniqid('');
        $db = $GLOBALS['db'];
        $target_dir = "images/artists";
        $target_file = $target_dir . uniqid('') . "." . $fileExtension;

        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        // Check if image file is a actual image or fake image
        if (isset($post["submit"])) {
            $check = getimagesize($files["fileToUpload"]["tmp_name"]);
            // print_r($check);
            if ($check !== false) {
                $uploadOk = 1;
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Not an Image", true);
                $uploadOk = 0;
            }
        }
        if ($check[0] > 500 || $check[1] > 500) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File too large, must be 500 x 500", true);
            $uploadOk = 0;
        }
        // Check if file already exists
        if (file_exists($target_file)) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File already exists", true);
            $uploadOk = 0;
        }
        // Check file size
        if ($files["fileToUpload"]["size"] > 500000) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File too large", true);
            $uploadOk = 0;
        }
        // Allow certain file formats
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif") {
            header("HTTP/1.0 400 Bad Request");
            response(400, "JPG, JPEG, PNG & GIF files only", true);
            $uploadOk = 0;
        }
        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 1) {
            if (move_uploaded_file($files["fileToUpload"]["tmp_name"], $target_file)) {
                echo "The file ". basename($files["fileToUpload"]["name"]). " has been uploaded.";
                $profileURL = $files["fileToUpload"]["name"].".".$fileExtension;
                $postImgUrlQuery = "UPDATE `artists` SET `profile_img` = '".$profileURL."' WHERE `id` = ".$post['id'];
                $postImgUrlResult = mysqli_query($db, $postImgUrlQuery);
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "File failed to upload", true);
            }
        }
    }

    function uploadVideo($files, $post)
    {
        $files["fileToUpload"]["name"] = uniqid('');
        $db = $GLOBALS['db'];
        $target_dir = "videos/";
        //$target_file = $target_dir . basename($files["fileToUpload"]["name"]);
        $target_file = $target_dir . uniqid('') . ".mp4";
        $uploadOk = 1;
        $videoFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // Check if file already exists
        if (file_exists($target_file)) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File already exists", true);
            $uploadOk = 0;
        }
        // Check file size
        if ($files["fileToUpload"]["size"] > 5000000000) {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File too large", true);
            $uploadOk = 0;
        }
        // Allow certain file formats
        if ($videoFileType != "mp4") {
            header("HTTP/1.0 400 Bad Request");
            response(400, "MP4 files only", true);
            $uploadOk = 0;
        }
        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 1) {
            if (move_uploaded_file($files["fileToUpload"]["tmp_name"], $target_file)) {
                echo "The file ". basename($files["fileToUpload"]["name"]). " has been uploaded.";
                $getVideoUrlQuery = "SELECT `video_links` FROM `artists` WHERE `id` = ".$post['id'];
                $getVideoUrlResult = mysqli_query($db, $getVideoUrlQuery);
                $videoLinks = mysqli_fetch_assoc($getVideoUrlResult)['video_links'];
                $videoURL = $files["fileToUpload"]["name"];

                if (empty($videoLinks)) {
                    $uploadVideoLinks = "'".$videoURL.".mp4'";
                } else {
                    $uploadVideoLinks = "'".$videoLinks.",".$videoURL.".mp4'";
                }

                $postVideoLinksQuery = "UPDATE `artists` SET `video_links` = ".$uploadVideoLinks." WHERE `id` = ".$post['id'];
                $postVideoLinksResult = mysqli_query($db, $postVideoLinksQuery);
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "File failed to upload", true);
            }
        }
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

    function login($username, $password)
    {
        if (!empty($username) || !empty($password)) {
            $db = $GLOBALS['db'];
            $userQuery = "SELECT `id`,`token`,`salt` FROM `users` WHERE `username` = '".$username."'";
            $userResult = mysqli_query($db, $userQuery);
            $userExists = mysqli_num_rows($userResult);
            $userData = mysqli_fetch_assoc($userResult);
            $userId = $userData['id'];
            $userToken = $userData['token'];
            $salt = $userData['salt'];
            if (!empty($userExists)) {
                if (!empty($userToken)) {
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
                        response(400, "Invalid Password", true);
                    }
                }
            } else {
                header("HTTP/1.0 400 Bad Request");
                response(400, "Incorrect username", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "Blank username/password provided", true);
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
                // $thirtySecondsAgo = time() - (30);
                $thirtyDaysAgo = time() - (86400*30); // 86400 is one day in seconds
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
                header("HTTP/1.0 201 Created");
                response(201, "Created User");
            } else {
                header("HTTP/1.0 409 Conflict");
                response(409, "Username already in use", true);
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            if (!empty($postData['first_name'])) {
                response(400, "First name cannot be blank", true);
            } elseif (!empty($postData['last_name'])) {
                response(400, "Last name cannot be blank", true);
            } elseif (!empty($postData['password'])) {
                response(400, "Password cannot be blank", true);
            } else {
                response(400, "First Name, Last Name, Username and Password cannot be blank", true);
            }
        }
    }

    function changePassword($id, $password, $newPassword)
    {
        $db = $GLOBALS['db'];
        $checkExistsQuery = "SELECT `salt` FROM `users` WHERE `id` = ".$id;
        $checkExistsResult = mysqli_query($db, $checkExistsQuery);
        $exists = mysqli_num_rows($checkExistsResult);
        $salt = mysqli_fetch_assoc($checkExistsResult)['salt'];
        if (!empty($exists)) {
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
            }
        }
    }

    function deleteRow($id, $table)
    {
        $db = $GLOBALS['db'];
        if (!empty($id) && !empty($table)) {
            $checkExistsQuery = "SELECT `id` FROM `".$table."` WHERE `id` = ".$id;
            $checkExistsResult = mysqli_query($db, $checkExistsQuery);
            $exists = mysqli_num_rows($checkExistsResult);
            if (!empty($exists)) {
                $now = time();
                $deleteQuery = "UPDATE `".$table."` SET `deleted` = 1, `deleted_timestamp` = '".$now."' WHERE `id` = ".$id;
                $deleteResult = mysqli_query($db, $deleteQuery);
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
                // $thirtySecondsAgo = time() - (30);
                 $thirtyDaysAgo = time() - (86400*30); // 86400 is one day in seconds
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
                header("HTTP/1.0 201 Created");
                response(201, "Created Artist");
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
        $getArtistsQuery = "SELECT * FROM `artists` WHERE `deleted` = 0";
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

    function editArtist()
    {
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
