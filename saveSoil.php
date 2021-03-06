<?php
$a = json_decode(file_get_contents("./uploads/{$_COOKIE['test']}.json"), true);
$body = file_get_contents('php://input');
$data = json_decode($body , true);
$delete = $data['delete'];
foreach ($a as $key=>$val){ 
	if ($val['site'] == $data['site']){
		\array_splice($a, $key, 1);
	}
	echo $delete['delete'];
}
if (!$delete){
	array_unshift($a,['site' => $data['site'],'results' => $data['results']]);
	echo "Saving test results to the server";  
}
else {
	echo "Deleting from the server";
} 
file_put_contents("./uploads/{$_COOKIE['test']}.json",json_encode($a, JSON_UNESCAPED_UNICODE));
?>