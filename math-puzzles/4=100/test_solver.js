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

function verifySolutionsEvaluateToTarget(solutions, target = 100) {
    for (const sol of solutions) {
        const jsExpr = sol.replace(/×/g, '*').replace(/÷/g, '/');
        const val = Function(`return (${jsExpr})`)();
        if (Math.abs(val - target) >= 1e-7) {
            return false;
        }
    }
    return true;
}

console.log('===============================================');
console.log('   Running Unit Tests for PuzzleSolver (4=100) ');
console.log('===============================================\n');

// Test 1: 5555 with all allowed
{
    const solver = new PuzzleSolver([5, 5, 5, 5]);
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 5555 has solutions for target 100');
    assert(solutions.includes('(5 + 5) × (5 + 5)'), 'Finds (5 + 5) × (5 + 5)');
    assert(verifySolutionsEvaluateToTarget(solutions, 100), 'All solutions evaluate to 100');
}

// Test 2: 5555 with multiplication disallowed
{
    const solver = new PuzzleSolver([5, 5, 5, 5], { allowedOperators: ['+', '-', '/'] });
    const solutions = solver.solve();
    assert(solutions.length === 0, '5555 has 0 solutions when × is disallowed');
}

// Test 3: 2525 with all allowed
{
    const solver = new PuzzleSolver([2, 5, 2, 5]);
    const solutions = solver.solve();
    assert(solutions.length > 0, '2525 has solutions for target 100');
    assert(verifySolutionsEvaluateToTarget(solutions, 100), 'All solutions evaluate to 100');
}

// Test 4: 2525 without brackets
{
    const solver = new PuzzleSolver([2, 5, 2, 5], { allowBrackets: false });
    const solutions = solver.solve();
    assert(solutions.length > 0, '2525 has solutions without brackets');
    assert(solutions.every(s => !s.includes('(') && !s.includes(')')), 'No solutions contain brackets');
    assert(verifySolutionsEvaluateToTarget(solutions, 100), 'All bracketless solutions evaluate to 100');
}

console.log(`\nTests finished: ${passedTests}/${totalTests} passed.`);
