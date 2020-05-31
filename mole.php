<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>Whack a Mole</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js?=v1.1"></script>
		<script src="js/scores.js?=v1.6"></script>
		<link rel="stylesheet" href="css/molestyle.css?v1.1" />
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
							<h1><a href="#">Whack a Mole</a></h1><br>							
						</div>	
						<!-- Nav -->
					<nav id="nav">
						<ul>
							<li class="current">
								<a href="index.php">Home</a>
								<ul>
									<li><a href="mole.php">Whack a Jon</a></li>									
								</ul>
							</li>
							<li>
								<a href="#">Tools</a>
								<ul>
									<li><a href="csv.php">CSV Plotter</a></li>
									<li><a href="relay.php">Distance Protection Fault Plotter</a></li>
									<li><a href="earth.php">Earthing Calculation Tools</a></li>	
									<li><a href="soil.php">Earthing Surveys</a></li>		
									<li><a href="tools.php">Electrical Engineering Tools</a></li>
									<li><a href="emc.php">EMC Calculations</a></li>
									<li><a href="mortgage.php">Mortgage Calculator</a></li>									
								</ul>
							</li>
							<li><a href="op.php">Orion Park</a></li>
							<li><a href="help.php">Help</a></li>
						</ul>
					</nav>
				</div>
			</div>

		<!-- Main -->				
				<div id="main" class="container">
					<div class="row 100%">
						
						<div>
						
							<!-- Content -->
								<div id="content"><br>
									<div class="row 50%">
										<section class="box">
											<form>		<br>										
												<button class="button label" onClick="startGame(); event.preventDefault()">Start!</button>
											</form>
										</section>	
										<section class="box">
											<form>
												Score:
												 <span class="score label">0</span>
											</form>
										</section>		
										<section class="box">
											<form>
												Level:
												 <span id="Mode" class="label"></span>												
												<br><b><span id="TempScore"></span></b>
											</form>
										</section>																							
									</div>	
									<div class="row 50%">
									  <div class="game">
											<div class="hole hole1">
											  <div class="mole"></div>
											</div>
											<div class="hole hole2">
											  <div class="mole"></div>
											</div>
											<div class="hole hole3">
											  <div class="mole"></div>
											</div>
											<div class="hole hole4">
											  <div class="mole"></div>
											</div>
											<div class="hole hole5">
											  <div class="mole"></div>
											</div>
											<div class="hole hole6">
											  <div class="mole"></div>
											</div>
									  </div>
									</div>					  
							</div>
						</div>
					</div>
				</div>
 
		<br><div class="row 50%">
			<section class="box">
				<form class="scores">
					<label for "userName"></label>
					<input type="text" name="fname" autocomplete="given-name" id="userName" onkeyup='saveValue(this);' placeholder="Name"/> 
				</form>
			</section>
				
			<section class="box">
<?php

$servername = "localhost";
$username = "Hans";
$password = "asdfasdf";
$dbname = "scores";

if ($_COOKIE['mole'] == 'true' || (!function_exists('mysqli_init') && !extension_loaded('mysqli'))) {
	$a2 = json_decode(file_get_contents('./uploads/molescores.json'), true);
	array_multisort(array_column($a2, '2'), SORT_DESC, $a2);
	?>
		<table class="scores">
		<tr>
		<th>Name</th>
		<th>LAN IP Address</th>
		<th>High <br>Score</th>
		</tr>
		<?php foreach ($a2 as &$val){ ?>
			<tr>
				<td><?php echo $val[0]; ?></td>
				<td><?php echo $val[1]; ?></td>
				<td><?php echo $val[2]; ?></td>
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
		  </tr>
		<?php
		$i=0;
		while($row = mysqli_fetch_array($result)) {
			?>
			<tr>
				<td><?php echo $row["name"]; ?></td>
				<td><?php echo $row["ip"]; ?></td>
				<td><?php echo $row["score"]; ?></td>
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
</section>
</div>
		
		<script src="js/mole.js?=v2.0"></script>
		<script type="text/javascript">
			document.cookie="mole=true";
			document.getElementById("userName").value = getSavedValue("userName");
			ip(); 
			
		  </script>
		<div id="copyright">
			<ul>
				<li>&copy; <a href=javascript:fullscores();>Hans Juneby.</a></li><li>Design: <a href="http://html5up.net">HTML5 UP & Hans Juneby</a></li>
			</ul>
		</div>
	</body>
</html>
