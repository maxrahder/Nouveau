<?php
$filename = "../../Data/topics/" . $_POST[topicId] . ".json" ;

echo($filename);
    
$file = fopen( $filename, "w+" );
if ($file){
	fputs($file,$_POST[content]);
	fclose( $file );
} else {
	echo("Unable to open file " + $filename);
}
?>