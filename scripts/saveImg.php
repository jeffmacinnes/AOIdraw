<?php
$subjID = $_POST['subjID'];
$imgNum = $_POST['imgNum'];
$AOIname = $_POST['AOIname'];
$filePath = "../data/{$subjID}_img{$imgNum}_{$AOIname}.png";
//$outputFile = fopen($filePath, "w");
//$AOIdata = $_POST['AOIdata'];
//fwrite($outputFile, $AOIdata);

$img = $_POST['imgDataURL'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);

//saving
file_put_contents($filePath, $fileData);

?>