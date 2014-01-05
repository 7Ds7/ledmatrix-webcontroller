// Download and install LedControl Library
// http://playground.arduino.cc/uploads/Main/LedControl.zip
// http://playground.arduino.cc/Main/LedControl
#include <LedControl.h> 
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

/*
 Now we need a LedControl to work with.
 ***** These pin numbers will probably not work with your hardware *****
 pin 12 is connected to the DataIn 
 pin 11 is connected to the CLK 
 pin 10 is connected to LOAD 
 We have only a single MAX72XX.
 */
LedControl lc=LedControl(12,11,10,1);

/* we always wait a bit between updates of the display */
unsigned long delaytime = 100;
int inByte = 0; 
char buf[32];

void setup() {
  /*
   The MAX72XX is in power-saving mode on startup,
   we have to do a wakeup call
   */
  lc.shutdown(0,false);
  /* Set the brightness to a medium values */
  lc.setIntensity(0,8);
  /* and clear the display */
  lc.clearDisplay(0);
  lc.setScanLimit(0, 7);
  Serial.begin(9600);
  establishContact();
}

  
void loop() {

  //Serial.println("BUFF");
  GetString( buf, sizeof(buf) );
  //Serial.println( buf );
  
  int *num;
  char *p = buf;
  char *str;
  int row;
  int col;
  int state;

  int i = 0;
  while ((str = strtok_r(p, ":", &p)) != NULL) {// delimiter is the semicolon
    num[i] = atol( str );

    if ( i == 0 ) row = atol( str );
    if ( i == 1 ) col = atol( str );
    if ( i == 2 ) state = atol( str );
    i++;
   // Serial.println(str);  
  }

  lc.setLed( 0, row,col, state);
  Serial.print(row);
  Serial.print(":");
  Serial.print(col);
  Serial.print(":");
  Serial.println( state );
  delay(delaytime);
}


void GetString(char *buf, int bufsize){
  int i;
  for (i=0; i<bufsize - 1; ++i)
  {
    //instead of 0 try 13 which is \r
    while (Serial.available() == 0); //wait for character to arrive
    buf[i] = Serial.read();
    if (buf[i] == 0) {
      break;
    }//is it the terminator byte?
  }
  buf[i] = 0; //0 string terminator just in case 
  //Serial.flush();
}

void establishContact() {
  while (Serial.available() <= 0) {
  //Serial.println('A');   // send a capital A
    delay(300);
  }
}