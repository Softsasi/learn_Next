#include <iostream>
#include <cstdio>
#include <stdio.h>

#include "index.h"

int main () {

  using namespace std;

  int x = 4;
  float y = 3.5;
  bool z = true;


  cin >> y;

  cout << "value" <<  sumNum(5, 10) << endl;


  cout << "Address of x: " << &x << endl;
  cout << "Address of y: " << &y << endl;
  cout << "Address of z: " << &z << endl;

  cout << "Integer: " << x << " Size: " << sizeof(x) << " bytes" << endl;
  cout << "Float: " << y << " Size: " << sizeof(y) << " bytes" << endl;
  cout << "Boolean: " << z << " Size: " << sizeof(z) << " bytes" << endl;


}
