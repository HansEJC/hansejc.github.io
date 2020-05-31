<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>Graph Interface</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js?v=1.2"></script>
		<script src="js/dygraph.min.js"></script>
		<script src="js/papaparse.js"></script>
		<script src="js/csv.js?v=3.0"></script>
		<script src="js/csvIE.js"></script>
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
							<h1><a href="#">CSV Plotter</a></h1><br>							
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
								
									<div class="row 50%">
											
												<section class="box">
													<form>
															x Axis Label
														<input type="text" id="xaxis" value="Date" onkeyup='saveValue(this);'/> 
													</form>
												</section>
											
												<section class="box">
													<form>
														y Axis Label
														<input type="text" id="yaxis" value="Voltage (V)" onkeyup='saveValue(this);'/> 
													</form>
												</section>																											
									</div>	
									
									<div class="row 100%">
										<article class="post" id="err">
										
											<div id="graphdiv3" 											
											  style="width:1000px; height:600px;"><div class="loader" ></div></div>									
												<br>
												<p id="MyForm"><b>Show: </b>
													<input type=checkbox id=69 checked>
													<label for="69"> All</label>
													</p>	
										</article>
									</div>
									
									<div class="row 50%" id="hide" style="display: none;">
										<section class="post">
											<form>
												<input type="number" id="LabR" onkeyup='saveValue(this);' style="display:none"/>  
													<input type=checkbox id="99">
												 Start Date:<input type="datetime-local" id="dat"/> 
												Rate in seconds:<input type="number" min="0" id="datR" placeholder="1"/>  
											</form>
										</section>
										<section class="post" >
											<form id="equa">
												<b>Enable Equations </b><input type=checkbox id='eqcheck'>
											</form>
										</section>
									</div>
									<div class="row 50%">
										<form id="myForm">
											<input type="file" accept=".csv" id="my_upload" name="my_upload"/>
										</form>	
									
											<script type="text/javascript">	
												labels();									
												if (!!navigator.userAgent.match(/Trident\/7\./)){ //if IE is used
													plotIE();
													alert("Dates don't plot on Internet Explorer correctly. Get off it you Dinasour!");
												}
												else {
													javaread();
												}
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

