all: main.hex

main.elf: main.c usart.c
	avr-g++ -mmcu=atmega324p -DF_CPU=16000000 -Wall -Os -o $@ $^

main.hex: main.elf
	avr-objcopy -j .text -j .data -O ihex main.elf main.hex
	avr-size main.elf

upload:
	avrdude -c arduino -P COM12 -b 57600 -p atmega324p -U flash:w:main.hex:a
    
clean:
	rm -rf main.elf main.hex

.PHONY: all clean

