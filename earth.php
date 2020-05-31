<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>Earthing Calculation Tools</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<script src="js/earthing.js"></script>
		<script id="MathJax-script" async
			src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
		</script>
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
							<h1><a href="#">Earthing Calculation Tools</a></h1>									 							
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
								<header>
										<h1>EPR and Fault Current Split</h1>
								</header>
									<div class="row 50%">
										<section class="box">
											<form>
												Earth Impedance	(Ω)<input type="number" id="ER" value="2" onkeyup='saveValue(this);' /> 
												Return Impedance (Ω)<input type="number" id="RR" value="0.18" onkeyup='saveValue(this);'/> 
												Parallel Impedance (Ω)<span id="PR" class="label "></span>
											</form>
										</section>
									
										<section class="box">
											<form>
												Fault Current (kA)<input type="number" id="FC" value="8" onkeyup='saveValue(this);'/>
												Ground Return Current (kA)<span id="IR" class="label "></span> 
												Ground Return Current (kA)<span id="IG" class="label "></span> 													
											</form>
										</section>											
									
										<section class="box">
											<form>
												Earth Potential Rise (EPR)<span id="EPR" class="label"></span>
												Ground Return Current (%)<span id="IRp" class="label "></span> 
												Ground Return Current (%)<span id="IGp" class="label "></span> 													
											</form>
										</section>
																			
									</div>
								<header>
										<h1>Earth Grid Calculations</h1>
								</header>
									<div class="row 50%">
										<section class="box">
											<form>
												Ground Resistivity \(\rho\) (mΩ)<input type="number" id="P" onkeyup='saveValue(this);'/> 
												\(Area\) (m<sup>2</sup>)<input type="number" id="AREA" onkeyup='saveValue(this);'/> 
												Radius of Circular Plate<br>  of Same Area as Grid \(r\) (m)<span id="R" class="label "></span> 
												$$ r = \sqrt{Area \over \pi} $$		
											</form>
										</section>
										<section class="box">
											<form>	
												Tape Depth \(h\) (m)<input type="number" id="H" onkeyup='saveValue(this);'/>
												Total Tape Length \(L\) (m)<input type="number" id="L" onkeyup='saveValue(this);'/>
												<!--Simplest Formula for <br>Earth Resistance \(R_e\) (Ω):-->
												<style>#RE {display: none}</style>
												<span hidden id="RE" class="label "></span>	<br>			
												Rod Factor \(K_R\)<span id="KR" class="label "></span> 	
												$$ K_R= 1 + {{n_R \times {l_R}^2} \over {10r^2}} $$	
											</form>
										</section>	
										<section class="box">
											<form>
												Rod Number \(n_R\) <input type="number" id="NR" onkeyup='saveValue(this);'/>	
												Rod Length \(l_R\) (m)<input type="number" id="LR" onkeyup='saveValue(this);'/>	
												Earth Resistance Calculated <br>with Rods \(R_G\) (Ω):
												<span id="RG" class="label "></span>												
												<p><!--$$ R_e = {\rho \over 4r} + {\rho \over {1 + n_R \times l_R}} $$<br>-->
												\[R_G=\rho  {\left({1+ {\left(r \over {r+2.5h}\right)} \over 8r \times K_R}+{1 \over L}\right)}\]</p>											
											</form>
										</section>		
									</div>
								<header>
									<h1>Ground Resistivity Correction</h1>
								</header>
									<div class="row 50%">
												<section class="box">
													<form>
														Earth Resistance \(R\) (Ω)<input type="number" id="ERA" onkeyup='saveValue(this);'/> 											
													</form>
												</section>
												<section class="box">
													<form>
														Corrected Resistivity \(\rho_A\) (mΩ)<span id="PA" class="label "></span> 													
													</form>
												</section>		
												<section class="box">
													<form>
												$$ \rho_A = {R \times \rho \over R_G} $$												
													</form>
												</section>	
									</div>
									<script type="text/javascript">
										earthing();
										document.onkeyup = function() {							
												earthing();										
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
