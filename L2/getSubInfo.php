<?php
error_reporting(E_ALL);
header('Content-type: text/xml'); // Output header
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<subject>'; // Root element

if (isset($_GET["file"])) { // Get the XML file
	$fileUrl = $_GET["file"];
	$doc = new DomDocument('1.0','UTF-8');
	$doc->load($fileUrl); // Load the XML file
	$notFound = true;
	if (isset($_GET["id"])) { // Get the departmentinfo
		$id = $_GET["id"];
		$department = $doc->getElementsByTagName("subject");
		foreach ($department as $d) {
			$depid = $d->getAttribute("id");
			if ($id == $depid) { // Selected department
				$name = $d->getElementsByTagName("name");
				echo $doc->saveXML($name->item(0));
				$info = $d->getElementsByTagName("info");
				echo $doc->saveXML($info->item(0));
				$notFound = false;
				break;
			}
		}
	}
	if ($notFound) echo '<info>Ingen info om ämnet.</info>';
}
else echo '<info>Ingen fil angiven</info>';

echo '</subject>'; // End of root element
?>