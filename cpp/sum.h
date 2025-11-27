// sum.h
#ifndef SUM_H // 1
#define SUM_H // 2

// 3: Declaration (prototype) of the function addNumber.
//    It tells the compiler: there is a function named addNumber
//    that takes two ints and returns an int.
void addNumber(int a, int b); // 4

#endif // SUM_H     // 5

//==================================================================
//==================================================================

/**
 *  Explanation of the code:
 *  This function takes two integers as input and prints their sum.
 */
#include <iostream>

void addNumber(int a, int b)
{ // 3: Definition of addNumber declared in sum.h
  // 4: perform addition and return result
  std::cout << "Sum: " << a + b << std::endl;
}
