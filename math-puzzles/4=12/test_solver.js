const { PuzzleSolver } = require('./puzzleSolver');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exitCode = 1;
    } else {
        console.log(`✅ PASS: ${message}`);
        passedTests++;
    }
}

function verifySolutionsEvaluateToTarget(solutions, target = 12) {
    for (const sol of solutions) {
        const jsExpr = sol.replace(/×/g, '*').replace(/÷/g, '/');
        const val = Function(`return (${jsExpr})`)();
        if (Math.abs(val - target) >= 1e-7) {
            return false;
        }
    }
    return true;
}

console.log('==============================================');
console.log('   Running Unit Tests for PuzzleSolver (4=12) ');
console.log('==============================================\n');

// Test 1: 3333 with all allowed
{
    const solver = new PuzzleSolver([3, 3, 3, 3]);
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 3333 has solutions for target 12');
    assert(solutions.includes('3 + 3 + 3 + 3'), 'Includes 3 + 3 + 3 + 3');
    assert(verifySolutionsEvaluateToTarget(solutions, 12), 'All solutions evaluate to 12');
}

// Test 2: 3333 with addition disallowed
{
    const solver = new PuzzleSolver([3, 3, 3, 3], { allowedOperators: ['-', '*', '/'] });
    const solutions = solver.solve();
    assert(solutions.length === 0, '3333 has 0 solutions when + is disallowed');
}

// Test 3: 1234 with all allowed
{
    const solver = new PuzzleSolver([1, 2, 3, 4]);
    const solutions = solver.solve();
    assert(solutions.length > 0, '1234 has solutions for target 12');
    assert(verifySolutionsEvaluateToTarget(solutions, 12), 'All solutions evaluate to 12');
}

// Test 4: 1234 with brackets disallowed
{
    const solver = new PuzzleSolver([1, 2, 3, 4], { allowBrackets: false });
    const solutions = solver.solve();
    assert(solutions.length > 0, '1234 has solutions without brackets');
    assert(solutions.every(s => !s.includes('(') && !s.includes(')')), 'No solutions contain brackets');
    assert(verifySolutionsEvaluateToTarget(solutions, 12), 'All bracketless solutions evaluate to 12');
}

console.log(`\nTests finished: ${passedTests}/${totalTests} passed.`);
