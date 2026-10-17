# 4 = 10

![math game banner](https://i.ytimg.com/vi/IgwGOWq82D4/maxresdefault.jpg)

Inspired by the popular "4 = 10" math game available on the Google Play Store (and perhaps AppStore), this repository contains a JavaScript program designed to solve math puzzles where four digits are combined using basic arithmetic operations (addition, subtraction, multiplication, division) to equal a target value.

The program supports multiple target values, such as 10, 12, 24, and 100, and identifies all four-digit numbers that have at least one solution for each target.

## How It Works

The program employs a systematic approach to find solutions:

- **Permutations**: Generates all unique permutations of the four input digits.
- **Expression Patterns**: Applies predefined patterns with operators and parentheses, such as `(a + b) * (c - d)`.
- **Evaluation**: Evaluates each expression, accounting for floating-point precision with a small tolerance.
- **Optimization**: Stops checking a number once a valid solution is found, improving efficiency.

## Features

- **Multiple Targets**: Supports solving for various target values (e.g., 10, 12, 24, 100).
- **Fractional Results**: Handles fractional intermediate results in calculations.
- **Comprehensive Search**: Efficiently checks all permutations and operator combinations.
- **Output**: Generates a list of solvable four-digit numbers for each target.

## Installation

To use this program, you only need Node.js installed on your machine. Follow these steps:

`git clone https://github.com/magvtv/4_10.git`
`cd 'Math Puzzles'`

Run the script for solving
`node optimalFourIs***.js` where "***" is the target value you want to get.

## Background

The `checkPossibleDigits` program iterates through all 8889 four digits (from 1111 to 9999), extracting the digits, generating all unique permutations and tests various expression patterns using Javascript's `Function` constructor checking if the result is within a small tolerance (1e-9) of the target. It stops after finding one valid expression per number.

The results are then saved to a text files; a list of solvable four-digit numbers (e.g., `solvable_numbers_10.txt`).

## Development Journey

This project evolved through several stages:

- I started with a brute-force method, which proved too slow.
- Adopted a divide-and-conquer strategy, isolating one digit from the other three to simplify calculations.
- Added support for fractional intermediates with precise evaluation.
- Extended functionality to handle multiple target values, enhancing versatility.

This process balanced efficiency and accuracy, resulting in a robust solver.

## Contributing

Have suggestions or found a bug? Feel free to:

- Open an issue on the GitHub repository.
- Submit a pull request with your improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
