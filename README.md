# ElDumper

🎮 A GB Cartridge Dumper, based on [GBCartRead](https://github.com/insidegadgets/GBCartRead). It adds an Electron app that acts as frontend.

Both *GBCartRead* and *ElDumper* are licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License.
http://creativecommons.org/licenses/by-nc/3.0/

> <img alt="rlabs" width="16" height="16" src="https://user-images.githubusercontent.com/1631752/116227197-400d2380-a72a-11eb-9e7b-389aae76f13e.png" /> Created by [[r]labs](https://r-labs.io).

## Pictures

### Software

![image](https://user-images.githubusercontent.com/1631752/57579671-cc5aa900-7475-11e9-924c-65e70b1aa2e0.png)

![image](https://user-images.githubusercontent.com/1631752/57579675-d2e92080-7475-11e9-8060-1b67bea6f3bc.png)

![image](https://user-images.githubusercontent.com/1631752/57579674-cfee3000-7475-11e9-8756-b0559059e4fd.png)

### Hardware

![image](https://github.com/afska/el-dumper/assets/1631752/1ab1d74b-02a9-4892-bbb5-eecb3e8cf226)

![image](https://user-images.githubusercontent.com/1631752/56398010-edd0c800-621c-11e9-8048-cc8fcd4c1204.jpg)

![image](https://user-images.githubusercontent.com/1631752/53384943-72107880-395b-11e9-828f-23b45eecf5db.png)

## Instructions

Flash the **Arduino Uno** with `firmware/firmware.ino`

### Electron GUI (Linux & Windows)

- Download it from **Releases**
- Run `ElDumper.AppImage` or `ElDumper.exe`

### Python CLI (Fedora)

- `sudo dnf install python3`
- `pip3 install pyserial`
- `python3 software/python-reader/reader.py` (check port `/dev/ttyACM0`)

## References

- (SLOT)(BREADBOARD)(ARDUINO UNO)
- Cartridge labels go upwards. Pin 1 is the lower one.
- The left 74HC595N shifts the high ports of the cartridge.
- The right 74HC595N shifts the low ports of the cartridge.

## Connections

_(based on Hardware Picture 2)_

- Connect 5V to the upper-right +
- Connect GND to the upper-right -
- Connect PINA3 to the 13-down trail (GB pin #3, orange cable)
- Connect PINA5 to the 10-down trail (GB pin #4, gray cable)
- Connect PINA4 to the 11-down trail (GB pin #5, white cable)
- Connect PIN12 to the 12-up trail (74HC595N pins #11, blue cables)
- Connect PIN11 to the 11-up trail (right 74HC595N pin #14, turquoise cable)
- Connect PIN10 to the 10-up trail (75HC595N pins #12, yellow cables)
- Connect PIN09 to the 39-up trail (GB pin #29, gray cable)
- Connect PIN08 to the 38-up trail (GB pin #28, white cable)
- Connect PIN07 to the 37-up trail (GB pin #27, brown cable)
- Connect PIN06 to the 36-up trail (GB pin #26, turquoise cable)
- Connect PIN05 to the 35-up trail (GB pin #25, blue cable)
- Connect PIN04 to the 34-up trail (GB pin #24, black cable)
- Connect PIN03 to the 33-up trail (GB pin #23, red cable)
- Connect PIN02 to the 32-up trail (GB pin #22, white cable)
