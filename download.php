<?php
$file = 'busra_arabaci_resume.pdf'
if (file_exists($file) && is_readable($file) && preg_match('/\.pdf$/',$file)) {
	header('Content-Type: application/pdf');
	header("Content-Disposition: attachment; filename=\"$file\"");
	readfile($file);
	}
}
?> 