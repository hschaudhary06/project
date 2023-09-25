<?php

if($_SERVER["REQUEST_METHOD"] == "GET"){

    $response = array(
        "status" => "Get method"
    );

    http_response_code(200);
    echo json_encode($response);

}
if($_SERVER["REQUEST_METHOD"] == "POST"){

    $response = array(
        "status" => "Post method"
    );

    http_response_code(200);
    echo json_encode($response);
}
if($_SERVER["REQUEST_METHOD"] == "PUT"){

    $response = array(
        "status" => "Put method"
    );

    http_response_code(200);
    echo json_encode($response);
}
if($_SERVER["REQUEST_METHOD"] == "DELETE"){

    $response = array(
        "status" => "Delete method"
    );

    http_response_code(200);
    echo json_encode($response);

}

?>