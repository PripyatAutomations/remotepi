<?php

$include_path = explode(':', get_include_path());
$services_path = 'CiscoIPPhone/XMLServices';
for($i = 0; $i < count($include_path); $i++)
{
    if(is_dir($include_path[$i].'/'.$services_path))
    {
        if($services_dir = opendir($include_path[$i].'/'.$services_path))
        {
            while(($include_file = readdir($services_dir)) !== false)
            {
                if ($include_file != "." && $include_file != "..") {
                    require_once($services_path.'/'.$include_file);
                }
            }
        }
    }
}

?>
