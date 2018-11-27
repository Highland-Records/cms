<?php

require("./dbconfig.php");

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