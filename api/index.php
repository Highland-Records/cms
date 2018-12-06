<?php
    error_reporting(E_ALL);
    require("methods/functions.php");
    require("methods/uploads.php");
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
        if (authorised($bearerToken)) {
            if ($endpointId === "profile") {
                uploadProfileImage($_FILES, $_POST, $bearerToken);
            } elseif ($endpointId === "album") {
                uploadAlbumArt($_FILES, $_POST);
            } elseif ($endpointId === "artist") {
                if ($command === "video") {
                    // print_r($_FILES);
                    uploadVideo($_FILES, $_POST);
                } elseif ($command === "banner") {
                    uploadBanner($_FILES, $_POST);
                } elseif ($command === "profile") {
                    uploadArtistProfile($_FILES, $_POST);
                }
            }
        } else {
            header("HTTP/1.0 401 Unauthorized");
            response(401, "You aren't authorised to do this", true);
        }
    } elseif ($endpoint === "albums") {
        if (empty($endpointId)) {
            if ($rMethod === 'post') {
                if (authorised($bearerToken)) {
                    createAlbum($_POST);
                } else {
                    header("HTTP/1.0 401 Unauthorized");
                    response(401, "You aren't authorised to do this", true);
                }
            } elseif ($rMethod === 'get') {
                getAllAlbums();
            } else {
                header("HTTP/1.0 403 Forbidden");
                response(403, "Invalid Request Method", true);
            }
        } elseif (is_numeric($endpointId)) {
            if ($command === 'delete') {
                if ($rMethod === 'post') {
                    if (authorised($bearerToken)) {
                        deleteRow($endpointId, $endpoint);
                    }
                } else {
                    header("HTTP/1.0 403 Forbidden");
                    response(403, "Invalid Request Method", true);
                }
            } elseif (empty($command)) {
                if ($rMethod === 'get') {
                    getAlbum($endpointId);
                } elseif ($rMethod === 'post') {
                    if (authorised($bearerToken)) {
                        if (!empty($_POST)) {
                            editAlbum($endpointId, $_POST);
                        }
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
    } elseif ($endpoint === "users") {
        if (authorised($bearerToken)) {
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
                            header("HTTP/1.0 401 Unauthorized");
                            response(401, "You are unauthorised to do this", true);
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
    } elseif ($endpoint === "authorised") {
        if (authorised($bearerToken)) {
            header("HTTP/1.0 200 OK");
            response(200, "Authorised", true);
        } else {
            header("HTTP/1.0 401 Unauthorized");
            response(401, "Unauthorised", true);
        }
    } elseif ($endpoint === "me") {
        if (authorised($bearerToken)) {
            getMe($bearerToken);
        } else {
            header("HTTP/1.0 401 Unauthorized");
            response(401, "Unauthorised", true);
        }
    } elseif ($endpoint === "artists") {
        if (empty($endpointId)) {
            if ($rMethod === 'post') {
                if (authorised($bearerToken)) {
                    createArtist($_POST);
                } else {
                    header("HTTP/1.0 401 Unauthorized");
                    response(401, "You are unauthorised to do this", true);
                }
            } elseif ($rMethod === 'get') {
                getAllArtists();
				if($endpointId === 'albums') {
					showAllAlbumsForThisArtist($command);
				}
            } else {
                header("HTTP/1.0 403 Forbidden");
                response(403, "Invalid Request Method", true);
            }
        } elseif (is_numeric($endpointId)) {
            if ($command === 'delete') {
                if (authorised($bearerToken)) {
                    if ($rMethod === 'post') {
                        deleteRow($endpointId, $endpoint);
                    } else {
                        header("HTTP/1.0 401 Unauthorized");
                        response(401, "You are unauthorised to do this", true);
                    }
                } else {
                    header("HTTP/1.0 403 Forbidden");
                    response(403, "Invalid Request Method", true);
                }
            } elseif ($command === 'edit') {
                if ($rMethod === 'post') {
                    if (authorised($bearerToken)) {
                        editArtist($endpointId, $_POST);
                    } else {
                        header("HTTP/1.0 401 Unauthorized");
                        response(401, "You are unauthorised to do this", true);
                    }
                } else {
                    header("HTTP/1.0 403 Forbidden");
                    response(403, "Invalid Request Method", true);
                }
            } elseif (empty($command)) {
                if ($rMethod === 'get') {
                    getArtist($endpointId);
                } elseif ($rMethod === 'post') {
                    if (authorised($bearerToken)) {
                        if (!empty($_POST)) {
                            editArtist($enpointId, $_POST);
                        } else {
                            header("HTTP/1.0 400 Bad Request");
                            response(400, "No data has been posted to change");
                        }
                    } else {
                        header("HTTP/1.0 401 Unauthorized");
                        response(401, "You are unauthorised to do this", true);
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
        header("HTTP/1.0 404 Not Found");
    }
