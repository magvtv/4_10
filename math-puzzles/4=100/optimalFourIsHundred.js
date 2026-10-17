class Expression {
    constructor() {
        this.operators = [
            '+',
            '-',
            '*',
            '/'
        ]
    }

    evaluate(expr) {
        try {
            const result = Function(`return ${expr}`)()
            return Math.abs(result - 100) < 0.0000001
        } catch (e) {
            return false
        }
    }

    format(expr) {
        return expr.replace(/\//g, '÷')
    }
}


class ExpressionSolver extends Expression {
    constructor(number) {
        super();
        this.digits = String(number).split('').map(Number);
        this.solutions = new Set();
    }

    // Generate all possible expressions from a digit array
    generateExpressions(digits) {
        if (digits.length === 1) {
            return [String(digits[0])];
        }

        const expressions = [];
        for (let i = 1; i < digits.length; i++) {
            const leftDigits = digits.slice(0, i);
            const rightDigits = digits.slice(i);
            const leftExprs = this.generateExpressions(leftDigits);
            const rightExprs = this.generateExpressions(rightDigits);
            for (const left of leftExprs) {
                for (const right of rightExprs) {
                    for (const op of this.operators) { // ['+', '-', '*', '/']
                        expressions.push(`(${left} ${op} ${right})`);
                    }
                }
            }
        }
        return expressions;
    }

    // Generate all permutations of an array
    getPermutations(arr) {
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

    // Evaluate expression, handling division by zero
    evaluate(expr) {
        try {
            const result = Function(`return ${expr}`)();
            return Math.abs(result - 100) < 1e-9; // Small epsilon for floating-point comparison
        } catch (e) {
            return false; // Handles division by zero or invalid operations
        }
    }

    // Main solve method
    solve() {
        if (!this.validate()) {
            return "Input must be a 4-digit number";
        }

        const permutations = this.getPermutations(this.digits);
        for (const perm of permutations) {
            const exprs = this.generateExpressions(perm);
            for (const expr of exprs) {
                if (this.evaluate(expr)) {
                    this.solutions.add(this.format(expr));
                }
            }
        }
        return Array.from(this.solutions);
    }

    // Assuming validate and format are inherited or defined elsewhere
    validate() {
        return this.digits.length === 4 && this.digits.every(d => d >= 0 && d <= 9);
    }

    format(expr) {
        // Replace operators with desired symbols if needed, e.g., '/' to '÷'
        return expr.replace(/\//g, '÷');
    }
}

// Example usage
const solver = new ExpressionSolver(4868);
console.log(solver.solve());