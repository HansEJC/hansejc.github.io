<?php
$a = json_decode(file_get_contents("./uploads/{$_COOKIE['test']}.json"), true);
$delete = ($_POST['delete'] === 'true');
foreach ($a as $key=>$val){ 
	if ($val['site'] == $_POST['site']){
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
file_put_contents("./uploads/{$_COOKIE['test']}.json",json_encode($a, JSON_UNESCAPED_UNICODE));
?>