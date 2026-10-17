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

function verifySolutionsEvaluateToTarget(solutions, target = 10) {
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
console.log('   Running Unit Tests for PuzzleSolver (4=10) ');
console.log('==============================================\n');

// Test 1: Standard 4=10 puzzle: 3847
{
    const solver = new PuzzleSolver([3, 8, 4, 7]);
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 3847 has solutions');
    assert(solutions.includes('(3 - 7 ÷ 4) × 8') || solutions.includes('8 × (3 - 7 ÷ 4)'), 'Finds (3 - 7 ÷ 4) × 8');
    assert(verifySolutionsEvaluateToTarget(solutions), 'All solutions for 3847 evaluate to 10');
}

// Test 2: Puzzle 3847 with brackets disallowed (impossible without brackets)
{
    const solver = new PuzzleSolver([3, 8, 4, 7], { allowBrackets: false });
    const solutions = solver.solve();
    assert(solutions.length === 0, 'Puzzle 3847 has 0 solutions when brackets are disallowed');
}

// Test 3: Puzzle 3847 with division disallowed (impossible without division)
{
    const solver = new PuzzleSolver([3, 8, 4, 7], { allowedOperators: ['+', '-', '*'] });
    const solutions = solver.solve();
    assert(solutions.length === 0, 'Puzzle 3847 has 0 solutions when division is disallowed');
}

// Test 4: Puzzle 1234 with all allowed
{
    const solver = new PuzzleSolver('1234');
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 1234 has solutions');
    assert(solutions.includes('1 + 2 + 3 + 4'), 'Includes 1 + 2 + 3 + 4');
    assert(verifySolutionsEvaluateToTarget(solutions), 'All solutions for 1234 evaluate to 10');
}

// Test 5: Puzzle 1234 with brackets disallowed
{
    const solver = new PuzzleSolver('1234', { allowBrackets: false });
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 1234 has solutions without brackets');
    assert(solutions.every(s => !s.includes('(') && !s.includes(')')), 'No solutions contain brackets');
    assert(solutions.includes('1 + 2 + 3 + 4'), 'Includes 1 + 2 + 3 + 4 without brackets');
    assert(verifySolutionsEvaluateToTarget(solutions), 'All bracketless solutions for 1234 evaluate to 10');
}

// Test 6: Puzzle 1234 with addition disallowed
{
    const solver = new PuzzleSolver([1, 2, 3, 4], { allowedOperators: ['-', '*', '/'] });
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 1234 has solutions without addition');
    assert(solutions.every(s => !s.includes('+')), 'No solutions contain +');
    assert(verifySolutionsEvaluateToTarget(solutions), 'All solutions evaluate to 10');
}

// Test 7: Puzzle 1234 with multiplication disallowed
{
    const solver = new PuzzleSolver([1, 2, 3, 4], { allowedOperators: ['+', '-', '/'] });
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 1234 has solutions without multiplication');
    assert(solutions.every(s => !s.includes('×')), 'No solutions contain ×');
    assert(verifySolutionsEvaluateToTarget(solutions), 'All solutions evaluate to 10');
}

// Test 8: Puzzle 1234 with subtraction disallowed
{
    const solver = new PuzzleSolver([1, 2, 3, 4], { allowedOperators: ['+', '*', '/'] });
    const solutions = solver.solve();
    assert(solutions.length > 0, 'Puzzle 1234 has solutions without subtraction');
    assert(solutions.every(s => !s.includes('-')), 'No solutions contain -');
    assert(verifySolutionsEvaluateToTarget(solutions), 'All solutions evaluate to 10');
}

// Test 9: Handling duplicate digits (e.g. 1111, 2222, 1123)
{
    const solver1111 = new PuzzleSolver([1, 1, 1, 1]);
    const sol1111 = solver1111.solve();
    assert(sol1111.length === 0, '1111 correctly has 0 solutions to reach 10');

    const solver1123 = new PuzzleSolver([1, 1, 2, 3]);
    const sol1123 = solver1123.solve();
    assert(sol1123.length > 0, '1123 has solutions');
    assert(sol1123.includes('(1 + 1) × (2 + 3)'), 'Finds (1 + 1) × (2 + 3)');
    assert(verifySolutionsEvaluateToTarget(sol1123), 'All solutions for 1123 evaluate to 10');
}

// Test 10: Input validation
{
    const invalidCount = new PuzzleSolver([1, 2, 3]);
    const resCount = invalidCount.validate();
    assert(!resCount.valid && resCount.error.includes('4 digits'), 'Rejects non-4-digit input');

    const invalidOp = new PuzzleSolver([1, 2, 3, 4], { allowedOperators: ['^'] });
    const resOp = invalidOp.validate();
    assert(!resOp.valid && resOp.error.includes('Invalid operator'), 'Rejects invalid operator');
}

// Test 11: Division by zero safety (e.g. 1, 0, 0, 0)
{
    const solver1000 = new PuzzleSolver([1, 0, 0, 0]);
    let threw = false;
    try {
        const sol1000 = solver1000.solve();
        assert(Array.isArray(sol1000), 'Safely handles zeros and potential division by zero without crashing');
    } catch (e) {
        threw = true;
    }
    assert(!threw, 'Did not throw on zeros');
}

console.log(`\nTests finished: ${passedTests}/${totalTests} passed.`);
