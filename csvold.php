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
		<script src="js/init.js?v=1.0"></script>
		<script src="js/dygraph.min.js"></script>
		<script src="js/papaparse.js"></script>
		<script src="js/csv.js?v=1.0"></script>
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
											
													<form>
														<br><input type="radio" name ="A" id="Stan" onChange='plot();saveRadio(this);'>Standard<br>
														<input type="radio" name ="A" id="Fan" onChange='plotfancy();saveRadio(this);'>Fancy<br>
														<input type="radio" name ="A" id="Exp" onChange='plotexp();saveRadio(this);'>Experimental<br>
													</form>																			
												
									</div>	
									
									<div class="row 100%">
										<article class="post">
										
											<div id="graphdiv3" 											
											  style="width:1000px; height:600px;"></div>									
												<br>
												<p id="MyForm"><b>Show: </b>
													<input type=checkbox id=69 onChange="UncheckAll('MyForm');" checked>
													<label for="69"> All</label>
													</p>	
										</article>
									</div>
									
									<div class="row 50%" id="hide" style="display: none;">
										<section class="post">
											<form>
												<input type="number" id="LabR" onkeyup='saveValue(this);' style="display:none"/>  
													<input type=checkbox id="99" onChange="plotexp()">
												 Start Date:<input type="datetime-local" id="dat" onChange='saveValue(this);'/> 
												Rate in seconds:<input type="number" id="datR" onkeyup='saveValue(this);'/>  
											</form>
										</section>
									</div>
									<div class="row 50%">
										<form action="#" method="post" enctype="multipart/form-data">
											<input type="file" accept=".csv" id="my_upload" name="my_upload"/>
											<input type="submit" value="Upload CSV"><br><br>
										</form>	
									
											<script type="text/javascript">	
												labels();									
												if (!!navigator.userAgent.match(/Trident\/7\./)){ //if IE is used
													plotIE();
													alert("Dates don't plot on Internet Explorer correctly. Get off it you Dinasour!");
												}
												else {
													document.getElementById("Stan").checked = (getSavedValue("Stan") == "true");
													document.getElementById("Fan").checked = (getSavedValue("Fan") == "true");
													document.getElementById("Exp").checked = (getSavedValue("Exp") == "true");
													if (document.getElementById("Stan").checked) plot();
													else if (document.getElementById("Fan").checked) plotfancy();
													else {plotexp(); document.getElementById("Exp").checked = true;}
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
<?php      
if ($_SERVER['REQUEST_METHOD'] == 'POST') 
{
  if (is_uploaded_file($_FILES['my_upload']['tmp_name'])) 
  { 
  	//First, Validate the file name
  	if(empty($_FILES['my_upload']['name']))
  	{
  		echo " File name is empty! ";
  		exit;
  	}
 
  	$upload_file_name = $_FILES['my_upload']['name'];
  	//Too long file name?
  	if(strlen ($upload_file_name)>100)
  	{
  		echo " too long file name ";
  		exit;
  	}
 
  	//replace any non-alpha-numeric cracters in th file name
  	$upload_file_name = "graph.csv";
 
    //Save the file
    $dest=__DIR__.'/uploads/'.$upload_file_name;
    if (move_uploaded_file($_FILES['my_upload']['tmp_name'], $dest)) 
    {
    	echo 'File Has Been Uploaded !',
			'<script Language="Javascript">',
			//'Redirect();',
			'</script>'
		;
    }
  }
} 
?>	

