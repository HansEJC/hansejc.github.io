<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>Earthing Surveys</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<script src="js/soil.js?v=1.3"></script>
		<script src="dygraph.min.js"></script>
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
					<h1><a href="#">Earthing Surveys</a></h1>									 							
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
			<!-- Content -->
			<div id="content">
				<header>
					<h1>Soil Resistivity</h1>
						<br><b><span id="span1"></span></b>
				</header>
				<div class="row 50%">
					<section class="box">
						<form>
							Number of Measurements<input type="number" id="NPR" onkeyup='saveValue(this);rem();calculations();def();' />
						</form>
					</section>	
					<section class="box">
						<form>
							Test Location<input type="text" id="TLOC" onkeyup='saveValue(this);' />
						</form>
					</section>	
					<section class="box">
						<form>
							<br><button class ="button" type="button" onclick="exportToCsv(document.getElementById('TLOC').value+'_soil.csv', soil())">Export</button>
						</form>
					</section>					
				</div>
				<div class="row 50%">
					<section class="box"><br><pre>    Distance (m)</pre>
						<form id="Dist">	
							
						</form>
					</section>
					<section class="box"><br><pre>    Soil Resistance (Ω)</pre>
						<form id="Stan">	
							
						</form>
					</section>	
				
					<section class="box"><br><pre>    Soil Resistivity (Ωm)</pre>
						<form id="Stiv">
						
						</form>
					</section>					
				</div>
				
				<div class="row 50%">
					<form>
						<input type=checkbox id="showTable" onchange='table();'>Show Table:
					</form>
					<section id="tab" class="box">
					
					</section>					
				</div>
				
				<header><hr>
					<h1>Fall of Potential</h1>
						<br><b><span id="span2"></span></b>
				</header>
				<div class="row 50%">
					<section class="box">
						<form>
							Distance (m)<input type="number" id="NPR2" onkeyup='saveValue(this);rem2();def2();' /> 
						</form>
					</section>	
					<section class="box">
						<form>
							62% Method <span id="Meth" class="label"></span>
						</form>
					</section>		
					<section class="box">
						<form>
							<br><button class ="button" type="button" onclick="exportToCsv(document.getElementById('TLOC').value+'_FOP.csv', plotFop())">Export</button>
						</form>
					</section>						
				</div>
				<div class="row 50%">
					<section class="box"><br><pre>    Distance (m)</pre>
						<form id="Dist2">	
							
						</form>
					</section>
					<section class="box"><br><pre>    Measurement (Ω)</pre>
						<form id="Meas">	
							
						</form>
					</section>					
				</div>
				
				<div class="row 100%">
					<article class="post">
					
						<div id="graphdiv3" 
						  style="width:1000px; height:600px;">
						</div>									
							
					</article>
				</div>					
				<script type="text/javascript">
					calculations();
					def();
					def2();
					soil();
					plotFop();
					document.onkeyup = function() {							
						soil();	
						plotFop();
					};																																		
				</script>	
			</div>
			
			
		</div>
		<div id="copyright">
			<ul>
				<li>&copy; Hans Juneby.</li><li>Design: <a href="http://html5up.net">HTML5 UP & Hans Juneby</a></li>
			</ul>
		</div>
	</body>
</html>
