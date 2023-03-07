<?php

$url = "http://www.youtube.com/watch?v=C4kxS1ksqtw&feature=relate";
parse_str( parse_url( $url, PHP_URL_QUERY ), $my_array_of_vars );
echo $my_array_of_vars['v'];

?>