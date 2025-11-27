#include <iostream>
#include <cstdio>
#include <stdio.h>

#include "sum.h"

int main()
{

  using namespace std;

  int x = 4;
  float y = 3.5;
  bool z = true;

  addNumber(5, 10);
  addNumber(x, 20);

  cout << "Address of x: " << &x << endl;
  cout << "Address of y: " << &y << endl;
  cout << "Address of z: " << &z << endl;

  cout << "Integer: " << x << " Size: " << sizeof(x) << " bytes" << endl;
  cout << "Float: " << y << " Size: " << sizeof(y) << " bytes" << endl;
  cout << "Boolean: " << z << " Size: " << sizeof(z) << " bytes" << endl;
}
