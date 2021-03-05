<?php
$cookie = $_COOKIE['game'];
$a = json_decode(file_get_contents("./uploads/{$cookie}scores.json"), true);
$existed = false;
foreach ($a as &$val){ 
	if ($val[0] == $_POST['name']){
		$val[1] = $val[1] > $_POST['score'] ? $val[1] : $_POST['score'];
		$val[2] = $val[1] > $_POST['score'] ? $val[2] : $_POST['date'];			
		$val[3] = $_POST['date'];
		$existed = true;
	}
}
if (!$existed){
	array_push($a,[$_POST['name'],$_POST['score'],$_POST['date'],$_POST['date']]);
}
file_put_contents("./uploads/{$cookie}scores.json",json_encode($a, JSON_UNESCAPED_UNICODE));
echo "Updating scores. Using cheats won't get you a high score!";   
?>