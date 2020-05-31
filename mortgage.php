<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>Mortgage Page</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<script src="js/mortgage.js"></script>
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
							<h1><a href="#">Mortgage</a></h1><br>									 							
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
														Amount Borrowed (£)<input type="number" id="AB" onkeyup='saveValue(this);'/>
														Interest Rate (%)<input type="number" id="IR" onkeyup='saveValue(this);'/>
														Mortgage Term (years)<input type="number" id="MT" onkeyup='saveValue(this);'/>
														Mortgage Payment (£)<span id="MP" class="label"></span>
													</form>
												</section>
										
												<section class="box">
													<form> 
														Overpayment (£)<input type="number" id="OP" onkeyup='saveValue(this);'/>
														Total Payment (£)<span id="TP" class="label"></span>
														Remaining Term<span id="RT" class="label"></span>
														Total Payed (£)<span id="AP" class="label"></span>
														
													</form>
												</section>
												
												<section class="box">
													<form> 
														Maximum Overpayment (£)<span id="MOP" class="label"></span>
													</form>
												</section>
																					
									</div>									
									
									<div class="row 100%">
										<article class="post">
										
											<div id="graphdiv3" 
											  style="width:1000px; height:600px;"></div>									
												<br>
												<p><b>Show: </b>
													<input type=checkbox id=0 onClick="change(this)" checked>
													<label for="0"> Interest</label>
													<input type=checkbox id=1 onClick="change(this)" checked>
													<label for="1"> Equity</label>
													<input type=checkbox id=2 onClick="change(this)" checked>
													<label for="2"> Payment</label>								
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