<?php
$fileId = "../" . $_POST[dataRootPath] . "pages/" . $_POST[fileId] . ".html";
echo("Saving " . $fileId);
echo("Root:  " . $_POST[dataRootPath]);
$file = fopen( $fileId, "w+" );
if ($file) {
	fputs($file,$_POST[content]);
	fclose( $file );
} else {
	echo("Could not open " + $fileId);
}
?>