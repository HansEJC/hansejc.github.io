<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>Orion Park</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<script src="js/op.js?=v3.1"></script>
		<script src="js/papaparse.js"></script>
		<link rel="stylesheet" src="dygraph.css" />
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
							<h1><a href="#">Orion Park</a></h1>									 							
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
								<div id="content">
									<form>
										<br><input type="radio" name ="A" id="PStock" onChange='ifsy();saveRadio(this);'>Project Stock<br>
										<input type="radio" name ="A" id="WStock" onChange='ifsy();saveRadio(this);'>Warehouse Stock<br>
										<input type="radio" name ="A" id="Del" onChange='ifsy();saveRadio(this);'>Deliveries<br>
									</form>	
									<pre id ="p"></pre>	<pre id ="pp"></pre>	
										
									<div class="row 50%">
										<section class="box">
											<form>
												Password<input type="password" id="PASS" onkeyup='saveValue(this);' /> 
											</form>
										</section>
										<section class="box">
											<form>
												Search<input type="text" id="SEAR" onkeyup='saveValue(this);' /> 
											</form>
										</section>
									</div>
									<div class="row 100%">
										</section class="box">
										<section id="tab" class="box">
										</section>				
									</div>
									<script type="text/javascript">
										delivery();
										document.getElementById("PStock").checked = (getSavedValue("PStock") == "true");
										document.getElementById("WStock").checked = (getSavedValue("WStock") == "true");
										document.getElementById("Del").checked = (getSavedValue("Del") == "true");	
										document.onkeyup = function() {							
											ifsy();								
										};
										
									</script>						
						</div>
					</div>
					</div>
				</div>
					<div id="copyright">
					<ul>
						<li>&copy; Hans Juneby.</li><li>Design: <a href="http://html5up.net">HTML5 UP & Hans Juneby</a></li>
					</ul>
				</div>
	</body>
</html>
