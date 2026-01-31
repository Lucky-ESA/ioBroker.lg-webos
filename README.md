![Logo](admin/lg-webos.png)

# ioBroker.lg-webos

[![NPM version](https://img.shields.io/npm/v/iobroker.lg-webos.svg)](https://www.npmjs.com/package/iobroker.lg-webos)
[![Downloads](https://img.shields.io/npm/dm/iobroker.lg-webos.svg)](https://www.npmjs.com/package/iobroker.lg-webos)
![Number of Installations](https://iobroker.live/badges/lg-webos-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/lg-webos-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.lg-webos.png?downloads=true)](https://nodei.co/npm/iobroker.lg-webos/)

**Tests:** ![Test and Release](https://github.com/Lucky-ESA/ioBroker.lg-webos/workflows/Test%20and%20Release/badge.svg)

## lg-webos adapter for ioBroker

This adapter allows you to control multiple LG TVs. Please read the description to see which commands are possible.

## First step

Please turn on the TV you want to pair. Now, in the adapter settings, enter the TV's IP address and save it. The first time you connect, a pairing prompt will appear on the TV screen, which you must accept.

## Status Connection

Some TVs disconnect the WebSocket connection without indicating this. For these TVs, you can activate an interval in the adapter settings to check the connection.

## Requirements

- Node 20, 22 or 24
- JS-Controller >= 6.0.11
- Admin >= 7.6.17
- LG TV with >= WebOS 20

## Description

🇬🇧 [Description](/docs/en/README.md)</br>
🇩🇪 [Beschreibung](/docs/de/README.md)

## Questions

🇩🇪 [Fragen]()

## Changelog

<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**

- (Lucky-ESA) initial release

## License

MIT License

Copyright (c) 2026 Lucky-ESA <github@luckyskills.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
