<!DOCTYPE HTML>
<!--
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" width="550" height="400" src="http://prezi.com/embed/_ebxmg2zj6by/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0#"></iframe>

-->
<html>
	<head>
		<title>Help</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<link rel="stylesheet" src="dygraph.css" />
		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-desktop.css" />
		</noscript>
		<!--[if lte IE 8]><link rel="stylesheet" href="css/ie/v8.css" /><![endif]-->
		<script Language="Javascript">
			
			function Redirect(){
				document.location="index.php";
			}
						
			function updateInput(ish){
				document.getElementById("xaxis").value = ish;
			}
		
		</script>
		<script src="js/style_minified.js"></script>
   		<script src="js/script.js"></script>
	</head>
	<body class="left-sidebar">

		<!-- Header -->
			<div id="header-wrapper" class="wrapper">
				<div id="header">
					<!-- Logo -->
						<div id="logo">
							<h1><a href="#">Help</a></h1><br>							
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
									<div class="row 100%">
										<p><b>Distance Protection Fault Plotter</b><br>
										Using Easergy / S1 Agile, open the disturbance record data. Go to "Files" > "Save As" > "CSV Format" > "Vector Values (RMS & Ang)". 
										For the csv file to load correctly, delete all unneeded rows and columns containing letters. The uploaded csv file must only contain 
										four columns of data with no labels. The first column must contain the "Vcat-RMS" data, the second column the "Vcat-Ang",  
										the third column the "Icat-RMS" data, and the fourth column the "Icat-Ang".<br><br>
										To plot secondary values to primary values, select the secondary radio button and input the VT and CT ratios in the advanced section.
										Some relay disturbance record display and export the records using secondary values. If this is the case, select the secondary DR 
										radio button. The fault sample time can be used to calculate in what zone the relay tripped. The default sample time is of 1 ms, but
										other sample times are also used. The sample time can be found in the disturbance record data.
										</p>
									</div>
									<div class="row 100%">
										<p><b>CSV Plotter</b><br>
										For the csv file to load correctly, delete all unneeded rows and columns. 
										The first row will be used to label each column of data. 
										Only one row containing labels can be used. "Add information about rolling averages".
										To plot dates on the x axis, the format of the date in the first column of the csv file must be changed.
										This can be done by creating a custom format of type: yyyy/mm/dd hh:mm:ss.000	
										</p>
									</div>
									<div class="row 100%">
										<p><b>Electrical Engineering Tools Excel Equations</b><br>
										<a href="downloads/Polar Addition.xlsx">Polar Additions</a>
										
										</p>
									</div>
									<div class="row 100%">
										<p id ="p">	
										</p>
										<script type="text/javascript">	
												
												if (!!navigator.userAgent.match(/Trident\/7\./)){ //if IE is used
													document.getElementById("p").textContent +="If something feels like it isn't working like it should, switch to another browser you dinosaur. Internet Explorer sucks!";
												}
												else {
													document.getElementById("p").textContent +=" Good for you for not using Internet Explorer!";
												}
											</script>
									</div>		
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


