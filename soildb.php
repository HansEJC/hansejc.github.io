<?php
$servername = "localhost";
$username = "Hans";
$password = "asdfasdf";
$body = file_get_contents('php://input');
$data = json_decode($body , true);
$dbname = $data['datab'];
$tabl = $data['tabl'];

$conn = new mysqli($servername, $username, $password, $dbname); // Create connection
if ($conn->connect_error) {     // Check connection
    die("Problem with the database :("/*"Connection failed: " . $conn->connect_error*/);
}

// sql to create table
$sql = "CREATE TABLE $tabl (
distance FLOAT(10) UNIQUE NOT NULL,
res FLOAT(10) NOT NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table created successfully";
} else {
    echo mysqli_error($conn) . " and has now been overwritten";
}

$distance = $data['distance'];
$res = $data['res'];

for ($i = 0; $i < count($distance); $i++) {
  $sql = "INSERT INTO $tabl (distance,res)
  VALUES ('$distance[$i]', '$res[$i]') ON DUPLICATE KEY UPDATE
  distance='$distance[$i]', res='$res[$i]'";
  $conn->query($sql);
}

if ($conn->query($sql) === TRUE) {
    echo "<br>Sending survey results to database";
} else {
    echo "<br>Problem with the database :(";//"Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
?>
