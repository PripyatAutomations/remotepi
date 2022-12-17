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
 * CiscoXMLService
 *   base object class for service objects
 *
 * @author twinfield
 */
require_once('CiscoIPPhone/Core/CiscoXMLSoftKeyItem.php');
 
class CiscoXMLService 
{
    protected $service;
    protected $_softKeyItems;

    public function __construct()
    {
        $this->_softKeyItems = array();
    }

    public function toXML()
    {
        foreach($this->_softKeyItems as $s)
        {
            $this->service->documentElement->appendChild($this->service->importNode($s->softKeyItem->documentElement, true));
        }

        $this->service->formatOutput = true;
        return $this->service->saveXML();
    }

    public function addSoftKey($name, $url, $position)
    {
        $softKeyItem = new CiscoXMLSoftKeyItem();
        $softKeyItem->setName($name);
        $softKeyItem->setURL($url);
        $softKeyItem->setPosition($position);

        if(!$this->hasSoftKey($softKeyItem))
            $this->insertSoftKey($softKeyItem);
    }

    protected function insertSoftKey($softKeyItem)
    {
        if($softKeyItem instanceof CiscoXMLSoftKeyItem)
            array_push($this->_softKeyItems, $softKeyItem);
    }

    public function hasSoftKey($softKeyItem)
    {
        foreach($this->_softKeyItems as $s)
        {
            if($s->getName() == $softKeyItem->getName() && $s->getURL() == $softKeyItem->getURL())
                return true;
        }
        return false;
    }

    public function applyXSLT($filename)
    {
        $xslt = new XSLTProcessor();
        $xslt->importStylesheet(DOMDocument::load($filename, LIBXML_NOCDATA));
        return $xslt->transformToXml(DOMDocument::loadXML($this->toXML()));
    }
}

?>
