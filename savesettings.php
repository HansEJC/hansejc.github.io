<?php
if ($_COOKIE['game'] == 'rex') $a = json_decode(file_get_contents('./uploads/scores.json'), true);
if ($_COOKIE['game'] == 'mole') $a = json_decode(file_get_contents('./uploads/molescores.json'), true);
if ($_COOKIE['game'] == 'simon') $a = json_decode(file_get_contents('./uploads/simonscores.json'), true);
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
if ($_COOKIE['game'] == 'rex') file_put_contents("./uploads/scores.json",json_encode($a, JSON_UNESCAPED_UNICODE));
if ($_COOKIE['game'] == 'mole') file_put_contents("./uploads/molescores.json",json_encode($a, JSON_UNESCAPED_UNICODE));
if ($_COOKIE['game'] == 'simon') file_put_contents("./uploads/simonscores.json",json_encode($a, JSON_UNESCAPED_UNICODE));
echo "Updating scores. Using cheats won't get you a high score!";   
?>
