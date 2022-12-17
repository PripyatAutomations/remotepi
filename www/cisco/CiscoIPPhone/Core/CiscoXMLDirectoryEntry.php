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
 * CiscoXMLDirectoryEntry
 *   object class for building entries for phone directory object
 *
 * @author twinfield
 */
class CiscoXMLDirectoryEntry
{
    public $directoryEntry;

    public function __construct()
    {
        $this->directoryEntry = new DOMDocument('1.0', 'utf-8');
        $this->directoryEntry->appendChild($this->directoryEntry->createElement('DirectoryEntry'));
    }

    public function setName($name)
    {
        if($this->directoryEntry->getElementsByTagName('Name')->length > 0) {
            $this->directoryEntry->getElementsByTagName('Name')->item(0)->nodeValue = htmlspecialchars($name);
        } else {
            $this->directoryEntry->documentElement->appendChild($this->directoryEntry->createElement('Name', htmlspecialchars($name)));
        }
    }

    public function getName()
    {
        return $this->directoryEntry->getElementsByTagName('Name')->item(0)->nodeValue;
    }

    public function setNumber($number)
    {
        if($this->directoryEntry->getElementsByTagName('Telephone')->length > 0) {
            $this->directoryEntry->getElementsByTagName('Telephone')->item(0)->nodeValue = (string)$number;
        } else {
            $this->directoryEntry->documentElement->appendChild($this->directoryEntry->createElement('Telephone', (string)$number));
        }
    }

    public function getNumber()
    {
        return $this->directoryEntry->getElementsByTagName('Telephone')->item(0)->nodeValue;
    }
}
?>
