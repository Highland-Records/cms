<?php

require("./dbconfig.php");

function uploadProfileImage($files, $post, $bearerToken = "")
{
    $fileExtension = array_pop(explode(".", $files["fileToUpload"]["name"]));
    // print_r(explode(".", $files["fileToUpload"]["name"]));
    $files["fileToUpload"]["name"] = uniqid('');
    $db = $GLOBALS['db'];
    $target_dir = "images/";
    $target_file = $target_dir . uniqid('') . ".".$fileExtension;
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

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 1) {
        if (move_uploaded_file($files["fileToUpload"]["tmp_name"], $target_file)) {
            $getProfileImgQuery = "SELECT `profile_img` FROM `users` WHERE `deleted` = 0 AND `id` = ".$post['id'];
            $getProfileImgResult = mysqli_query($db, $getProfileImgQuery);
            $profileImg = mysqli_fetch_assoc($getProfileImgResult)['profile_img'];
            if (!empty($profileImg)) {
                array_map('unlink', glob("images/".$profileImg));
            }
            $profileURL = explode("/", $target_file)[1];
            $postImgUrlQuery = "UPDATE `users` SET `profile_img` = '". $profileURL."' WHERE `deleted` = 0 AND `id` = ".$post['id'];
            $postImgUrlResult = mysqli_query($db, $postImgUrlQuery);
            // if profile_img != blank then array_map('unlink', glob("some/dir/*.txt"));
            header("HTTP/1.0 201 Created");
            response(201, "File uploaded");
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File failed to upload", true);
        }
    }
}
function uploadAlbumArt($files, $post)
{
    $fileExtension = array_pop(explode(".", $files["album_art"]["name"]));
    $files["album_art"]["name"] = uniqid('');
    $db = $GLOBALS['db'];
    $target_dir = "images/albums/";
    $target_file = $target_dir . uniqid('') . ".".$fileExtension;
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    // Check if image file is a actual image or fake image
    if (isset($post["submit"])) {
        $check = getimagesize($files["album_art"]["tmp_name"]);
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
    if ($files["album_art"]["size"] > 500000) {
        header("HTTP/1.0 400 Bad Request");
        response(400, "File too large", true);
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 1) {
        if (move_uploaded_file($files["album_art"]["tmp_name"], $target_file)) {
            $getAlbumArtQuery = "SELECT `album_art` FROM `albums` WHERE `deleted` = 0 AND `id` = ".$post['id'];
            $getAlbumArtResult = mysqli_query($db, $getAlbumArtQuery);
            $albumArt = mysqli_fetch_assoc($getAlbumArtResult)['album_art'];
            if (!empty($albumArt)) {
                array_map('unlink', glob("images/albums/".$albumArt));
            }
            $albumURL = explode("/", $target_file)[2];
            $postImgUrlQuery = "UPDATE `albums` SET `album_art` = '". $albumURL."' WHERE `deleted` = 0 AND `id` = ".$post['id'];
            $postImgUrlResult = mysqli_query($db, $postImgUrlQuery);
            // if profile_img != blank then array_map('unlink', glob("some/dir/*.txt"));
            header("HTTP/1.0 201 Created");
            response(201, "File uploaded: ".$albumURL);
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File failed to upload", true);
        }
    }
}

function uploadArtistProfile($files, $post)
{
    $fileExtension = array_pop(explode(".", $files["profile_img"]["name"]));
    $files["profile_img"]["name"] = uniqid('');
    $db = $GLOBALS['db'];
    $target_dir = "images/artists/";
    $target_file = $target_dir . uniqid('') . ".".$fileExtension;
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    // Check if image file is a actual image or fake image
    if (isset($post["submit"])) {
        $check = getimagesize($files["profile_img"]["tmp_name"]);
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
    if ($files["profile_img"]["size"] > 500000) {
        header("HTTP/1.0 400 Bad Request");
        response(400, "File too large", true);
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 1) {
        if (move_uploaded_file($files["profile_img"]["tmp_name"], $target_file)) {
            $getProfileImgQuery = "SELECT `profile_img` FROM `artists` WHERE `id` = ".$post['id'];
            $getProfileImgResult = mysqli_query($db, $getProfileImgQuery);
            $profileImg = mysqli_fetch_assoc($getProfileImgResult)['profile_img'];
            if (!empty($profileImg)) {
                array_map('unlink', glob("images/artists/".$profileImg));
            }
            $profileURLArray = explode("/", $target_file);
            $profileURL = $profileURLArray[count($profileURLArray)-1];
            $postImgUrlQuery = "UPDATE `artists` SET `profile_img` = '". $profileURL."' WHERE `id` = ".$post['id'];
            $postImgUrlResult = mysqli_query($db, $postImgUrlQuery);

            response(200, "File uploaded");
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File failed to upload", true);
        }
    }
}

function uploadBanner($files, $post)
{
    $fileExtension = array_pop(explode(".", $files["banner_img"]["name"]));
    $files["banner_img"]["name"] = uniqid('');
    $db = $GLOBALS['db'];
    $target_dir = "images/banners/";
    $target_file = $target_dir . uniqid('') . ".".$fileExtension;
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    // Check if image file is a actual image or fake image
    if (isset($post["submit"])) {
        $check = getimagesize($files["banner_img"]["tmp_name"]);
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
    if ($files["banner_img"]["size"] > 500000) {
        header("HTTP/1.0 400 Bad Request");
        response(400, "File too large", true);
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 1) {
        if (move_uploaded_file($files["banner_img"]["tmp_name"], $target_file)) {
            $getProfileImgQuery = "SELECT `banner_img` FROM `artists` WHERE `id` = ".$post['id'];
            $getProfileImgResult = mysqli_query($db, $getProfileImgQuery);
            $profileImg = mysqli_fetch_assoc($getProfileImgResult)['banner_img'];
            if (!empty($profileImg)) {
                array_map('unlink', glob("images/banners/".$profileImg));
            }
            $profileURLArray = explode("/", $target_file);
            $profileURL = $profileURLArray[count($profileURLArray)-1];
            $postImgUrlQuery = "UPDATE `artists` SET `banner_img` = '". $profileURL."' WHERE `deleted` = 0 AND `id` = ".$post['id'];
            $postImgUrlResult = mysqli_query($db, $postImgUrlQuery);
            // if profile_img != blank then array_map('unlink', glob("some/dir/*.txt"));

            response(200, "File uploaded", true);
        // response(200, "File uploaded");
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File failed to upload", true);
        }
    }
}

function uploadVideo($files, $post)
{
    $allowedExts = array("jpg", "jpeg", "gif", "png", "mp3", "mp4", "wma");
    $extension = pathinfo($files['file']['name'], PATHINFO_EXTENSION);

    // print_r($files);

    if ((($files["file"]["type"] == "video/mp4")) && in_array($extension, $allowedExts)) {
        if ($files["file"]["error"] > 0) {
            echo "Return Code: " . $files["file"]["error"] . "<br />";
        } else {
            // echo $files["file"]["name"];
            $fileExtension = array_pop(explode(".", $files["file"]["name"]));
            $files["file"]["name"] = uniqid() . "." . $fileExtension;
            if (file_exists("videos/" . $files["file"]["name"])) {
                echo $files["file"]["name"] . " already exists. ";
            } else {
                if (move_uploaded_file($files["file"]["tmp_name"], "videos/" . $files["file"]["name"])) {
                    $db = $GLOBALS['db'];
                    $getVideoUrlQuery = "SELECT `video_links` FROM `artists` WHERE `id` = ".$post['id'];
                    $getVideoUrlResult = mysqli_query($db, $getVideoUrlQuery);
                    $videoLinks = mysqli_fetch_assoc($getVideoUrlResult)['video_links'];
                    // $profileURL = explode("/", $target_file)[1];
                    $videoURL = $files["file"]["name"];

                    if (empty($videoLinks)) {
                        $uploadvideoLinks = "'".$videoURL."'";
                    } else {
                        $uploadvideoLinks = "'".$videoLinks.",".$videoURL."'";
                    }

                    $postvideoLinksQuery = "UPDATE `artists` SET `video_links` = ".$uploadvideoLinks." WHERE `id` = ".$post['id'];
                    // $postvideoLinksResult = mysqli_query($db, $postvideoLinksQuery);

                    if (mysqli_query($db, $postvideoLinksQuery)) {
                        response(200, "Uploaded Video", true);
                    }
                }
            }
        }
    } else {
        echo "Invalid file";
    }




    // $files["video"]["name"] = uniqid('');
    // $db = $GLOBALS['db'];
    // $target_dir = "videos/";
    // //$target_file = $target_dir . basename($files["video"]["name"]);
    // $target_file = $target_dir . uniqid('') . ".mp4";
    // $uploadOk = 1;
    // $videoFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    //
    // // Check if file already exists
    // if (file_exists($target_file)) {
    //     header("HTTP/1.0 400 Bad Request");
    //     response(400, "File already exists", true);
    //     $uploadOk = 0;
    // }
    // // // Check file size
    // // if ($files["video"]["size"] > 5000000000) {
    // //     header("HTTP/1.0 400 Bad Request");
    // //     response(400, "File too large", true);
    // //     $uploadOk = 0;
    // // }
    // // Allow certain file formats
    // if ($videoFileType != "mp4") {
    //     header("HTTP/1.0 400 Bad Request");
    //     response(400, "MP4 files only", true);
    //     $uploadOk = 0;
    // }
    // // Check if $uploadOk is set to 0 by an error
    // if ($uploadOk == 1) {
    //     // echo "tmp";
    //     print_r($files);
    //     // echo "tar fil";
    //     // print_r($target_file);
    //     // move_uploaded_file($files["video"]["tmp_name"], $target_file);
    //     // if (move_uploaded_file($files["video"]["tmp_name"], $target_file)) {
    //     //     echo "The file ". basename($files["video"]["name"]). " has been uploaded.";
    //     //     $getVideoUrlQuery = "SELECT `video_links` FROM `artists` WHERE `id` = ".$post['id'];
    //     //     $getVideoUrlResult = mysqli_query($db, $getVideoUrlQuery);
    //     //     $videoLinks = mysqli_fetch_assoc($getVideoUrlResult)['video_links'];
    //     //     // $profileURL = explode("/", $target_file)[1];
    //     //     $videoURL = explode("/", $target_file)[1];
    //    //
    //     //     if (empty($videoLinks)) {
    //     //         $uploadvideoLinks = "'".$videoURL."'";
    //     //     } else {
    //     //         $uploadvideoLinks = "'".$videoLinks.",".$videoURL."'";
    //     //     }
    //    //
    //     //     $postvideoLinksQuery = "UPDATE `artists` SET `video_links` = ".$uploadvideoLinks." WHERE `id` = ".$post['id'];
    //     //     $postvideoLinksResult = mysqli_query($db, $postvideoLinksQuery);
    //     // } else {
    //     //     header("HTTP/1.0 400 Bad Request");
    //     //     response(400, "File failed to upload", true);
    //     // }
    // }
}
