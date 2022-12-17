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
 * CiscoXMLSoftKeyItem
 *   object class for building softkey objects to attach to service objects
 *
 * @author twinfield
 */
class CiscoXMLSoftKeyItem
{
    public $softKeyItem;

    public function __construct()
    {
        $this->softKeyItem = new DOMDocument('1.0', 'utf-8');
        $this->softKeyItem->appendChild($this->softKeyItem->createElement('SoftKeyItem'));
    }

    public function setName($name)
    {
        if($this->softKeyItem->getElementsByTagName('Name')->length > 0) {
            $this->softKeyItem->getElementsByTagName('Name')->item(0)->nodeValue = htmlspecialchars($name);
        } else {
            $this->softKeyItem->documentElement->appendChild($this->softKeyItem->createElement('Name', htmlspecialchars($name)));
        }
    }

    public function getName()
    {
        return $this->softKeyItem->getElementsByTagName('Name')->item(0)->nodeValue;
    }

    public function setPosition($slot)
    {
        if($this->softKeyItem->getElementsByTagName('Position')->length > 0) {
            $this->softKeyItem->getElementsByTagName('Position')->item(0)->nodeValue = (string)$slot;
        } else {
            $this->softKeyItem->documentElement->appendChild($this->softKeyItem->createElement('Position', (string)$slot));
        }
    }

    public function getPosition()
    {
        return $this->softKeyItem->getElementsByTagName('Position')->item(0)->nodeValue;
    }

    public function setURL($url)
    {
        if($this->softKeyItem->getElementsByTagName('URL')->length > 0) {
            $this->softKeyItem->getElementsByTagName('URL')->item(0)->nodeValue = htmlspecialchars($url);
        } else {
            $this->softKeyItem->documentElement->appendChild($this->softKeyItem->createElement('URL', htmlspecialchars($url)));
        }
    }

    public function getURL()
    {
        return $this->softKeyItem->getElementsByTagName('URL')->item(0)->nodeValue;
    }
}
?>
