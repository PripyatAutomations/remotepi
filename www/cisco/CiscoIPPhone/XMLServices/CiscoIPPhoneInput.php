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
 * CiscoIPPhoneInput
 *   service class for building user input objects
 *
 * @author twinfield
 */
require_once('CiscoIPPhone/Core/CiscoXMLService.php');
require_once('CiscoIPPhone/Core/CiscoXMLInputItem.php');

class CiscoIPPhoneInput extends CiscoXMLService
{
    protected $_inputItems;

    public function __construct()
    {
        parent::__construct();
        $this->service = new DOMDocument('1.0', 'utf-8');
        $this->service->appendChild($this->service->createElement('CiscoIPPhoneInput'));

        $this->_inputItems = array();
    }

    public function setTitle($title)
    {
        if($this->service->getElementsByTagName('Title')->length > 0) {
            $this->service->getElementsByTagName('Title')->item(0)->nodeValue = htmlspecialchars($title);
        } else {
            $this->service->documentElement->appendChild($this->service->createElement('Title', htmlspecialchars($title)));
        }
    }

    public function setPrompt($prompt)
    {
        if($this->service->getElementsByTagName('Prompt')->length > 0) {
            $this->service->getElementsByTagName('Prompt')->item(0)->nodeValue = htmlspecialchars($prompt);
        } else {
            $this->service->documentElement->appendChild($this->service->createElement('Prompt', htmlspecialchars($prompt)));
        }
    }

    public function setURL($url)
    {
        if($this->service->getElementsByTagName('URL')->length > 0) {
            $this->service->getElementsByTagName('URL')->item(0)->nodeValue = htmlspecialchars($url);
        } else {
            $this->service->documentElement->appendChild($this->service->createElement('URL', htmlspecialchars($url)));
        }
    }

    public function addItem($name, $param, $default = "", $mask = "A")
    {
        $inputItem = new CiscoXMLInputItem();
        $inputItem->setName($name);
        $inputItem->setParam($param);
        $inputItem->setDefault($default);
        $inputItem->setMask($mask);

        if(!$this->hasItem($inputItem))
            $this->insertItem($inputItem);
    }

    protected function insertItem($inputItem)
    {
        if($inputItem instanceof CiscoXMLInputItem)
            array_push($this->_inputItems, $inputItem);
    }

    public function hasItem($inputItem)
    {
        foreach($this->_inputItems as $i)
        {
            if($i->getParam() == $inputItem->getParam())
                return true;
        }
        return false;
    }

    public function toXML()
    {
        foreach($this->_inputItems as $i)
        {
            $this->service->documentElement->appendChild($this->service->importNode($i->inputItem->documentElement, true));
        }
        return parent::toXML();
    }
}
?>
