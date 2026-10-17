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

function verifySolutionsEvaluateToTarget(solutions, target = 4) {
    for (const sol of solutions) {
        const jsExpr = sol.replace(/×/g, '*').replace(/÷/g, '/');
        const val = Function(`return (${jsExpr})`)();
        if (Math.abs(val - target) >= 1e-7) {
            return false;
        }
    }
    return true;
}

console.log('=============================================');
console.log('   Running Unit Tests for PuzzleSolver (4=4) ');
console.log('=============================================\n');

// Test 1: 1111 with all allowed
{
    const solver = new PuzzleSolver([1, 1, 1, 1]);
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 1111 has solutions for target 4');
    assert(solutions.includes('1 + 1 + 1 + 1'), 'Includes 1 + 1 + 1 + 1');
    assert(verifySolutionsEvaluateToTarget(solutions, 4), 'All solutions evaluate to 4');
}

// Test 2: 1111 with addition disallowed
{
    const solver = new PuzzleSolver([1, 1, 1, 1], { allowedOperators: ['-', '*', '/'] });
    const solutions = solver.solve();
    assert(solutions.length === 0, 'Puzzle 1111 has 0 solutions when + is disallowed');
}

// Test 3: 3333 with all allowed
{
    const solver = new PuzzleSolver([3, 3, 3, 3]);
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 3333 has solutions');
    assert(verifySolutionsEvaluateToTarget(solutions, 4), 'All solutions evaluate to 4');
}

// Test 4: 2222 with brackets disallowed
{
    const solver = new PuzzleSolver([2, 2, 2, 2], { allowBrackets: false });
    const solutions = solver.solve();
    assert(solutions.length > 0, '2222 has solutions without brackets');
    assert(solutions.every(s => !s.includes('(') && !s.includes(')')), 'No solutions contain brackets');
    assert(verifySolutionsEvaluateToTarget(solutions, 4), 'All bracketless solutions evaluate to 4');
}

console.log(`\nTests finished: ${passedTests}/${totalTests} passed.`);
