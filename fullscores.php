<!DOCTYPE HTML>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5QF2LGP');</script>
<!-- End Google Tag Manager -->
<html>
	<head>
		<meta name="google-site-verification" content="kpsLUnsJWucTZ6oW1a_uTQyEd5uerJiWXow9sE-NAjw" />
		<title>Scores</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="Scores" />
		<meta name="keywords" content="Scores" />
		<link rel="stylesheet" href="css/style.css"/>
		<script defer src="js/jquery.min.js"></script>
		<script defer src="js/jquery.dropotron.min.js"></script>
		<script defer src="js/skel.min.js"></script>
		<script defer src="js/skel-layers.min.js"></script>
		<script defer src="js/init.js?=v1.0"></script>
		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-desktop.css" />
		</noscript>
	</head>
	<body class="left-sidebar">
		<!-- Google Tag Manager (noscript) -->
		<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5QF2LGP"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<!-- End Google Tag Manager (noscript) -->
		<!-- Header -->
		<div id="header-wrapper" class="wrapper">
			<div id="header">
				<!-- Logo -->
				<div id="logo">
					<h1><a href="#">Scores</a></h1><br>							
				</div>
				<!-- Nav -->
				<nav id="nav">
				</nav>
			</div>
		</div>
		<br>			
		<?php			
			if ($_COOKIE['game'] == 'rex') $a2 = json_decode(file_get_contents('./uploads/scores.json'), true);
			if ($_COOKIE['game'] == 'mole') $a2 = json_decode(file_get_contents('./uploads/molescores.json'), true);
			if ($_COOKIE['game'] == 'simon') $a2 = json_decode(file_get_contents('./uploads/simonscores.json'), true);
			array_multisort(array_column($a2, '1'), SORT_DESC, $a2);
		?>
			<table class="scores">
				<tr>
					<th>Name</th>
					<th>High <br>Score</th>
					<th>High Score Date</th>
					<th>Last Played Date</th>
				</tr>
				<?php foreach ($a2 as &$val){ ?>
				<tr>
					<td><?php echo $val[0]; ?></td>
					<td><?php echo $val[1]; ?></td>
					<td><?php echo $val[2]; ?></td>
					<td><?php echo $val[3]; ?></td>
				</tr>
				<?php	}?>
			</table>	
		<div id="main">	</div>
		<div id="copyright">
			<ul>
				<li>&copy; Hans Juneby.</li><li>Design: <a href="http://html5up.net">HTML5 UP & Hans Juneby</a></li>
			</ul>
		</div>
	</body>
</html>