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
 * CiscoXMLIconItem
 *   object class for creating icons item objects to be associated with menu items objects
 *
 * @author twinfield
 */
class CiscoXMLIconItem {
    public $iconItem;

    public function __construct()
    {
        $this->iconItem = new DOMDocument('1.0', 'utf-8');
        $this->iconItem->appendChild($this->iconItem->createElement('IconItem'));
    }

    public function setIndex($index)
    {
        if(isset($this->iconItem->documentElement->Index)) {
            $this->iconItem->getElementsByTagName('Index')->item(0)->nodeValue = (string)$index;
        } else {
            $this->iconItem->documentElement->appendChild($this->iconItem->createElement('Index', (string)$index));
        }
    }

    public function getIndex()
    {
        return $this->iconItem->getElementsByTagName('Index')->item(0)->nodeValue;
    }

    public function setURL($url)
    {
        if($this->iconItem->getElementsByTagName('URL')->length > 0) {
            $this->iconItem->getElementsByTagName('URL')->item(0)->nodeValue = htmlspecialchars($url);
        } else {
            $this->iconItem->documentElement->appendChild($this->iconItem->createElement('URL', htmlspecialchars($url)));
        }
    }

    public function getURL()
    {
        return $this->iconItem->getElementsByTagName('URL')->item(0)->nodeValue;
    }

    public function setSize($width, $height)
    {
        if($this->iconItem->getElementsByTagName('Width')->length > 0) {
            $this->iconItem->getElementsByTagName('Width')->item(0)->nodeValue = (string)$width;
        } else {
            $this->iconItem->documentElement->appendChild($this->iconItem->createElement('Width', (string)$width));
        }

        if($this->iconItem->getElementsByTagName('Height')->length > 0) {
            $this->iconItem->getElementsByTagName('Height')->item(0)->nodeValue = (string)$height;
        } else {
            $this->iconItem->documentElement->appendChild($this->iconItem->createElement('Height', (string)$height));
        }
    }

    public function setDepth($depth)
    {
        if($this->iconItem->getElementsByTagName('Depth')->length > 0) {
            $this->iconItem->getElementsByTagName('Depth')->item(0)->nodeValue = (string)$depth;
        } else {
            $this->iconItem->documentElement->appendChild($this->iconItem->createElement('Depth', (string)$depth));
        }
    }

    public function setData($data)
    {
        if($this->iconItem->getElementsByTagName('Data')->length > 0) {
            $this->iconItem->getElementsByTagName('Data')->item(0)->nodeValue = (string)$data;
        } else {
            $this->iconItem->documentElement->appendChild($this->iconItem->createElement('Data', (string)$data));
        }
    }
}
?>
