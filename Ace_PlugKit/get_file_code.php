<?php

function get_file_code($pathname, $encode_from="", $encode_to="")
{
	$code = file_get_contents($pathname);
	if ($encode_from && $encode_to)
		$code = iconv($encode_from, $encode_to, $code);
	return $code;
}