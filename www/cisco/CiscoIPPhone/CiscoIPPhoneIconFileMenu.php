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
 * CiscoIPPhoneIconFileMenu
 *   service class for building icon file menu objects
 *
 * @author twinfield
 */
require_once('CiscoIPPhone/XMLServices/CiscoIPPhoneMenu.php');
require_once('CiscoIPPhone/Core/CiscoXMLIconItem.php');

class CiscoIPPhoneIconFileMenu extends CiscoIPPhoneMenu
{
    public $_iconItems;

    public function __construct()
    {
        parent::__construct();
        $this->service = new DOMDocument('1.0', 'utf-8');
        $this->service->appendChild($this->service->createElement('CiscoIPPhoneIconFileMenu'));

        $this->_iconItems = array();
    }

    public function addIcon($url, $index)
    {
        $iconItem = new CiscoXMLIconItem();
        $iconItem->setURL($url);
        $iconItem->setIndex($index);

        if(!$this->hasIcon($iconItem))
            $this->insertIcon($iconItem);
    }

    protected function insertIcon($iconItem)
    {
        if($iconItem instanceof CiscoXMLIconItem)
            array_push($this->_iconItems, $iconItem);
    }

    public function hasIcon($iconItem)
    {
        foreach($this->_iconItems as $i)
        {
            if($i->getURL() == $iconItem->getURL())
                return true;
        }
        return false;
    }

    public function addItem($name, $url, $icon)
    {
        $menuItem = new CiscoXMLMenuItem();
        $menuItem->setName($name);
        $menuItem->setURL($url);
        $menuItem->setIcon($icon);

        if(!$this->hasItem($menuItem))
            $this->insertItem($menuItem);
    }

    public function toXML()
    {
        foreach($this->_iconItems as $i)
        {
            $this->service->documentElement->appendChild($this->service->importNode($i->iconItem->documentElement, true));
        }
        return parent::toXML();
    }
}
?>
