#define F_CPU 16000000
#include <avr/io.h>
#include <util/delay.h>
#include <avr/interrupt.h>
#include <stdio.h>
#include <ctype.h>
#include "usart.h"

#define BOOL(ok) (ok == 0 ? FALSE : TRUE)
#define DCHANNEL 0
#define FALSE 0
#define TRUE  1

int moveF = 0;
int moveB = 0;
int moveL = 0;
int moveR = 0;
int moveS = 0;
int moveV = 0;

void ADC_init(void) {
	ADMUX   = (1 << REFS0);	
	ADCSRA  = (1 << ADEN); 
	ADCSRA |= (1 << ADPS2) | (1 << ADPS1) | (1 << ADPS0);
}

uint16_t ADC_get(uint8_t channel) {
    ADMUX = (ADMUX & ~(0x1f << MUX0)) | channel;
	ADCSRA = (1 << ADEN) | (1 << ADPS2);
    ADCSRA |= (1 << ADSC);

	loop_until_bit_is_set(ADCSRA, ADIF);
    return ADC;
}

double get_dist(int voltage) {
    double a = -3.0 / 77.0;
    double b = 3380.0 / 77.0;
    return a * voltage + b;
}

void stop_motors() {
    PORTA &= ~(1 << PA0);
    PORTA &= ~(1 << PA1);
    PORTA &= ~(1 << PA2);
    PORTA &= ~(1 << PA3);
}

/*
 * IN1 IN2
 *  0   0   Motor is stopped
 *  0	1	Motor A is on and turning backwards
 *  1	0	Motor A is on and turning forwards
 *  1	1	Motor A is stopped (brakes)
 */
void move_car() {
    if (get_dist(ADC_get(7)) < 17.0 && moveF) {
        stop_motors();
        return;
    } 
        
    if (moveF) {
        /* Motoare partea dreapta */
        PORTA |=  (1 << PA0);
        PORTA &= ~(1 << PA1);
        
        /* Motoare partea stanga */
        PORTA |=  (1 << PA2);
        PORTA &= ~(1 << PA3);
        
        if (moveL) {
            PORTA &= ~(1 << PA2);
            PORTA &= ~(1 << PA3);
        } else if (moveR) {
            PORTA &= ~(1 << PA0);
            PORTA &= ~(1 << PA1);
        } 
    }  else if (moveB) {
        /* Motoare partea dreapta */
        PORTA |=  (1 << PA1);
        PORTA &= ~(1 << PA0);
        
        /* Motoare partea stanga */
        PORTA |=  (1 << PA3);
        PORTA &= ~(1 << PA2);
        
        if (moveR) {
            PORTA &= ~(1 << PA2);
            PORTA &= ~(1 << PA3);
        } else if (moveL) {
            PORTA &= ~(1 << PA0);
            PORTA &= ~(1 << PA1);
        } 
    } else {
        stop_motors();
    }
}

void analyze_command(char raw_command, char *command, int *press) {
	*command = toupper(raw_command);
	*press = toupper(raw_command) == raw_command ? 1 : 0;
}

void init_usart() {
    USART0_init();
}

void init_ports() {
    /* Board led */
    DDRD  |=  (1 << PD7);
	PORTD &= ~(1 << PD7);
    
    /* Init the motors */
    DDRA |= (1 << PA0);
	DDRA |= (1 << PA1);
	DDRA |= (1 << PA2);
	DDRA |= (1 << PA3);
    
    /* Distance sensor */
    DDRA  &= ~(1 << PA7);
}


int main() {
    char buff[32];
    char c;
    int on;
    
    init_usart();
    init_ports();
    ADC_init();
    
    while (1) {
        analyze_command(USART0_receive(), &c, &on);
        sprintf(buff, "You pressed [%c]\r\n", c);
        USART0_print(buff);

        switch (c) {
            case 'w':
            case 'W':
                moveF = BOOL(on);
                moveB = FALSE;
                moveV = TRUE;
                break;
            case 's':
            case 'S':
                moveB = BOOL(on);
                moveF = FALSE;
                moveV = TRUE;
                break;
            case 'a':
            case 'A':
                moveL = BOOL(on);
                moveR = FALSE;
                moveV = TRUE;
                break;
            case 'd':
            case 'D':
                moveR = BOOL(on);
                moveL = FALSE;
                moveV = TRUE;
                break;
            case 'x':
            case 'X':
                moveF = FALSE;
                moveB = FALSE;
                moveR = FALSE;
                moveL = FALSE;
                moveV = TRUE;
                moveS = TRUE;
            default:
                break;
        }
        
        if (moveV) 
            move_car();
        
        PORTD ^= (1 << PD7);
        _delay_ms(25);
    }

	return 0;
}
