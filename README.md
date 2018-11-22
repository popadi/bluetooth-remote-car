# bluetooth-remote-car-app

## Introducere

Tema acestui proiect consta in realizarea unei masinute care va putea fi controlata atat prin Bluetooth, de pe un dispozitiv ce ruleaza Android, cat si de pe o aplicatie web dintr-un browser. Un prototip simplu al acestei masinute l-am construit acum cativa ani, folosind platforma Arduino, dar am considerat ca ar fi o provocare sa incerc realizarea acesteia de la 0: de la un PCB, niste fire si componente, la un device complet functional.

## Descriere generală

Flow-ul este usor diferit, in functie de modalitatea de control. Daca folosim aplicatia Android, semnalele vor fi trimise direct catre modulul de Bluetooth al masinutei. Daca folosim aplicatia Desktop, din front-end se va trimite printr-un socket un semnal catre un server de Python. Serverul are rolul de a realiza comunicatia efectiva cu masinuta. Acesta, la randul lui, va serializa datele si le va trimite modulului de Bluetooth.
Odata ajunse la modulul HC-05, datele vor fi interpretate de catre ATMega324, acesta din urma controland motoarele intr-un mod corespunzator. Flow-ul simplificat al proiectului poate fi vizualizat in schema de mai jos.

![alt text](https://github.com/PopAdi/bluetooth-remote-car-app/blob/master/images/img_1.png)

## Hardware Design

Lista de piese:

| Nume piesa                       	| Cod produs         	| Cantitate 	| Pret (RON)   	|
|----------------------------------	|--------------------	|-----------	|--------------	|
| Placa de baza PM 2018            	| -                  	| 1         	| 8            	|
| Componente placa de baza PM 2018 	| -                  	| 1         	| 46           	|
| Modul Bluetooth                  	| HC-05              	| 1         	| 29           	|
| Driver Motoare                   	| L298N              	| 1         	| 39           	|
| Senzor distanta                  	| Sharp GP2D120XJ00F 	| 1         	| 92           	|
| Motor cu cutie viteze            	| -                  	| 4         	| 29           	|
| Mini breadboard                  	| -                  	| 1         	| 5            	|
| Adaptor baterie 9V               	| -                  	| 1         	| 4            	|
| Fire mama-mama                   	| -                  	| 15        	| 7 (x10 fire) 	|
| Fire mama-tata                   	| -                  	| 15        	| 7 (x10 fire) 	|
| Roti cauciuc                     	| -                  	| 4         	| 29 (x2 roti) 	|
| Sasiu plexiglas                  	| -                  	| 1         	| -            	|
| Sasiu plexiglas                  	| -                  	| 1         	| -            	|
| Piese lego                       	| -                  	| multe     	| 60           	|
