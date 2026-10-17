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

function verifySolutionsEvaluateToTarget(solutions, target = 18) {
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
console.log('   Running Unit Tests for PuzzleSolver (4=18) ');
console.log('==============================================\n');

// Test 1: 2333 with all allowed
{
    const solver = new PuzzleSolver([2, 3, 3, 3]);
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 2333 has solutions for target 18');
    assert(verifySolutionsEvaluateToTarget(solutions, 18), 'All solutions evaluate to 18');
}

// Test 2: 2333 with multiplication disallowed
{
    const solver = new PuzzleSolver([2, 3, 3, 3], { allowedOperators: ['+', '-', '/'] });
    const solutions = solver.solve();
    assert(solutions.length === 0, '2333 has 0 solutions when × is disallowed');
}

// Test 3: 3346 with all allowed
{
    const solver = new PuzzleSolver([3, 3, 4, 6]);
    const solutions = solver.solve();
    assert(solutions.length > 0, '3346 has solutions for target 18');
    assert(verifySolutionsEvaluateToTarget(solutions, 18), 'All solutions evaluate to 18');
}

// Test 4: 3346 with brackets disallowed
{
    const solver = new PuzzleSolver([3, 3, 4, 6], { allowBrackets: false });
    const solutions = solver.solve();
    assert(solutions.length > 0, '3346 has solutions without brackets');
    assert(solutions.every(s => !s.includes('(') && !s.includes(')')), 'No solutions contain brackets');
    assert(verifySolutionsEvaluateToTarget(solutions, 18), 'All bracketless solutions evaluate to 18');
}

console.log(`\nTests finished: ${passedTests}/${totalTests} passed.`);
