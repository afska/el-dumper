# GB Cartridge Dumper
Basado en https://github.com/insidegadgets/GBCartRead

![image](https://user-images.githubusercontent.com/1631752/53384943-72107880-395b-11e9-828f-23b45eecf5db.png)

## Instrucciones
- Instalar Python 3
- Instalar pyserial (pip install pyserial)
- Flashear GBCartRead_v1_5.ino al Arduino
- `python3 GBCartRead_v1.5_Python_Reader.py` (revisar puerto, /dev/ttyACM0)

## Referencias
- (SLOT)(PROTOBOARD)(ARDUINO UNO)
- Los cartuchos van con la etiqueta para arriba, el pin 1 es el de abajo de todo.
- El 74HC595N de la izquierda shiftea los puertos altos del cartucho.
- El 74HC595N de derecha shiftea los puertos bajo del cartucho.

## Conexiones
- Conectar 5V a + de arriba a la derecha
- Conectar GND a - de arriba a la derecha
- Conectar PINA3 a la pista 13 (pin #3 de GB, cable naranja)
- Conectar PINA5 a la pista 9 (pin #4 de GB, cable gris)
- Conectar PINA4 a la pista 11 (pin #5 de GB, cable blanco)
- Conectar PIN12 a la pista 12 (pines #11 de los 74HC595N, cables azules)
- Conectar PIN11 a la pista 11 (pin #14 del 74HC595N de la derecha, cable turquesa)
- Conectar PIN10 a la pista 10 (pines #12 de los 75HC595N, cables amarillos)
- Conectar PIN9 a la pista 39 (pin #29 de GB, cable gris)
- Conectar PIN8 a la pista 38 (pin #28 de GB, cable blanco)
- Conectar PIN7 a la pista 37 (pin #27 de GB, cable marrón)
- Conectar PIN6 a la pista 36 (pin #26 de GB, cable turquesa)
- Conectar PIN5 a la pista 35 (pin #25 de GB, cable azul)
- Conectar PIN4 a la pista 34 (pin #24 de GB, cable negro)
- Conectar PIN3 a la pista 33 (pin #23 de GB, cable rojo)
- Conectar PIN2 a la pista 32 (pin #22 de GB, cable blanco)
