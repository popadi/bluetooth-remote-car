# bluetooth-remote-car-app

## Introduction

The theme of this projects consisted in building a little toy car that can be controlled through Bluetooth (from a device that has Android) or from a custom web application. A simple prototype of this car was built by me a couple of years ago, using Arduino, but I thought it will be a challenge to redo the project from scratch using a PCB, some wires and components to a fully functional device.

## General description

The flow is slightly different, depending on the control mode. If we use the Android app, the signals will be sent directly to the car's Bluetooth module. If we use the Desktop application, a socket will send a signal to a Python server from the front end. The server has the role of managing the actual communication with the car. This, in turn, will serialize the data and send it to the Bluetooth module.
Once that the data reach the HC-05 module, it will be interpreted by ATMega324, the latter controlling the motors in an appropriate manner. The simplified flow of the project can be seen in the scheme below.

![alt text](https://github.com/PopAdi/bluetooth-remote-car-app/blob/master/_images/img_1.png)

## Hardware Design

Components list:

| Name                      	| Code        	| Quantity 	| Price (RON)   	|
|----------------------------------	|--------------------	|-----------	|--------------	|
| Custom PCB            	| -                  	| 1         	| 8            	|
| PCB Main Components 	| -                  	| 1         	| 46           	|
| Bluetooth Module                  	| HC-05              	| 1         	| 29           	|
| Motors Driver                   	| L298N              	| 1         	| 39           	|
| Distance Sensor                  	| Sharp GP2D120XJ00F 	| 1         	| 92           	|
| Stepper motor            	| -                  	| 4         	| 29           	|
| Mini breadboard                  	| -                  	| 1         	| 5            	|
| 9V Adapter              	| -                  	| 1         	| 4            	|
| M-M Wires                   	| -                  	| 15        	| 7 (x10 wires) 	|
| M-F Wires                   	| -                  	| 15        	| 7 (x10 wires) 	|
| Wheels                     	| -                  	| 4         	| 29 (x2 wheels) 	|
| Plexiglass chassis                  	| -                  	| 1         	| -            	|
| Plexiglass chassis                  	| -                  	| 1         	| -            	|
| Legos                       	| -                  	| a lot     	| 150           	|

The electrical circuit components can be seen in the picture below. I made the schematic by separating the main modules used, but the labels associated with outputs or inputs are clear, observing how they should connect in reality. I've also introduced some of the optional board features, such as 3.3V power supply or auxiliary power supply through the 12V DC plug.

![alt text](https://github.com/PopAdi/bluetooth-remote-car-app/blob/master/_images/img_2.png)

## Software Design
The algorithm is simple: in an infinite loop (after initialization of the ADC and other ports) I wait for serial messages coming through the Bluetooth module. Depending on what is received, I enable / disable certain flags (`moveF = move forward`,` moveL = move left`, etc.). Once the command is identified, in case it is valid, call the main function called `move_car ()`. Here, first, the distance to the nearest frontal obstacle is measured. If it exists and is in a 'danger zone', the car will stand still. Otherwise, depending on the command I received (left, right, forward, backward, stop), I will enable / disable some outputs to produce the desired behavior of the machine (I used the logic table of the engine driver).

## Results

![alt text](https://github.com/PopAdi/bluetooth-remote-car-app/blob/master/_images/img_3.jpg)
![alt text](https://github.com/PopAdi/bluetooth-remote-car-app/blob/master/_images/img_4.jpg)
![alt text](https://github.com/PopAdi/bluetooth-remote-car-app/blob/master/_images/img_5.jpg)

## Conclusions
The entire project has tried my electronics capabilities and also the beginner in embedded programming. Although I had worked with Arduino before, it was a challenge to realize this project in C, making me realize how complicated are sometimes all the simple functions in the Arduino interface (for example serial communication, but last but not least, reading sensor data).

## Victims
Unfortunately, a Bluetooth HC-05 module went unheeded after I tried to power it, forgetting the USB power supply in the PCB. At the time of the incident, a small sound of 'poof' was heard, after which the magic smoke was felt in the air.
