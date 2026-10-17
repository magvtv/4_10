#!/usr/bin/env node

/**
 * Interactive Terminal for 4=10 Math Puzzle Solver
 * 
 * Allows entering 4 digits, configuring allowed/disallowed arithmetic operators
 * (+, -, *, /) and toggling brackets (parentheses).
 */

const readline = require('readline');
const { PuzzleSolver } = require('./puzzleSolver');

// ANSI Color Helpers
const isColorSupported = !process.env.NO_COLOR && Boolean(process.stdout.isTTY || process.env.FORCE_COLOR);
const color = {
    bold: (s) => isColorSupported ? `\x1b[1m${s}\x1b[0m` : s,
    dim: (s) => isColorSupported ? `\x1b[2m${s}\x1b[0m` : s,
    cyan: (s) => isColorSupported ? `\x1b[36m${s}\x1b[0m` : s,
    green: (s) => isColorSupported ? `\x1b[32m${s}\x1b[0m` : s,
    yellow: (s) => isColorSupported ? `\x1b[33m${s}\x1b[0m` : s,
    red: (s) => isColorSupported ? `\x1b[31m${s}\x1b[0m` : s,
    magenta: (s) => isColorSupported ? `\x1b[35m${s}\x1b[0m` : s,
    gray: (s) => isColorSupported ? `\x1b[90m${s}\x1b[0m` : s,
};

function printBanner() {
    console.log(color.cyan('╔═══════════════════════════════════════════════════════════════╗'));
    console.log(color.cyan('║') + color.bold('                 4 = 10 PUZZLE SOLVER TERMINAL                 ') + color.cyan('║'));
    console.log(color.cyan('║') + color.dim('      Interactive Solver with Operator & Bracket Controls      ') + color.cyan('║'));
    console.log(color.cyan('╚═══════════════════════════════════════════════════════════════╝'));
    console.log('');
}

