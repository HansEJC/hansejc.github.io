<?php
$servername = "localhost";
$username = "Hans";
$password = "asdfasdf";
$dbname = "scores";

if ($_COOKIE['mole'] == 'true' || (!function_exists('mysqli_init') && !extension_loaded('mysqli'))) {
	$a = json_decode(file_get_contents('./uploads/scores.json'), true);
	if ($_COOKIE['mole'] == 'true') $a = json_decode(file_get_contents('./uploads/molescores.json'), true);
	$existed = false;
	foreach ($a as &$val){ 
		if ($val[1] == $_POST['ip']){
			$val[0] = $_POST['name'];
			$val[2] = $val[2] > $_POST['score'] ? $val[2] : $_POST['score'];
			$val[3] = $val[2] > $_POST['score'] ? $val[3] : $_POST['date'];			
			$val[4] = $_POST['date'];
			$existed = true;
		}
	}
	if (!$existed){
		array_push($a,[$_POST['name'],$_POST['ip'],$_POST['score'],$_POST['date'],$_POST['date']]);
	}
	
	if ($_COOKIE['mole'] == 'true') file_put_contents("./uploads/molescores.json",json_encode($a, JSON_UNESCAPED_UNICODE));
	else file_put_contents("./uploads/scores.json",json_encode($a, JSON_UNESCAPED_UNICODE));
	echo "Guardande high score.";   
} else {
    $conn = new mysqli($servername, $username, $password, $dbname); // Create connection
	if ($conn->connect_error) {     // Check connection
		die("Problem with the database :("/*"Connection failed: " . $conn->connect_error*/);
	} 

	$name = mysqli_real_escape_string($conn, $_POST['name']);
	$ip = mysqli_real_escape_string($conn, $_POST['ip']);
	$score = mysqli_real_escape_string($conn, $_POST['score']);
	$date = mysqli_real_escape_string($conn, $_POST['date']);
	$date2 = $date;

	//if (strlen($score) > 200000) {  $score = "";    }

	$sql = "INSERT INTO highscores (name,ip,score,date,date2)
	VALUES ('$name', '$ip', '$score', '$date', '$date2') ON DUPLICATE KEY UPDATE    
	name='$name', ip='$ip', date=IF(score<'$score','$date',date), score=GREATEST(score, '$score'), date2='$date2'";

	if ($conn->query($sql) === TRUE) {
		echo "Updating scores. Using cheats won't get you a high score!";
	} else {
		echo "Problem with the database :(";//"Error: " . $sql . "<br>" . $conn->error;
	}
	$conn->close();
}
	
?>
