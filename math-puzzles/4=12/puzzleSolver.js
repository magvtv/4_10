/**
 * PuzzleSolver: Core engine for solving 4-digit arithmetic puzzles (4=12).
 * Supports configurable target values, allowed operators (+, -, *, /), and optional brackets.
 */
class PuzzleSolver {
    /**
     * @param {number[]|string|number} digits - 4 digits to use in the puzzle
     * @param {Object} options - Configuration options
     * @param {number} [options.target=12] - The target value to reach
     * @param {string[]} [options.allowedOperators=['+', '-', '*', '/']] - Operators allowed
     * @param {boolean} [options.allowBrackets=true] - Whether parentheses/brackets are allowed
     */
    constructor(digits, options = {}) {
        this.rawDigits = digits;
        this.digits = this.parseDigits(digits);
        this.target = options.target ?? 12;
        this.allowedOperators = options.allowedOperators ?? ['+', '-', '*', '/'];
        this.allowBrackets = options.allowBrackets ?? true;
        this.epsilon = 1e-7;
    }

    parseDigits(input) {
        if (Array.isArray(input)) return input.map(Number);
        if (typeof input === 'number') return String(input).split('').map(Number);
        if (typeof input === 'string') {
            const matches = input.match(/\d/g);
            return matches ? matches.map(Number) : [];
        }
        return [];
    }

    validate() {
        if (!Array.isArray(this.digits) || this.digits.length !== 4) {
            return { valid: false, error: 'Must provide exactly 4 digits.' };
        }
        if (!this.digits.every(d => Number.isInteger(d) && d >= 0 && d <= 9)) {
            return { valid: false, error: 'All digits must be single integers between 0 and 9.' };
        }
        if (!Array.isArray(this.allowedOperators) || this.allowedOperators.length === 0) {
            return { valid: false, error: 'At least one operator (+, -, *, /) must be allowed.' };
        }
        const validOps = new Set(['+', '-', '*', '/']);
        for (const op of this.allowedOperators) {
            if (!validOps.has(op)) {
                return { valid: false, error: `Invalid operator: '${op}'. Only +, -, *, / are supported.` };
            }
        }
        return { valid: true };
    }

    getUniquePermutations(arr) {
        const permutations = [];
        const used = new Array(arr.length).fill(false);
        const sorted = [...arr].sort((a, b) => a - b);

        const backtrack = (curr) => {
            if (curr.length === sorted.length) {
                permutations.push([...curr]);
                return;
            }
            for (let i = 0; i < sorted.length; i++) {
                if (used[i]) continue;
                if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;
                used[i] = true;
                curr.push(sorted[i]);
                backtrack(curr);
                curr.pop();
                used[i] = false;
            }
        };

        backtrack([]);
        return permutations;
    }

    evalNode(node) {
        if (node.type === 'num') return node.value;

        const leftVal = this.evalNode(node.left);
        const rightVal = this.evalNode(node.right);
        if (leftVal === null || rightVal === null) return null;

        switch (node.op) {
            case '+': return leftVal + rightVal;
            case '-': return leftVal - rightVal;
            case '*': return leftVal * rightVal;
            case '/':
                if (Math.abs(rightVal) < 1e-9) return null;
                return leftVal / rightVal;
            default: return null;
        }
    }

    toPrettyString(node, parentOp = null, isRight = false) {
        if (node.type === 'num') return String(node.value);

        const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
        const myPrec = prec[node.op];
        const pPrec = parentOp ? prec[parentOp] : 0;

        let needParens = false;
        if (parentOp) {
            if (myPrec < pPrec) {
                needParens = true;
            } else if (myPrec === pPrec) {
                if (isRight && (parentOp === '-' || parentOp === '/')) {
                    needParens = true;
                }
            }
        }

        const leftStr = this.toPrettyString(node.left, node.op, false);
        const rightStr = this.toPrettyString(node.right, node.op, true);
        const opSymbol = node.op === '*' ? '×' : (node.op === '/' ? '÷' : node.op);

        const res = `${leftStr} ${opSymbol} ${rightStr}`;
        return needParens ? `(${res})` : res;
    }

    generateTrees(digitsList) {
        if (digitsList.length === 1) {
            return [{ type: 'num', value: digitsList[0] }];
        }

        const trees = [];
        for (let i = 1; i < digitsList.length; i++) {
            const leftDigits = digitsList.slice(0, i);
            const rightDigits = digitsList.slice(i);

            const leftTrees = this.generateTrees(leftDigits);
            const rightTrees = this.generateTrees(rightDigits);

            for (const left of leftTrees) {
                for (const right of rightTrees) {
                    for (const op of this.allowedOperators) {
                        trees.push({
                            type: 'op',
                            op,
                            left,
                            right
                        });
                    }
                }
            }
        }
        return trees;
    }

    solveWithoutBrackets(perms) {
        const solutions = new Set();
        const ops = this.allowedOperators;

        for (const [a, b, c, d] of perms) {
            for (const op1 of ops) {
                for (const op2 of ops) {
                    for (const op3 of ops) {
                        const exprStr = `${a} ${op1} ${b} ${op2} ${c} ${op3} ${d}`;
                        try {
                            const val = Function(`return (${exprStr})`)();
                            if (Number.isFinite(val) && Math.abs(val - this.target) < this.epsilon) {
                                const pretty = exprStr
                                    .replace(/\*/g, '×')
                                    .replace(/\//g, '÷');
                                solutions.add(pretty);
                            }
                        } catch (e) {
                            // Ignore division by zero
                        }
                    }
                }
            }
        }
        return Array.from(solutions);
    }

    solve() {
        const validation = this.validate();
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const perms = this.getUniquePermutations(this.digits);

        if (!this.allowBrackets) {
            return this.solveWithoutBrackets(perms);
        }

        const solutions = new Set();
        for (const perm of perms) {
            const trees = this.generateTrees(perm);
            for (const tree of trees) {
                const val = this.evalNode(tree);
                if (val !== null && Number.isFinite(val) && Math.abs(val - this.target) < this.epsilon) {
                    solutions.add(this.toPrettyString(tree));
                }
            }
        }
        return Array.from(solutions);
    }
}

module.exports = { PuzzleSolver };