class InteractiveTerminal {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    ask(questionText) {
        return new Promise((resolve) => {
            this.rl.question(questionText, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    /**
     * Parse 4 digits from user input. Returns array of 4 digits or null if invalid.
     */
    parseDigits(input) {
        const digits = (input.match(/\d/g) || []).map(Number);
        return digits.length === 4 ? digits : null;
    }

    /**
     * Parse disallowed operators / brackets string.
     * Tokens can include +, -, *, x, /, ÷, b, brackets, parens, etc.
     */
    parseDisallowed(input) {
        const disallowed = new Set();
        let allowBrackets = true;

        // Split by commas, spaces, or slashes (if not meant as division)
        const tokens = input
            .toLowerCase()
            .split(/[\s,]+/)
            .filter(Boolean);

        for (const token of tokens) {
            if (token === '+' || token === 'add' || token === 'plus') {
                disallowed.add('+');
            } else if (token === '-' || token === 'minus' || token === 'sub') {
                disallowed.add('-');
            } else if (token === '*' || token === 'x' || token === '×' || token === 'mul' || token === 'multiply') {
                disallowed.add('*');
            } else if (token === '/' || token === '÷' || token === 'div' || token === 'divide') {
                disallowed.add('/');
            } else if (
                token === 'b' ||
                token === 'bracket' ||
                token === 'brackets' ||
                token === 'paren' ||
                token === 'parentheses' ||
                token === '()' ||
                token === '(' ||
                token === ')' ||
                token === '[]'
            ) {
                allowBrackets = false;
            } else {
                // Check if user typed characters together like "x/b" or "+-*"
                for (const char of token) {
                    if (char === '+') disallowed.add('+');
                    else if (char === '-') disallowed.add('-');
                    else if (char === '*' || char === 'x' || char === '×') disallowed.add('*');
                    else if (char === '/' || char === '÷') disallowed.add('/');
                    else if (char === 'b' || char === '(' || char === ')') allowBrackets = false;
                }
            }
        }

        const allOps = ['+', '-', '*', '/'];
        const allowedOperators = allOps.filter(op => !disallowed.has(op));

        return {
            allowedOperators,
            disallowedOperators: Array.from(disallowed),
            allowBrackets
        };
    }

    async promptDigits() {
        while (true) {
            const input = await this.ask(color.bold('Enter 4 digits (e.g. 3847 or 3 8 4 7) [or "q" to quit]: '));
            if (input.toLowerCase() === 'q' || input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit') {
                return null;
            }

            const digits = this.parseDigits(input);
            if (digits) {
                return digits;
            }

            console.log(color.red('⚠️  Invalid input. Please enter exactly 4 numbers (0-9).\n'));
        }
    }

    async promptRules() {
        while (true) {
            const allAllowedAnswer = await this.ask(
                color.bold('Are all arithmetic signs (+, -, ×, ÷) and brackets allowed? [Y/n]: ')
            );

            const isYes = allAllowedAnswer === '' || allAllowedAnswer.toLowerCase().startsWith('y');
            if (isYes) {
                return {
                    allowedOperators: ['+', '-', '*', '/'],
                    allowBrackets: true
                };
            }

            console.log(color.yellow('\nSelect which operations or brackets to DISALLOW:'));
            console.log(color.dim('  Options:'));
            console.log(`    ${color.cyan('+')}       : Addition`);
            console.log(`    ${color.cyan('-')}       : Subtraction`);
            console.log(`    ${color.cyan('* or x')}  : Multiplication`);
            console.log(`    ${color.cyan('/ or ÷')}  : Division`);
            console.log(`    ${color.cyan('b or ()')} : Brackets / Parentheses`);
            console.log(color.dim('  (You can enter multiple separated by spaces or commas, e.g. "*, /" or "b, ÷")\n'));

            const disallowedInput = await this.ask(
                color.bold('Enter sign(s) or options NOT allowed: ')
            );

            const config = this.parseDisallowed(disallowedInput);

            if (config.allowedOperators.length === 0) {
                console.log(color.red('\n⚠️  You disallowed all operators! At least one operator (+, -, *, /) must be allowed.\n'));
                continue;
            }

            return {
                allowedOperators: config.allowedOperators,
                allowBrackets: config.allowBrackets
            };
        }
    }

    displayResults(digits, config, solutions, durationMs) {
        const prettyOps = config.allowedOperators.map(op => op === '*' ? '×' : (op === '/' ? '÷' : op)).join(', ');

        console.log('\n' + color.cyan('───────────────────────────────────────────────────────────────'));
        console.log(color.bold('  PUZZLE CONFIGURATION & SUMMARY'));
        console.log(color.cyan('───────────────────────────────────────────────────────────────'));
        console.log(`  ${color.dim('Input Digits   :')} ${color.yellow(digits.join('  '))}`);
        console.log(`  ${color.dim('Target Value   :')} ${color.green('10')}`);
        console.log(`  ${color.dim('Allowed Signs  :')} ${color.cyan(prettyOps)}`);
        console.log(`  ${color.dim('Brackets ( )   :')} ${config.allowBrackets ? color.green('Allowed') : color.red('Disallowed (Flat evaluation only)')}`);
        console.log(`  ${color.dim('Search Duration:')} ${durationMs.toFixed(2)} ms`);
        console.log(color.cyan('───────────────────────────────────────────────────────────────'));

        if (solutions.length === 0) {
            console.log(color.red('\n  ❌ No solutions found under these constraints.\n'));

            // Check if solutions exist under relaxed constraints to give helpful feedback
            const unrestrictedSolver = new PuzzleSolver(digits, { allowedOperators: ['+', '-', '*', '/'], allowBrackets: true });
            const unrestrictedSolutions = unrestrictedSolver.solve();

            if (unrestrictedSolutions.length > 0) {
                console.log(color.yellow('  💡 Hint:'));
                console.log(`     With all operators and brackets allowed, this puzzle has ${color.bold(unrestrictedSolutions.length)} solution(s):`);
                const sample = unrestrictedSolutions.slice(0, 3).map(s => `       • ${s} = 10`).join('\n');
                console.log(sample);
                if (unrestrictedSolutions.length > 3) {
                    console.log(color.dim(`       ... and ${unrestrictedSolutions.length - 3} more.`));
                }
                console.log('');
            }
            return;
        }

        console.log(color.green(`\n  🎉 Found ${color.bold(solutions.length)} unique solution${solutions.length === 1 ? '' : 's'}:\n`));

        const maxDisplay = 20;
        const displayList = solutions.slice(0, maxDisplay);

        displayList.forEach((sol, idx) => {
            const num = String(idx + 1).padStart(2, ' ');
            console.log(`    ${color.dim(num + '.')}  ${color.bold(sol)} ${color.green('= 10')}`);
        });

        if (solutions.length > maxDisplay) {
            console.log(color.dim(`\n    ... and ${solutions.length - maxDisplay} more solutions.`));
        }
        console.log('');
    }

    async run() {
        printBanner();

        // Handle process interruption
        this.rl.on('SIGINT', () => {
            console.log(color.yellow('\n\nExiting solver. Goodbye! 👋\n'));
            process.exit(0);
        });

        while (true) {
            const digits = await this.promptDigits();
            if (!digits) {
                console.log(color.yellow('\nGoodbye! 👋\n'));
                break;
            }

            const config = await this.promptRules();

            const startTime = performance.now();
            const solver = new PuzzleSolver(digits, {
                target: 10,
                allowedOperators: config.allowedOperators,
                allowBrackets: config.allowBrackets
            });

            const solutions = solver.solve();
            const durationMs = performance.now() - startTime;

            this.displayResults(digits, config, solutions, durationMs);

            const again = await this.ask(color.bold('Would you like to solve another puzzle? [Y/n]: '));
            const shouldContinue = again === '' || again.toLowerCase().startsWith('y');
            if (!shouldContinue) {
                console.log(color.yellow('\nThanks for using the 4=10 Puzzle Solver! Goodbye! 👋\n'));
                break;
            }
            console.log('\n' + '─'.repeat(63) + '\n');
        }

        this.rl.close();
    }
}

// Support CLI direct mode (e.g. node interactiveTerminal.js 3847 or node interactiveTerminal.js 3847 --disallow "b, /")
if (process.argv.length > 2) {
    const rawArg = process.argv[2];
    if (rawArg === '--help' || rawArg === '-h') {
        console.log(`
Usage:
  Interactive mode:
    node interactiveTerminal.js

  Direct solve mode:
    node interactiveTerminal.js <digits> [--disallow <items>]

Examples:
    node interactiveTerminal.js 3847
    node interactiveTerminal.js "3 8 4 7" --disallow "b"
    node interactiveTerminal.js 1234 --disallow "/, *"
        `);
        process.exit(0);
    }

    const digits = (rawArg.match(/\d/g) || []).map(Number);
    if (digits.length !== 4) {
        console.error('Error: Please provide exactly 4 digits. Example: node interactiveTerminal.js 3847');
        process.exit(1);
    }

    let disallowedArg = '';
    const disallowIdx = process.argv.indexOf('--disallow');
    if (disallowIdx !== -1 && process.argv[disallowIdx + 1]) {
        disallowedArg = process.argv[disallowIdx + 1];
    }

    const term = new InteractiveTerminal();
    const config = term.parseDisallowed(disallowedArg);

    const solver = new PuzzleSolver(digits, {
        target: 10,
        allowedOperators: config.allowedOperators,
        allowBrackets: config.allowBrackets
    });

    const startTime = performance.now();
    const solutions = solver.solve();
    const duration = performance.now() - startTime;

    term.displayResults(digits, config, solutions, duration);
    term.rl.close();
} else {
    const term = new InteractiveTerminal();
    term.run();
}
