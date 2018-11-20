<?php
    require("functions.php");
    $headers = getallheaders();
    $bearerToken = getBearerToken($headers['Authorization']);
    $urls = explode("/", $_SERVER['REDIRECT_URL']);
    $endpoint = $urls[2];
    $endpointId = $urls[3];
    $command = $urls[4];
    $rMethod = strtolower($_SERVER['REQUEST_METHOD']);
    if ($endpoint === "login") {
        if ($rMethod === 'post') {
            login($_POST['username'], $_POST['password']);
        } else {
            header("HTTP/1.0 403 Forbidden");
            response(403, "Invalid Request Method", true);
        }
    } elseif ($endpoint === "logout") {
        if (authorised($bearerToken)) {
            if ($rMethod === 'post') {
                logout($_POST['id'], $bearerToken);
            } else {
                header("HTTP/1.0 403 Forbidden");
                response(403, "Invalid Request Method", true);
            }
        } else {
            header("HTTP/1.0 401 Unauthorized");
            response(401, "You aren't authorised to do this", true);
        }
    } elseif ($endpoint === "upload") {
        if ($endpointId === "profile") {
            uploadProfileImage($_FILES, $_POST);
        } elseif ($endpointId === "video") {
            uploadVideo($_FILES, $_POST);
        }
    } elseif ($endpoint === "users") {
        if (authorised($bearerToken) == true) {
            if (empty($endpointId)) {
                if ($rMethod === 'post') {
                    createUser($_POST);
                } elseif ($rMethod === 'get') {
                    getAllUsers();
                } else {
                    header("HTTP/1.0 403 Forbidden");
                    response(403, "Invalid Request Method", true);
                }
            } elseif (is_numeric($endpointId)) {
                if ($command === 'delete') {
                    if ($rMethod === 'post') {
                        deleteRow($endpointId, $endpoint);
                    } else {
                        header("HTTP/1.0 403 Forbidden");
                        response(403, "Invalid Request Method", true);
                    }
                } elseif ($command === 'changepassword') {
                    if ($rMethod === 'post') {
                        changePassword($endpointId, $_POST['password'], $_POST['new_password']);
                    } else {
                        header("HTTP/1.0 403 Forbidden");
                        response(403, "Invalid Request Method", true);
                    }
                } elseif (empty($command)) {
                    if ($rMethod === 'get') {
                        getUser($endpointId);
                    } elseif ($rMethod === 'post') {
                        if (!empty($_POST)) {
                            editUser($enpointId, $_POST);
                        } else {
                            header("HTTP/1.0 400 Bad Request");
                            response(400, "No data has been posted to change");
                        }
                    } else {
                        header("HTTP/1.0 403 Forbidden");
                        response(403, "Invalid Request Method", true);
                    }
                } else {
                    header("HTTP/1.0 404 Not Found");
                }
            } else {
                header("HTTP/1.0 404 Not Found");
            }
        } else {
            header("HTTP/1.0 401 Unauthorized");
            response(401, "You aren't authorised to do this", true);
        }
    } elseif ($endpoint === "authorised") {
        if (authorised($bearerToken)) {
            header("HTTP/1.0 200 OK");
            response(200, "Authorised", true);
        } else {
            header("HTTP/1.0 401 Unauthorized");
            response(401, "Unauthorised", true);
        }
    } elseif ($endpoint === "artists") {
        if (authorised($bearerToken)) {
            if (empty($endpointId)) {
                if ($rMethod === 'post') {
                    createArtist($_POST);
                } elseif ($rMethod === 'get') {
                    getAllArtists();
                } else {
                    header("HTTP/1.0 403 Forbidden");
                    response(403, "Invalid Request Method", true);
                }
            } elseif (is_numeric($endpointId)) {
                if ($command === 'delete') {
                    if ($rMethod === 'post') {
                        deleteRow($endpointId, $endpoint);
                    } else {
                        header("HTTP/1.0 403 Forbidden");
                        response(403, "Invalid Request Method", true);
                    }
                } elseif (empty($command)) {
                    if ($rMethod === 'get') {
                        getArtist($endpointId);
                    } elseif ($rMethod === 'post') {
                        if (!empty($_POST)) {
                            editArtist($enpointId, $_POST);
                        } else {
                            header("HTTP/1.0 400 Bad Request");
                            response(400, "No data has been posted to change");
                        }
                    } else {
                        header("HTTP/1.0 403 Forbidden");
                        response(403, "Invalid Request Method", true);
                    }
                } else {
                    header("HTTP/1.0 404 Not Found");
                }
            } else {
                header("HTTP/1.0 404 Not Found");
            }
        } else {
            header("HTTP/1.0 401 Unauthorized");
            response(401, "Unauthorised", true);
        }
    } else {
        header("HTTP/1.0 404 Not Found");
    }
