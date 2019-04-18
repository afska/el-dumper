# GB Cartridge Dumper
Basado en https://github.com/insidegadgets/GBCartRead

![image](https://user-images.githubusercontent.com/1631752/53384943-72107880-395b-11e9-828f-23b45eecf5db.png)

## Instrucciones
- `sudo dnf install python3`
- `pip3 install pyserial`
- Flashear GBCartRead_v1_5.ino al Arduino
- `python3 GBCartRead_v1.5_Python_Reader.py` (revisar puerto `/dev/ttyACM0`)

## Referencias
- (SLOT)(PROTOBOARD)(ARDUINO UNO)
- Los cartuchos van con la etiqueta para arriba, el pin 1 es el de abajo de todo.
- El 74HC595N de la izquierda shiftea los puertos altos del cartucho.
- El 74HC595N de derecha shiftea los puertos bajo del cartucho.

## Conexiones
- Conectar 5V a + de arriba a la derecha
- Conectar GND a - de arriba a la derecha
- Conectar PINA3 a la pista 13-abajo (pin #3 de GB, cable naranja)
- Conectar PINA5 a la pista 10-abajo (pin #4 de GB, cable gris)
- Conectar PINA4 a la pista 11-abajo (pin #5 de GB, cable blanco)
- Conectar PIN12 a la pista 12-arriba (pines #11 de los 74HC595N, cables azules)
- Conectar PIN11 a la pista 11-arriba (pin #14 del 74HC595N de la derecha, cable turquesa)
- Conectar PIN10 a la pista 10-arriba (pines #12 de los 75HC595N, cables amarillos)
- Conectar PIN09 a la pista 39-arriba (pin #29 de GB, cable gris)
- Conectar PIN08 a la pista 38-arriba (pin #28 de GB, cable blanco)
- Conectar PIN07 a la pista 37-arriba (pin #27 de GB, cable marrón)
- Conectar PIN06 a la pista 36-arriba (pin #26 de GB, cable turquesa)
- Conectar PIN05 a la pista 35-arriba (pin #25 de GB, cable azul)
- Conectar PIN04 a la pista 34-arriba (pin #24 de GB, cable negro)
- Conectar PIN03 a la pista 33-arriba (pin #23 de GB, cable rojo)
- Conectar PIN02 a la pista 32-arriba (pin #22 de GB, cable blanco)
