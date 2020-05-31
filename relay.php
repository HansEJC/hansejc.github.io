<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>Distance Protection Plotter</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<script src="js/papaparse.js"></script>
		<script src="js/relay.js?v2.0"></script>
		<script src="js/relayIE.js"></script>
		<script src="js/dygraph.min.js"></script>
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
							<h1><a href="#">Distance Protection Plotter</a></h1><br>									 							
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
								
									<div class="row 50%">
										<section class="box">
											<form>
													Zone 1
												<input type="number" id="Zone1" onkeyup='saveValue(this);'/> Zone 1A
												<input type="number" id="Zone1A" onkeyup='saveValue(this);'/>Zone 1RH 
												<input type="number" id="Zone1RH" onkeyup='saveValue(this);'/> Zone 1LH
												<input type="number" id="Zone1LH" onkeyup='saveValue(this);'/> 
												<input type=checkbox id="advanced" onchange='hider();'>Advanced
											</form>
										</section>
										<section class="box">
											<form>
												Zone 2
												<input type="number" id="Zone2" onkeyup='saveValue(this);'/> Zone 2A
												<input type="number" id="Zone2A" onkeyup='saveValue(this);'/>Zone 2RH 
												<input type="number" id="Zone2RH" onkeyup='saveValue(this);'/> Zone 2LH
												<input type="number" id="Zone2LH" onkeyup='saveValue(this);'/>  
												<input type="radio" name="drive" id="Prim" onchange="plotIE();" checked>Primary
												<input type="radio" name="drive" id="Sec" onchange="checkit();plotIE();">Secondary
											</form>
										</section>
										<section class="box">
											<form>
												Zone 3
												<input type="number" id="Zone3" onkeyup='saveValue(this);'/> Zone 3A
												<input type="number" id="Zone3A" onkeyup='saveValue(this);'/>Zone 3RH 
												<input type="number" id="Zone3RH" onkeyup='saveValue(this);'/> Zone 3LH
												<input type="number" id="Zone3LH" onkeyup='saveValue(this);'/>
											</form>
										</section>
									</div>	
									<div class="row 50%" id="hide" style="display: none;">
										<section class="box">
											<form>
												Zone 2 delay (ms)<input type="number" id="Z2del" onkeyup='saveValue(this);'/> 
												Zone 3 delay (ms)<input type="number" id="Z3del" onkeyup='saveValue(this);'/>
												Fault sample time (ms)<input type="number" id="FST" onkeyup='saveValue(this);'/>  
											</form>
										</section>
										<section class="box">
											<form>
												VT Ratio<input type="number" id="VTR" onkeyup='saveValue(this);'/> 
												CT Ratio<input type="number" id="CTR" onkeyup='saveValue(this);'/> 
												<input type="radio" name="DR" id="PrimDR" onchange="plotIE();" checked>Primary DR<br>
												<input type="radio" name="DR" id="SecDR" onchange="plotIE();">Secondary DR<br>
											</form>
										</section>
										<section class="box">
											<form>
												Fault in:<span id="FaultLoc" class="label"></span> 
											</form>
										</section>
									</div>
									
									<div class="row 100%">
										<article class="post">
										
											<div id="graphdiv3" 
											  style="width:1000px; height:600px;"></div>									
												<br>
												<p><b>Show: </b>
													<input type=checkbox id=0 onchange="change(this)" checked>
													<label for="0"> Fault</label>
													<input type=checkbox id=1 onchange="change(this)" checked>
													<label for="1"> Zone1</label>
													<input type=checkbox id=2 onchange="change(this)" checked>
													<label for="2"> Zone2</label>
													<input type=checkbox id=3 onchange="change(this)" checked>
													<label for="3"> Zone3</label>
								
													</p>	
										</article>
									</div>
										<div class="row 50%">
											<form id="myForm">
												<input type="file" accept=".csv" id="rel_upload" name="rel_upload"/>
											</form>									
										</div>
											<script type="text/javascript">	
												
												if (!!navigator.userAgent.match(/Trident\/7\./)){ //if IE is used									
													var DRcsv = loadFile("uploads/fault.csv");
													var DR = Papa.parse(DRcsv).data;
													//alert(DRcsv);
													plotIE();
													console.error("Get off Internet Explorer you Dinasour!");
													document.onkeyup = function() {							
														plotIE();								
													};
												}
												else {
													doAjaxThings();
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
