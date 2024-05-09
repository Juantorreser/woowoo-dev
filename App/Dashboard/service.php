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

        $sql = "SELECT * FROM service";

        if ($query != "") {
            $mappings = array("Service ID"=>"id", "Healer ID"=>"healerId", "Name"=>"name", "Hourly Fee"=>"hourlyFee", "Description"=>"description");
            $type = $mappings[$type];
            $sql = "SELECT * FROM service WHERE $type LIKE '%$query%'";
        }

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {

            $rows = "";
            $count = 0;

            $mapHealerIdsToNames = array();

            while ($row = $result->fetch_assoc()) {

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
                $rows .= "<tr><td><input type='checkbox' id='checkbox$count'></td><td>" . $row["id"] . "</td><td>" . $healerId . " (" . $mapHealerIdsToNames[$healerId] . ")</td><td>" . $row["name"] . "</td><td>$" . $row["hourlyFee"] . "</td><td>" . $row["description"] . "</td></tr>";
            }

        } else {
            $rows = "<tr><td colspan='8'>No results</td></tr>";
        }

        $conn->close();

    } else if (isset($_GET["formRemove"]) && isset($_GET["hidden"]) && $_GET["hidden"] != "") {

        $ids = $_GET["hidden"];

        $sql = "DELETE FROM service WHERE id IN($ids)";

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
                <li><a href="appointment.php">Appointment</a></li>
                <li><a href="transaction.php">Transaction</a></li>
                <li id="selected-tab"><a href="service.php">Service</a></li>
                <li><a href="review.php">Review</a></li>
            </ul>
        </nav>
        <div id="container">
            <div id="top-bar">
                <div id="top-bar-query">
                    <form action="service.php" method="get">
                        <select name="type">
                            <option name="id" <?php if (isset($type) && $type == "id") { echo("selected"); } ?>>Service ID</option>
                            <option name="healerId" <?php if (isset($type) && $type == "healerId") { echo("selected"); } ?>>Healer ID</option>
                            <option name="name" <?php if (isset($type) && $type == "name") { echo("selected"); } ?>>Name</option>
                            <option name="hourlyFee" <?php if (isset($type) && $type == "hourlyFee") { echo("selected"); } ?>>Hourly Fee</option>
                            <option name="description" <?php if (isset($type) && $type == "description") { echo("selected"); } ?>>Description</option>
                        </select>
                        <input type="text" name="query" value="<?php if (isset($query)) { echo($query); }?>">
                        <input id="btn-search" type="submit" name="formSearch" value="Search">
                    </form>
                </div>
                <div id="top-bar-toggles">
                    <button id="btn-clear">Clear</button>
                    <form  id="formRemove" action="service.php" method="get">
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
                        <th>Service ID</th>
                        <th>Healer ID</th>
                        <th>Name</th>
                        <th>Hourly Fee</th>
                        <th>Description</th>
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