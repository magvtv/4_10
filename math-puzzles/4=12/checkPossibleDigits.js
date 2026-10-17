const fs = require('fs');

// Generate all permutations of an array
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

// Safely evaluate an expression, checking if it equals 12
function evaluate(expr) {
	try {
		const result = Function(`return ${expr}`)();
		// Use a small epsilon for floating-point precision
		return Math.abs(result - 12) < 1e-9;
	} catch (e) {
		// Return false for division by zero or invalid expressions
		return false;
	}
}

// Define the four basic operators
const operators = ['+', '-', '*', '/'];

// Define expression patterns with different parentheses placements
const patterns = [
	(a, b, c, d, op1, op2, op3) => `(${a} ${op1} ${b}) ${op2} (${c} ${op3} ${d})`,
	(a, b, c, d, op1, op2, op3) => `(( ${a} ${op1} ${b} ) ${op2} ${c}) ${op3} ${d}`,
	(a, b, c, d, op1, op2, op3) => `( ${a} ${op1} ( ${b} ${op2} ${c} ) ) ${op3} ${d}`,
	(a, b, c, d, op1, op2, op3) => `${a} ${op1} ( ( ${b} ${op2} ${c} ) ${op3} ${d} )`,
	(a, b, c, d, op1, op2, op3) => `${a} ${op1} ( ${b} ${op2} ( ${c} ${op3} ${d} ) )`,
];

// Find all solvable 4-digit numbers
function findSolvableNumbers() {
	const solvable = [];

	// Loop through all 4-digit numbers
	outer: for (let num = 1111; num <= 9999; num++) {
		// Get digits as an array
		const digits = String(num).split('').map(Number);
		// Get unique permutations
		const permutations = [...new Set(getPermutations(digits).map((p) => p.join('')))].map((p) =>
			p.split('').map(Number)
		);

		// Test each permutation
		for (const perm of permutations) {
			for (const pattern of patterns) {
				for (const op1 of operators) {
					for (const op2 of operators) {
						for (const op3 of operators) {
							const expr = pattern(perm[0], perm[1], perm[2], perm[3], op1, op2, op3);
							if (evaluate(expr)) {
								solvable.push(num);
								continue outer; // Found a solution, move to next number
							}
						}
					}
				}
			}
		}
	}

	return solvable;
}

// Execute the program
console.log('Searching for solvable 4-digit numbers...');
const solvableNumbers = findSolvableNumbers();
console.log('Solvable numbers:', solvableNumbers);
console.log('Total count:', solvableNumbers.length);

// Save results to a file
const output = solvableNumbers.join('\n');
fs.writeFile('solvable_numbers_12.txt', output, (err) => {
	if (err) {
		console.error('Error writing to file:', err);
	} else {
		console.log('Results saved to solvable_numbers_12.txt');
	}
});
