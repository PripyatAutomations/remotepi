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
 * CiscoIPPhoneDirectory
 *   service class for building phone directory objects
 *
 * @author twinfield
 */
require_once('CiscoIPPhone/Core/CiscoXMLService.php');
require_once('CiscoIPPhone/Core/CiscoXMLDirectoryEntry.php');

class CiscoIPPhoneDirectory extends CiscoXMLService
{
    protected $_directoryEntries;

    public function __construct()
    {
        parent::__construct();
        $this->service = new DOMDocument('1.0', 'utf-8');
        $this->service->appendChild($this->service->createElement('CiscoIPPhoneDirectory'));

        $this->_directoryEntries = array();
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

    public function addEntry($name, $number)
    {
        $directoryEntry = new CiscoXMLDirectoryEntry();
        $directoryEntry->setName($name);
        $directoryEntry->setNumber($number);

        if(!$this->hasEntry($directoryEntry))
            $this->insertEntry($directoryEntry);
    }

    private function insertEntry($directoryEntry)
    {
        if($directoryEntry instanceof CiscoXMLDirectoryEntry)
            array_push($this->_directoryEntries, $directoryEntry);
    }

    public function hasEntry($directoryEntry)
    {
        foreach($this->_directoryEntries as $d)
        {
            if($d->getName() == $directoryEntry->getName() && $d->getNumber() == $directoryEntry->getNumber())
                return true;
        }
        return false;
    }

    public function toXML()
    {
        foreach($this->_directoryEntries as $d)
        {
            $this->service->documentElement->appendChild($this->service->importNode($d->directoryEntry->documentElement, true));
        }
        return parent::toXML();
    }
}
?>
