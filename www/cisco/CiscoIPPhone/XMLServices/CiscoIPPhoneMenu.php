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
 * CiscoIPPhoneMenu
 *   service class for building phone menu objects
 *
 * @author twinfield
 */
require_once('CiscoIPPhone/Core/CiscoXMLService.php');
require_once('CiscoIPPhone/Core/CiscoXMLMenuItem.php');

class CiscoIPPhoneMenu extends CiscoXMLService
{    
    protected $_menuItems;

    public function __construct()
    {
        parent::__construct();
        $this->service = new DOMDocument('1.0', 'utf-8');
        $this->service->appendChild($this->service->createElement('CiscoIPPhoneMenu'));

        $this->_menuItems = array();
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

    public function addItem($name, $url)
    {
        $menuItem = new CiscoXMLMenuItem();
        $menuItem->setName($name);
        $menuItem->setURL($url);

        if(!$this->hasItem($menuItem))
            $this->insertItem($menuItem);
    }

    protected function insertItem($menuItem)
    {
        if($menuItem instanceof CiscoXMLMenuItem)
            array_push($this->_menuItems, $menuItem);
    }

    public function hasItem($menuItem)
    {
        foreach($this->_menuItems as $m)
        {
            if($m->getName() == $menuItem->getName() && $m->getURL() == $menuItem->getURL())
                return true;
        }
        return false;
    }

    public function toXML()
    {
        foreach($this->_menuItems as $m)
        {
            $this->service->documentElement->appendChild($this->service->importNode($m->menuItem->documentElement, true));
        }
        return parent::toXML();
    }
}
?>
