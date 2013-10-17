<?php

$hierarchy = '{"text": "Root", "fileId": "", "html": "", "leaf": false, "children": [';

$hierarchy .= file_get_contents('../../Data/topics/splash.json')                . ',';
$hierarchy .= file_get_contents('../../Data/topics/overview.json')                . ',';
$hierarchy .= file_get_contents('../../Data/topics/themes.json');

$hierarchy .= ']}';

echo($hierarchy);

?>



