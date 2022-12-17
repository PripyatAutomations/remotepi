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
 * CiscoXMLMenuItem
 *   object class for building menu item objects for phone menu service object
 *
 * @author twinfield
 */
class CiscoXMLMenuItem
{
    public $menuItem;

    public function __construct()
    {
        $this->menuItem = new DOMDocument('1.0', 'utf-8');
        $this->menuItem->appendChild($this->menuItem->createElement('MenuItem'));
    }

    public function setName($name)
    {
        if($this->menuItem->getElementsByTagName('Name')->length > 0) {
            $this->menuItem->getElementsByTagName('Name')->item(0)->nodeValue = htmlspecialchars($name);
        } else {
            $this->menuItem->documentElement->appendChild($this->menuItem->createElement('Name', htmlspecialchars($name)));
        }
    }

    public function getName()
    {
        return $this->menuItem->getElementsByTagName('Name')->item(0)->nodeValue;
    }

    public function setURL($url)
    {
        if($this->menuItem->getElementsByTagName('URL')->length > 0) {
            $this->menuItem->getElementsByTagName('URL')->item(0)->nodeValue = htmlspecialchars($url);
        } else {
            $this->menuItem->documentElement->appendChild($this->menuItem->createElement('URL', htmlspecialchars($url)));
        }
    }

    public function getURL()
    {
        return $this->menuItem->getElementsByTagName('URL')->item(0)->nodeValue;
    }

    public function setIcon($index)
    {
        if($this->menuItem->getElementsByTagName('IconIndex')->length > 0) {
            $this->menuItem->getElementsByTagName('IconIndex')->item(0)->nodeValue = (string)$index;
        } else {
            $this->menuItem->documentElement->appendChild($this->menuItem->createElement('IconIndex', (string)$index));
        }
    }

    public function removeIcon()
    {
        if($this->menuItem->getElementsByTagName('IconIndex')->length > 0)
            $this->menuItem->documentElement->removeChild($this->menuItem->getElementsByTagName('IconIndex')->item(0));
    }

    public function setTouchArea($x, $y, $_x, $_y)
    {
        if($this->hasTouchArea())
            $this->removeTouchArea();

        $touchArea = $this->menuItem->createElement('TouchArea');

        $attr_x1 = $this->menuItem->createAttribute('X1');
        $attr_x1->appendChild($this->menuItem->createTextNode($x));
        $touchArea->appendChild($attr_x1);

        $attr_y1 = $this->menuItem->createAttribute('Y1');
        $attr_y1->appendChild($this->menuItem->createTextNode($y));
        $touchArea->appendChild($attr_y1);

        $attr_x2 = $this->menuItem->createAttribute('X2');
        $attr_x2->appendChild($this->menuItem->createTextNode($_x));
        $touchArea->appendChild($attr_x2);

        $attr_y2 = $this->menuItem->createAttribute('Y2');
        $attr_y2->appendChild($this->menuItem->createTextNode($_y));
        $touchArea->appendChild($attr_y2);

        $this->menuItem->documentElement->appendChild($touchArea);
    }

    public function removeTouchArea()
    {
        $this->menuItem->documentElement->removeChild($this->menuItem->getElementsByTagName('TouchArea')->item(0));
    }

    public function hasTouchArea()
    {
        if($this->menuItem->getElementsByTagName('TouchArea')->length > 0)
            return true;
        return false;
    }
    
    public function getTouchArea()
    {
        if($this->hasTouchArea())
        {
            $toucharea = array();
            $toucharea['X1'] = $this->menuItem->getElementsByTagName('TouchArea')->item(0)->getAttribute('X1');
            $toucharea['Y1'] = $this->menuItem->getElementsByTagName('TouchArea')->item(0)->getAttribute('Y1');
            $toucharea['X2'] = $this->menuItem->getElementsByTagName('TouchArea')->item(0)->getAttribute('X2');
            $toucharea['Y2'] = $this->menuItem->getElementsByTagName('TouchArea')->item(0)->getAttribute('Y2');
        }
        return false;
    }
}

?>
