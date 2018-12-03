<?php

require("./dbconfig.php");

function uploadProfileImage($files, $post, $bearerToken = "")
{
    $fileExtension = explode(".", $files["fileToUpload"]["name"])[1];
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

function uploadArtistProfile($files, $post)
{
    $fileExtension = explode(".", $files["profile_img"]["name"])[1];
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
    $fileExtension = explode(".", $files["banner_img"]["name"])[1];
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
    $files["video"]["name"] = uniqid('');
    $db = $GLOBALS['db'];
    $target_dir = "videos/";
    //$target_file = $target_dir . basename($files["video"]["name"]);
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
    if ($files["video"]["size"] > 5000000000) {
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
        if (move_uploaded_file($files["video"]["tmp_name"], $target_file)) {
            echo "The file ". basename($files["video"]["name"]). " has been uploaded.";
            $getVideoUrlQuery = "SELECT `video_links` FROM `artists` WHERE `id` = ".$post['id'];
            $getVideoUrlResult = mysqli_query($db, $getVideoUrlQuery);
            $videoLinks = mysqli_fetch_assoc($getVideoUrlResult)['video_links'];
            // $profileURL = explode("/", $target_file)[1];
            $videoURL = explode("/", $target_file)[1];

            if (empty($videoLinks)) {
                $uploadvideoLinks = "'".$videoURL."'";
            } else {
                $uploadvideoLinks = "'".$videoLinks.",".$videoURL."'";
            }

            $postvideoLinksQuery = "UPDATE `artists` SET `video_links` = ".$uploadvideoLinks." WHERE `id` = ".$post['id'];
            $postvideoLinksResult = mysqli_query($db, $postvideoLinksQuery);
        } else {
            header("HTTP/1.0 400 Bad Request");
            response(400, "File failed to upload", true);
        }
    }
}
