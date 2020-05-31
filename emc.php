<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>EMC Calculations</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js?v1.1"></script>
		<script src="js/emc.js?v2.0"></script>
		<script src="dygraph.min.js"></script>
		<!--<script id="MathJax-script" async src="js/tex-mml-chtml.js"></script>-->
		<script id="MathJax-script" async
			src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
		</script>
		<!--<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>-->
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
							<h1><a href="#">EMC Calculations</a></h1><br>									 							
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
									<div class="row 50%"><br>
										<section class="box">
											<form>
												<input type="radio" name="drive" id="LF" checked>Low Frequency
												<input type="radio" name="drive" id="HF">High Frequency
											</form>
										</section>
									</div>		
									<div class="row 50%" id="Lhide">
											
										<section class="box">
											<form>
												Voltage \(V\) (V)<input value=25000 type="number" id="VO" onkeyup='saveValue(this);'/>
												Current \(I\) (A)<input value=500 type="number" id="CU" onkeyup='saveValue(this);'/>
												Capacitance \(C\) (μF/km)<input value=0.02 step=0.01 type="number" id="CA" onkeyup='saveValue(this);'/>
											</form>
										</section>
										<section class="box">
											<form> 
												Electric Field:
												<p> \[E = {q \over 2\pi \times \epsilon_0 \times d}\]</p>
												Air Permittivity : <p>\(\epsilon_0 = 8.55\times 10^{-12} \ F/m\) </p>
												Charge (q): <p>\(C\times V=\) 
												<small id="CH"></small></p>
											</form>
										</section>
										<section class="box">
											<form> 
												Magnetic Field:
												<p> \[B = {μ_0 \times I \over 2\pi \times d}\]</p>
												Air Permeability : <p>\(μ_0 = 4\pi \times 10^{-7} \ Tm/A\) </p>
											</form>
										</section>
											
									</div>		
									<div class="row 50%" id="Hhide" style="display: none;">
											
										<section class="box">
											<form>
												Transmitter Frequency <input type="number" id="TF" onkeyup='saveValue(this);'/>
												EIRP (W)<input type="number" id="EIRP" onkeyup='saveValue(this);'/>
											</form>
										</section>
								
										<section class="box">
											<form> Multiplier
												<select id="MUL" onchange='saveValue(this);calculations();'>
												  <option value="H">Hertz</option>
												  <option value="K">Kilohertz</option>
												  <option value="M" selected>Megahertz</option>
												  <option value="G">Gigahertz</option>
												</select><br>
												Field Indication: <p>\(c/2\pi f=\) 
												<small id="FI"></small></p>
											</form>
										</section>	
										<section class="box">
											<form>
												Near Field: \(d\le c/2\pi f\)
												<p> \[E \approx {c^2 \sqrt{EIRP} \over 7.2 f^2 d^3}\]</p>
												<p> \[H \approx {c \sqrt{EIRP} \over 434fd^2}\]</p>
											</form>	
										</section>		
										<section class="box">
											<form>
												Far Field: \(d\ge c/2\pi f\)
												<p> \[E \approx {5.48 \sqrt{EIRP} \over d}\]</p>
												<p> \[H \approx { \sqrt{EIRP} \over 68.8d}\]</p>
											</form>	
										</section>		
									</div>										
									
									<div class="row 100%">
										<article class="post">
											<style>.dygraph-legend {width: inherit}</style>
											<div id="graphdiv3" 
											  style="width:1000px; height:600px;"></div>

										<section class="box">
											<form>
												<input type="radio" name="field" id="EF" checked>Electric Field
												<input type="radio" name="field" id="MF">Magnetic Field
											</form>
										</section>									
												<br>
												<p id="MyForm" hidden><b>Show: </b>			
													</p>
											<script type="text/javascript">	
												calculations(); 
												document.onkeyup = function() {							
													calculations();								
												};
											</script>	
										</article>
									</div>
						</div>
					</div>
					</div>
				</div>
					<div id="copyright">
					<ul>
						<li>&copy; <a href="mortgage2.php">Hans Juneby.</a></li><li>Design: <a href="http://html5up.net">HTML5 UP & Hans Juneby</a></li>
					</ul>
				</div>
	</body>
</html>