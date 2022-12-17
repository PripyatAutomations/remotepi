<?php
/*
 * This software is freely available and distributed under the Mozilla Public
 * License agreement (MPL).   A copy of the MPL may obtain at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
 * the specific language governing rights and limitations under the License.
 *
 * Original code by Minded Software Solutions (http://minded.ca/)
 * Initial Developer - Tyler Winfield
 * Copyright (C) Minded Software Solutions.  All Rights Reserved.
 */

/**
 * CiscoIPPhoneExecute
 *   service class for building execution request objections
 *
 * @author twinfield
 */
require_once('CiscoIPPhone/Core/CiscoXMLService.php');

class CiscoIPPhoneExecute extends CiscoXMLService 
{
    protected $_executeItems;

    public function __construct() 
    {
        parent::__construct();
        $this->service = new DOMDocument('1.0', 'utf-8');
        $this->service->appendChild($this->service->createElement('CiscoIPPhoneExecute'));

        $this->_executeItems = array();
    }
    
    public function addItem($url, $priority = 0)
    {
        if(!$this->hasItem($url)) {
            $this->insertItem($url, $priority);
            return true;
        }
        return false;
    }

    private function hasItem($url, $priority)
    {
        foreach($this->_executeItems as $e) {
            if($e->getAttribute('URL') == htmlspecialchars($url) && $e->getAttribute('Priority') == (string)$priority)
                return true;
        }
        return false;
    }

    private function insertItem($url, $priority)
    {
        $executeItem = $this->service->createElement('ExecuteItem');

        $attr_URL = $executeItem->createAttribute('URL');
        $attr_URL->appendChild($executeItem->createTextNode(htmlspecialchars($url)));
        $executeItem->appendChild($attr_URL);

        $attr_Priority = $executeItem->createAttribute('Priority');
        $attr_Priority->appendChild($executeItem->createTextNode((string)$priority));
        $executeItem->appendChild($attr_Priority);

        array_push($this->_executeItems, $executeItem);
    }

    public function toXML()
    {
        foreach($this->_executeItems as $e)
        {
            $this->service->documentElement->appendChild($this->service->importNode($e->documentElement, true));
        }
        return parent::toXML();
    }
}

?>
