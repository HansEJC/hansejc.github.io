<?php
$cookie = $_COOKIE['game'];
$a = json_decode(file_get_contents("./uploads/{$cookie}scores.json"), true);
$body = file_get_contents('php://input');
$data = json_decode($body , true);
$existed = false;
foreach ($a as &$val){
  if ($val[0] == $data['name']){
    $val[1] = $val[1] > $data['score'] ? $val[1] : $data['score'];
    $val[2] = $val[1] > $data['score'] ? $val[2] : $data['date'];
    $val[3] = $data['date'];
    $existed = true;
  }
}
if (!$existed){
  array_push($a,[$data['name'],$data['score'],$data['date'],$data['date']]);
}
file_put_contents("./uploads/{$cookie}scores.json",json_encode($a, JSON_UNESCAPED_UNICODE));
echo "Updating scores. Using cheats won't get you a high score!";
?>