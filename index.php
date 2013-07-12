<?php
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();


$app = new \Slim\Slim();

// Load the application
$app->get('/', function () {
    require "app.php";
});

$app->get('/d/:s', function ($sss) {
    echo "Hello, dd $sss";
});
$app->run();