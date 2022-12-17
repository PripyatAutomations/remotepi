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
 * CiscoIPPhoneGraphicFileMenu
 *   service class for building graphic file menu objects
 *
 * @author twinfield
 */
require_once('CiscoIPPhone/XMLServices/CiscoIPPhoneMenu.php');

class CiscoIPPhoneGraphicFileMenu extends CiscoIPPhoneMenu
{
    public function __construct()
    {
        parent::__construct();
        $this->service = new DOMDocument('1.0', 'utf-8');
        $this->service->appendChild($this->service->createElement('CiscoIPPhoneGraphicFileMenu'));
    }

    public function addItem($name, $url, $area)
    {
        $menuItem = new CiscoXMLMenuItem();
        $menuItem->setName($name);
        $menuItem->setURL($url);
        if(is_array($area) && count($area) == 4)
            $menuItem->setTouchArea($area[0], $area[1], $area[2], $area[3]);

        if(!$this->hasItem($menuItem))
            $this->insertItem($menuItem);
    }

    public function setImageURL($url)
    {
        if($this->service->getElementsByTagName('URL')->length > 0) {
            $this->service->getElementsByTagName('URL')->item(0)->nodeValue = htmlspecialchars($url);
        } else {
            $this->service->documentElement->appendChild($this->service->createElement('URL', htmlspecialchars($url)));
        }
    }

    public function setPosition($x, $y)
    {
        if($this->service->getElementsByTagName('LocationX')->length > 0) {
            $this->service->getElementsByTagName('LocationX')->item(0)->nodeValue = (string)$x;
        } else {
            $this->service->documentElement->appendChild($this->service->createElement('LocationX', (string)$x));
        }

        if($this->service->getElementsByTagName('LocationY')->length > 0) {
            $this->service->getElementsByTagName('LocationY')->item(0)->nodeValue = (string)$y;
        } else {
            $this->service->documentElement->appendChild($this->service->createElement('LocationY', (string)$y));
        }
    }
}
?>
