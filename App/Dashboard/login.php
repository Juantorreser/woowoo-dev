<?php

if (isset($_POST["submit"])) {

    $error = false;

    if (strlen($_POST["email"]) > 0 && strlen($_POST["password"]) > 0) {

    include_once("includes/dbh.inc.php");

    $sql = "SELECT * FROM administrator WHERE email=? AND password=?";
    $result = getResults($conn, $sql);
    if ($result->num_rows > 0) {
        session_start();
        $_SESSION["loggedin"] = TRUE;
        header('Location: /dashboard/client.php');
    } else {
        $error = true;
        $errormessage = "Access denied: administrator with this email and password doesn't exist.";
    }
    $conn->close();

    } else {
        $error = true;
        $errormessage = "Input error: please enter a valid email and password.";
    }
}

function getResults($conn, $sql) {
    $stmt = $conn->prepare($sql); 
    $stmt->bind_param("ss", $email, $password);
    $email = $_POST["email"];
    $password = $_POST["password"];
    $stmt->execute();
    $result = $stmt->get_result();
    return $result;
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>WooWooNetwork</title>
        <link rel="stylesheet" type="text/css" href="css/style.css"/>
    </head>
    <body>
        <div>
            <form id="admin-login-form" action="login.php" method="post">
                <h1>Administrator Login</h1>
                <input id="email-box" type="email" placeholder="Email" name="email" minlength="8"><br>
                <input id="password-box" type="password" placeholder="Password" name="password" minlength="8"><br>
                <input type="submit" value="Login" name="submit">
                <p><?php if ((isset($_POST["submit"])) && $error && $errormessage) { echo($errormessage); } ?></p>
            </form>
        </div>
    </body>
</html>