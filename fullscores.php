<!DOCTYPE HTML>
<html>
	<head>
		<meta name="google-site-verification" content="kpsLUnsJWucTZ6oW1a_uTQyEd5uerJiWXow9sE-NAjw" />
		<title>Scores</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js?=v1.0"></script>
		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-desktop.css" />
		</noscript>
		<!--[if lte IE 8]><link rel="stylesheet" href="css/ie/v8.css" /><![endif]-->
		<script src="js/style_minified.js"></script>
   		<script src="js/script.js"></script>
	</head>
	<body class="left-sidebar">

		<!-- Header -->
			<div id="header-wrapper" class="wrapper">
				<div id="header">
					<!-- Logo -->
						<div id="logo">
							<h1><a href="#">Scores</a></h1><br>							
						</div>
						<!-- Nav -->
						<nav id="nav">
							<ul>
								<li class="current"><a href="index.php">Home</a></li>
								<li>
									<a href="#">Tools</a>
									<ul>
										<li><a href="csv.php">CSV Plotter</a></li>
										<li><a href="relay.php">Distance Protection Fault Plotter</a></li>
										<li><a href="earth.php">Earthing Calculation Tools</a></li>	
										<li><a href="soil.php">Earthing Surveys</a></li>		
										<li><a href="tools.php">Electrical Engineering Tools</a></li>
										<li><a href="mortgage.php">Mortgage Calculator</a></li>									
									</ul>
								</li>
								<li><a href="op.php">Orion Park</a></li>
								<li><a href="help.php">Help</a></li>
							</ul>
						</nav>
				</div>
			</div>

	
<br>				

 
<?php

$servername = "localhost";
$username = "Hans";
$password = "asdfasdf";
$dbname = "scores";

if ($_COOKIE['mole'] == 'true' || (!function_exists('mysqli_init') && !extension_loaded('mysqli'))) {
	$a2 = json_decode(file_get_contents('./uploads/scores.json'), true);
	if ($_COOKIE['mole'] == 'true') $a2 = json_decode(file_get_contents('./uploads/molescores.json'), true);
	
	array_multisort(array_column($a2, '2'), SORT_DESC, $a2);
	?>
		<table class="scores">
		<tr>
		<th>Name</th>
		<th>LAN IP Address</th>
		<th>High <br>Score</th>
		<th>High Score Date</th>
		<th>Last Played Date</th>
		</tr>
		<?php foreach ($a2 as &$val){ ?>
			<tr>
				<td><?php echo $val[0]; ?></td>
				<td><?php echo $val[1]; ?></td>
				<td><?php echo $val[2]; ?></td>
				<td><?php echo $val[3]; ?></td>
				<td><?php echo $val[4]; ?></td>
			</tr>
	<?php	}?>
		</table>	
<?php	
} else {
	$conn = new mysqli($servername, $username, $password, $dbname); // Create connection
	if ($conn->connect_error) {     // Check connection
		echo "Problem with the database :("; //("Connection failed: " . $conn->connect_error);
	} 

	$sql = "SELECT * FROM highscores
	ORDER BY score DESC";

	$result = mysqli_query($conn, $sql);
	$response = array();
		
	if (mysqli_num_rows($result) > 0) {
		?>
		  <table class="scores">
		  <tr>
			<th>Name</th>
			<th>LAN IP Address</th>
			<th>High <br>Score</th>
			<th>High Score Date</th>
			<th>Last Played Date</th>
		  </tr>
		<?php
		$i=0;
		while($row = mysqli_fetch_array($result)) {
		?>
		<tr>
			<td><?php echo $row["name"]; ?></td>
			<td><?php echo $row["ip"]; ?></td>
			<td><?php echo $row["score"]; ?></td>
			<td><?php echo $row["date"]; ?></td>
			<td><?php echo $row["date2"]; ?></td>
		</tr>
		<?php
		$i++;
		}
		?>
		</table>
		 <?php
	}
	else{
		echo "No result found";
	}
}
?>

		<div id="copyright">
			<ul>
				<li>&copy; Hans Juneby.</li><li>Design: <a href="http://html5up.net">HTML5 UP & Hans Juneby</a></li>
			</ul>
		</div>
	</body>
</html>
