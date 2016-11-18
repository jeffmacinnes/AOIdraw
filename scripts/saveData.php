<?php
$subjID = $_POST['subjID'];
$imgNum = $_POST['imgNum'];
$AOIname = $_POST['AOIname'];
$filePath = "../data/{$subjID}_img{$imgNum}_{$AOIname}.txt";
$outputFile = fopen($filePath, "w");
$AOIdata = $_POST['AOIdata'];
fwrite($outputFile, $AOIdata);

//$outputFile = fopen("../test.txt", "w");
//fwrite($outputFile, $filePath);
fclose($outputFile);
?>