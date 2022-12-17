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
 * CiscoXMLInputItem
 *    object class for building input item objects for phone input service objects
 *
 * @author twinfield
 */
class CiscoXMLInputItem
{
    public $inputItem;

    public function __construct()
    {
        $this->inputItem = new DOMDocument('1.0', 'utf-8');
        $this->inputItem->appendChild($this->inputItem->createElement('InputItem'));
    }

    public function setName($name)
    {
        if($this->inputItem->getElementsByTagName('DisplayName')->length > 0) {
            $this->inputItem->getElementsByTagName('DisplayName')->item(0)->nodeValue = htmlspecialchars($name);
        } else {
            $this->inputItem->documentElement->appendChild($this->inputItem->createElement('DisplayName', htmlspecialchars($name)));
        }
    }

    public function getName()
    {
        return $this->inputItem->getElementsByTagName('DispalyName')->item(0)->nodeValue;
    }

    public function setParam($param)
    {
        if($this->inputItem->getElementsByTagName('QueryStringParam')->length > 0) {
            $this->inputItem->getElementsByTagName('QueryStringParam')->item(0)->nodeValue = htmlspecialchars($param);
        } else {
            $this->inputItem->documentElement->appendChild($this->inputItem->createElement('QueryStringParam', htmlspecialchars($param)));
        }
    }

    public function getParam()
    {
        return $this->inputItem->getElementsByTagName('QueryStringParam')->item(0)->nodeValue;
    }

    public function setDefault($default)
    {
        if($this->inputItem->getElementsByTagName('DefaultValue')->length > 0) {
            $this->inputItem->getElementsByTagName('DefaultValue')->item(0)->nodeValue = htmlspecialchars($default);
        } else {
            $this->inputItem->documentElement->appendChild($this->inputItem->createElement('DefaultValue', htmlspecialchars($default)));
        }
    }

    public function setMask($mask)
    {
        if($this->inputItem->getElementsByTagName('InputFlags')->length > 0) {
            $this->inputItem->getElementsByTagName('InputFlags')->item(0)->nodeValue = $mask;
        } else {
            $this->inputItem->documentElement->appendChild($this->inputItem->createElement('InputFlags', $mask));
        }
    }
}
?>
