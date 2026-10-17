const fs = require('fs')
// Function to generate all permutations of an array
function getPermutations(arr) {
	const permutations = [];
	const permute = (arr, m = []) => {
		if (arr.length === 0) {
			permutations.push(m);
		} else {
			for (let i = 0; i < arr.length; i++) {
				const curr = arr.slice();
				const next = curr.splice(i, 1);
				permute(curr.slice(), m.concat(next));
			}
		}
	};
	permute(arr);
	return permutations;
}

// Function to safely evaluate an expression
function evaluate(expr) {
	try {
		const result = Function(`return ${expr}`)();
		// Use epsilon for floating-point comparison
		return Math.abs(result - 100) < 1e-9;
	} catch (e) {
		// Handle division by zero or other errors
		return false;
	}
}

// Define the operators
const operators = ['+', '-', '*', '/'];

// Define the expression patterns with one pair of parentheses
const patterns = [
	(a, b, c, d, op1, op2, op3) => `${a} ${op1} ${b} ${op2} (${c} ${op3} ${d})`,
	(a, b, c, d, op1, op2, op3) => `${a} ${op1} (${b} ${op2} ${c}) ${op3} ${d}`,
	(a, b, c, d, op1, op2, op3) => `(${a} ${op1} ${b}) ${op2} ${c} ${op3} ${d}`,
];

// Main function to find solvable numbers
function findSolvableNumbers() {
	const solvable = [];

	outer: for (let num = 1111; num <= 9999; num++) {
		// Log progress every 100 numbers
		if (num % 100 === 0) {
			console.log(`Processing number ${num}...`);
		}

		// Extract digits
		const digits = String(num).split('').map(Number);
		// Generate all permutations
		const permutations = getPermutations(digits);

		// Test each permutation
		for (const perm of permutations) {
			for (const pattern of patterns) {
				for (const op1 of operators) {
					for (const op2 of operators) {
						for (const op3 of operators) {
							const expr = pattern(perm[0], perm[1], perm[2], perm[3], op1, op2, op3);
							if (evaluate(expr)) {
								solvable.push(num);
								continue outer; // Move to next number
							}
						}
					}
				}
			}
		}
	}

	return solvable;
}

// Run the program
console.log('Starting the search for solvable 4-digit numbers...');
const solvableNumbers = findSolvableNumbers();
const output = solvableNumbers.join('\n')

fs.writeFile('solvable_numbers_100.txt', output, (err) => {
    if (err) {
        console.error('Error in writing to file: ', err)
    }
    else {
        console.log('Solvable numbers saved in solvable_numbers_100.txt')
        console.log('Total count: ', solvableNumbers.length)
    }
})
