<?php

    //check if administrator is logged in
    session_start();
    if (!isset($_SESSION["loggedin"])) {
        header('Location: ./login.php');
        die();
    }

    include_once("includes/dbh.inc.php");

    if (isset($_GET["formSearch"]) && isset($_GET["type"]) && isset($_GET["query"])) {

        $type = $_GET["type"];
        $query = $_GET["query"];

        $sql = "SELECT * FROM appointment";

        if ($query != "") {
            $mappings = array("Appointment ID"=>"id", "Client ID"=>"clientId", "Healer ID"=>"healerID", "Service ID"=>"serviceId", "Location"=>"location", "Start Time"=>"startTime", "End Time"=>"endTime");
            $type = $mappings[$type];
            $sql = "SELECT * FROM appointment WHERE $type LIKE '%$query%'";
        }

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {

            $rows = "";
            $count = 0;

            $mapClientIdsToNames = array();
            $mapHealerIdsToNames = array();

            while ($row = $result->fetch_assoc()) {

                $clientId = $row["clientId"];

                if (!array_key_exists($clientId, $mapClientIdsToNames)) {
                
                    $sql2 = "SELECT name FROM client WHERE id=$clientId";
                    $result2 = $conn->query($sql2);
                    if ($result2->num_rows > 0) {
                        $row2 = $result2->fetch_assoc();
                        $mapClientIdsToNames[$clientId] = $row2["name"];
                    }

                }

                $healerId = $row["healerId"];

                if (!array_key_exists($healerId, $mapHealerIdsToNames)) {

                    $sql3 = "SELECT name FROM healer WHERE id=$healerId";
                    $result3 = $conn->query($sql3);
                    if ($result3->num_rows > 0) {
                        $row3 = $result3->fetch_assoc();
                        $mapHealerIdsToNames[$healerId] = $row3["name"];
                    }

                }

                $count++;
                $rows .= "<tr><td><input type='checkbox' id='checkbox$count'></td><td>" . $row["id"] . "</td><td>" . $clientId . " (" . $mapClientIdsToNames[$clientId] . ")</td><td>" . $healerId . " (" . $mapHealerIdsToNames[$healerId] . ")</td><td>" . $row["serviceId"] . "</td><td>" . $row["location"] . "</td><td>" . $row["startTime"] . "</td><td>" . $row["endTime"] . "</td></tr>";
            }

        } else {
            $rows = "<tr><td colspan='8'>No results</td></tr>";
        }

        $conn->close();

    } else if (isset($_GET["formRemove"]) && isset($_GET["hidden"]) && $_GET["hidden"] != "") {

        $ids = $_GET["hidden"];

        $sql = "DELETE FROM appointment WHERE id IN($ids)";

        if ($conn->query($sql) === FALSE) {
            echo "Error deleting record: " . $conn->error;
        }

        $conn->close();
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
        <h1>Administrator Dashboard</h1>
        <nav>
            <ul>
                <li><a href="client.php">Client</a></li>
                <li><a href="healer.php">Healer</a></li>
                <li id="selected-tab"><a href="appointment.php">Appointment</a></li>
                <li><a href="transaction.php">Transaction</a></li>
                <li><a href="service.php">Service</a></li>
                <li><a href="review.php">Review</a></li>
            </ul>
        </nav>
        <div id="container">
            <div id="top-bar">
                <div id="top-bar-query">
                    <form action="appointment.php" method="get">
                        <select name="type">
                            <option name="id" <?php if (isset($type) && $type == "id") { echo("selected"); } ?>>Appointment ID</option>
                            <option name="clientId" <?php if (isset($type) && $type == "clientId") { echo("selected"); } ?>>Client ID</option>
                            <option name="healerId" <?php if (isset($type) && $type == "healerId") { echo("selected"); } ?>>Healer ID</option>
                            <option name="serviceId" <?php if (isset($type) && $type == "serviceId") { echo("selected"); } ?>>Service ID</option>
                            <option name="location" <?php if (isset($type) && $type == "location") { echo("selected"); } ?>>Location</option>
                            <option name="startTime" <?php if (isset($type) && $type == "startTime") { echo("selected"); } ?>>Start Time</option>
                            <option name="selected" <?php if (isset($type) && $type == "endTime") { echo("selected"); } ?>>End Time</option>
                        </select>
                        <input type="text" name="query" value="<?php if (isset($query)) { echo($query); }?>">
                        <input id="btn-search" type="submit" name="formSearch" value="Search">
                    </form>
                </div>
                <div id="top-bar-toggles">
                    <button id="btn-clear">Clear</button>
                    <form  id="formRemove" action="appointment.php" method="get">
                        <input id="btn-remove" type="submit" name="formRemove" value="Remove">
                        <input id="hiddenRemove" type="hidden" name="hidden">
                    </form>
                </div>
            </div>
            <div class="empty"></div>
            <table id="table-results">
                <thead>
                    <tr>
                        <th></th>
                        <th>Appointment ID</th>
                        <th>Client ID</th>
                        <th>Healer ID</th>
                        <th>Service ID</th>
                        <th>Location</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        if (isset($rows)) {
                            echo($rows);
                        }
                    ?>
                </tbody>
            </table>
        </div>
    </body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="scripts/script_other.js?v=<?php echo time(); ?>"></script>
</html>