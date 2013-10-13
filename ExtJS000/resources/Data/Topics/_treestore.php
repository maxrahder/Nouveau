<?php

$hierarchy = '{"text": "Root", "fileId": "", "html": "", "leaf": false, "children": [';

$hierarchy .= file_get_contents('splash.json')                . ',';
$hierarchy .= file_get_contents('overview.json')              . ',';
$hierarchy .= file_get_contents('foundation.json')            . ',';
$hierarchy .= file_get_contents('mvc.json')                   . ',';
$hierarchy .= file_get_contents('data.json')                  . ',';

$hierarchy .= '{"text": "Data-aware Components", "fileId": "", "html": "", "leaf": false, "children": [';
	$hierarchy .= file_get_contents('templates.json')         . ',';
	$hierarchy .= file_get_contents('grids.json')             . ',';
	$hierarchy .= file_get_contents('trees.json')             . ',';
	$hierarchy .= file_get_contents('forms.json')             . ',';
	$hierarchy .= file_get_contents('charts.json');
$hierarchy .= ']},';

$hierarchy .= '{"text": "Advanced", "fileId": "", "html": "", "leaf": false, "children": [';

	$hierarchy .= file_get_contents('howItWorks.json')        . ',' ;
	$hierarchy .= file_get_contents('usefulClasses.json')     . ',' ;
	$hierarchy .= file_get_contents('customComponents.json')  . ',' ;
	$hierarchy .= file_get_contents('inDepth.json')           . ',' ;
//	$hierarchy .= file_get_contents('accessability.json')     . ',' ;
	$hierarchy .= file_get_contents('whatsnew.json')          . ',' ;

$hierarchy .= ']},';


$hierarchy .= file_get_contents('theming.json')               . ',';

$hierarchy .= file_get_contents('deployment.json')            . ',' ;

$hierarchy .= '{"text": "Lab: Group Project", "fileId": "2013-01-09_17-28_26-257_Z", "html": "", "leaf": true}';

$hierarchy .= ',';

$hierarchy .= file_get_contents('appendix.json')              . ',' ;
	
//$hierarchy .= file_get_contents('orphanage.json');

$hierarchy .= ']}';

echo($hierarchy);

?>



