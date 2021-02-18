<?php
if ($_COOKIE['test'] == 'soil') $a = json_decode(file_get_contents('./uploads/soil.json'), true);
if ($_COOKIE['test'] == 'fop') $a = json_decode(file_get_contents('./uploads/fop.json'), true);
$delete = ($_POST['delete'] === 'true');
foreach ($a as $key=>$val){ 
	if ($val['site'] == $_POST['site']){
		#unset($a[$key]);
		\array_splice($a, $key, 1);
	}
}
if (!$delete){
	array_unshift($a,['site' => $_POST['site'],'results' => $_POST['results']]);
	echo "Saving test results to the server";  
}
else {
	echo "Deleting from the server";
} 
if ($_COOKIE['test'] == 'soil') file_put_contents("./uploads/soil.json",json_encode($a, JSON_UNESCAPED_UNICODE));
if ($_COOKIE['test'] == 'fop') file_put_contents("./uploads/fop.json",json_encode($a, JSON_UNESCAPED_UNICODE));
?>