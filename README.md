# bluetooth-remote-car-app

## Introducere

Tema acestui proiect consta in realizarea unei masinute care va putea fi controlata atat prin Bluetooth, de pe un dispozitiv ce ruleaza Android, cat si de pe o aplicatie web dintr-un browser. Un prototip simplu al acestei masinute l-am construit acum cativa ani, folosind platforma Arduino, dar am considerat ca ar fi o provocare sa incerc realizarea acesteia de la 0: de la un PCB, niste fire si componente, la un device complet functional.

## Descriere generală

Flow-ul este usor diferit, in functie de modalitatea de control. Daca folosim aplicatia Android, semnalele vor fi trimise direct catre modulul de Bluetooth al masinutei. Daca folosim aplicatia Desktop, din front-end se va trimite printr-un socket un semnal catre un server de Python. Serverul are rolul de a realiza comunicatia efectiva cu masinuta. Acesta, la randul lui, va serializa datele si le va trimite modulului de Bluetooth.
Odata ajunse la modulul HC-05, datele vor fi interpretate de catre ATMega324, acesta din urma controland motoarele intr-un mod corespunzator. Flow-ul simplificat al proiectului poate fi vizualizat in schema de mai jos.

![alt text](https://github.com/PopAdi/bluetooth-remote-car-app/blob/master/_images/img_1.png)

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

Componentele schemei electrice pot fi vizualizate in imaginea de mai jos. Am realizat schema separand oarecum principalele module folosite, insa label-urile asociate iesirilor sau intrarilor sunt clare, observandu-se cum ar trebui sa se conecteze in realitate. Am introdus si cateva din elementele optionale de la realizarea placii, precum alimentarea la 3.3V sau modului auxiliar de alimentare prin mufa DC de 12V.

![alt text](https://github.com/PopAdi/bluetooth-remote-car-app/blob/master/_images/img_2.png)

## Software Design
Mediul de dezvoltare al aplicatiei a fost Sublime Text 3.0. Nu au fost utilizate biblioteci sau surse 3rd-party, inafara de mini-biblioteca de usart din cadrul laboratului. Algoritmul este unul simplu: intr-o bucla infinita (dupa initializarea ADC-ului si a celorlalte porturi) astept mesaje de pe seriala, care vin prin intermediul modulului Bluetooth. In functie de ce se primeste, activez/dezactivez anumite flag-uri (moveF = move forward, moveL = move left etc.). Odata identificata comanda, in caz ca este valida, se apeleaza functia principala numita move_car(). Aici, in primul rand se masoara distanta catre cel mai apropiat obstacol frontal. In caz ca exista si se afla intr-un 'danger zone', masina va sta pe loc. In caz contrar, in functie de comanda primita (left, right, forward, backward, stop) voi activa/dezactiva anumite iesiri, pentru a produce comportamentul dorit masinutei (m-am folosit de tabelul logic al driver-ului de motoare).

Codul sursa pentru masinuta poate fi vizualizat in arhiva de mai jos. Pentru aplicatia web folosita, am atasat un link catre un repository personal. Este o aplicatie web scrisa in python si javascript care permite detectarea device-urilor bluetooth din jur, conectarea la unul dintre ele, iar odata ce conexiunea este stabilita, suntem redirectionati catre o pagina unde avem formwatul WASD + Space din jocuri, pentru controlul masinutei.

## Concluzii 
 Intreg proiectul mi-a pus la incercare capacitatile de mic electronist si de asemenea, de incepator in programarea embedded. Desi mai lucrasem inainte cu Arduino, a fost o provocare sa realizez acest proiect in C, dandu-mi seama cat de complicate sunt uneori toate functiile simple din interfata Arduino (de exemplu comunicarae seriala, dar nu in ultimul rand, citirea datelor senzorilor).

## Victime
Din nefericire, un modul de Bluetooth HC-05 a trecut in nefiinta dupa ce am incercat sa il alimentez, uitat alimentarea USB in placa. La momentul producerii incidentului, s-a auzit un mic sunet de 'poof', dupa care s-a facut simtit fumul magic din interior.
