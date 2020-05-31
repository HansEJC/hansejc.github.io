<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>Electrical Engineering Tools</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<script src="js/electools.js"></script>
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
							<h1><a href="#">Electrical Engineering Tools</a></h1>									 							
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
					
						<div >
						
							<!-- Content -->
								<div id="content">
								<header>
										<h1>Parallel Impedance Calculator</h1>
								</header>
									<div class="row 50%">
										<section class="box">
											<form>
												Quantity<input type="number" id="NPR" onkeyup='saveValue(this);remParallel();calculations();' /> 
											</form>
										</section>
									
										<section class="box"><pre>    Resistances (Ω)</pre>
											<form id="Parallel">	
												
											</form>
										</section>	
										
										<section class="box">
											<form>
												Parallel Resistance (Ω)<span id="PR" class="label"></span>												
											</form>
										</section>					
									</div>
									
									<header><hr>
										<h1>Polar to Rectangular & Rectangular to Polar</h1>
									</header>
									<div class="row 50%">
										<section class="box">
											<form>
												Number<input type="number" id="PN" onkeyup='saveValue(this);polrec();' /> 
												Angle (°)<input type="number" id="PA" onkeyup='saveValue(this);polrec();' /> 
												Rectangular<span id="PTR" class="label"></span>
											</form>
										</section>
									
										<section class="box">
											<form>
												Real<input type="number" id="RR" onkeyup='saveValue(this);polrec();' /> 
												Imaginary <input type="number" id="IR" onkeyup='saveValue(this);polrec();' /> 
												Polar<span id="RTP" class="label"></span>
											</form>
										</section>
									</div>
									
									<header><hr>
										<h1>Polar Addition</h1>
									</header>
									<div class="row 50%">
										<section class="box"><br><pre>    Numbers</pre>
											<form id="Nums">	
												
											</form>
										</section>
										<section class="box"><br><pre>    Angles</pre>
											<form id="Angs">	
												
											</form>
										</section>	
									
										<section class="box"><br>Polar Sum
											<form>	
												<span id="PSUM" class="label"></span>		
											</form>
										</section>					
									</div>
									<header><hr>
										<h1>Load Calculation Tool</h1>
									</header>
									<div class="row 50%">
										<section class="box">
											<form>
												Line Voltage (V)<input type="number" id="ILV" onkeyup='saveValue(this);loadcalc();' /> 
												L1 Load (A)<input type="number" id="L1L" onkeyup='saveValue(this);loadcalc();' /> 
												L2 Load (A)<input type="number" id="L2L" onkeyup='saveValue(this);loadcalc();' /> 
												L3 Load (A)<input type="number" id="L3L" onkeyup='saveValue(this);loadcalc();' /> 
											</form>
										</section>										
										<section class="box">
											<form>
												L1-L2 Load (A)<input type="number" id="L12L" onkeyup='saveValue(this);loadcalc();' /> 
												L1-L3 Load (A)<input type="number" id="L13L" onkeyup='saveValue(this);loadcalc();' /> 
												L2-L3 Load (A)<input type="number" id="L23L" onkeyup='saveValue(this);loadcalc();' /> 
											</form>
										</section>
										<section class="box">
											<form>	
												L1 Load (A)<span id="L1T" class="label"></span>	
												L2 Load (A)<span id="L2T" class="label"></span>	
												L3 Load (A)<span id="L3T" class="label"></span>	
												N Load (A)<span id="NL" class="label"></span>		
											</form>
										</section>	
										<section class="box">
											<form>	
												Total Power <span id="TPOW" class="label"></span>	
											</form>
										</section>
									</div>				
										
									<header><hr>
										<h1>Consumption Calculator</h1>
									</header>
									<div class="row 50%">
										<section class="box">
											<form>
												Load (W)<input type="number" id="CONL" onkeyup='saveValue(this);consum();' /> 
												Rate (£/kWh)<input type="number" id="CONR" onkeyup='saveValue(this);consum();' /> 
											</form>
										</section>										
										<section class="box">
											<form>
												Time (h)<input type="number" id="CONH" onkeyup='saveValue(this);consum();' /> 	
												Days <span id="COND" class="label"></span>
											</form>
										</section>
										<section class="box">
											<form>		
												Consumption (kWh)<span id="CONK" class="label"></span>
												Cost (£) <span id="CONC" class="label"></span>		
											</form>
										</section>	
										<section class="box">
											<form>	
											</form>
										</section>
																
									</div>
								
									<script type="text/javascript">
										calculations();
										polrec();
										poladd();
										loadcalc();
										consum();
										document.onkeyup = function() {							
												parallel();
												poladd();
												consum();
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
