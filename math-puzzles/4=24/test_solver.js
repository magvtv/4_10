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

function verifySolutionsEvaluateToTarget(solutions, target = 24) {
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
console.log('   Running Unit Tests for PuzzleSolver (4=24) ');
console.log('==============================================\n');

// Test 1: 1346 with all allowed (requires division and brackets: 6 / (1 - 3/4))
{
    const solver = new PuzzleSolver([1, 3, 4, 6]);
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 1346 has solutions for target 24');
    assert(solutions.includes('6 ÷ (1 - 3 ÷ 4)'), 'Finds 6 ÷ (1 - 3 ÷ 4)');
    assert(verifySolutionsEvaluateToTarget(solutions, 24), 'All solutions evaluate to 24');
}

// Test 2: 1346 with brackets disallowed (impossible without brackets)
{
    const solver = new PuzzleSolver([1, 3, 4, 6], { allowBrackets: false });
    const solutions = solver.solve();
    assert(solutions.length === 0, 'Puzzle 1346 has 0 solutions without brackets');
}

// Test 3: 1346 with division disallowed (impossible without division)
{
    const solver = new PuzzleSolver([1, 3, 4, 6], { allowedOperators: ['+', '-', '*'] });
    const solutions = solver.solve();
    assert(solutions.length === 0, 'Puzzle 1346 has 0 solutions without division');
}

// Test 4: 6490 with all allowed
{
    const solver = new PuzzleSolver([6, 4, 9, 0]);
    const solutions = solver.solve();
    assert(solutions.length > 0, '6490 has solutions for target 24');
    assert(verifySolutionsEvaluateToTarget(solutions, 24), 'All solutions evaluate to 24');
}

// Test 5: 6490 without brackets
{
    const solver = new PuzzleSolver([6, 4, 9, 0], { allowBrackets: false });
    const solutions = solver.solve();
    assert(solutions.length > 0, '6490 has solutions without brackets');
    assert(solutions.every(s => !s.includes('(') && !s.includes(')')), 'No solutions contain brackets');
    assert(verifySolutionsEvaluateToTarget(solutions, 24), 'All bracketless solutions evaluate to 24');
}

console.log(`\nTests finished: ${passedTests}/${totalTests} passed.`);
