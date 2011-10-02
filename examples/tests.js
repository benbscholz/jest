jest('Boolean Tests');

test('yes examples', function () {
    yes( true, 'yes: true is true' );
    yes( !false, 'yes: not false is true' );
    yes( !!true, 'yes: not not true is true' );
    yes( 1, 'yes: truthy is true' );
}, 4);

test('no examples', function () {    
    no( false, 'no: false is false' );
    no( !true, 'no: not true is false' );
    no( !!false, 'no: not not false is false' ); 
    no( 0, 'no: falsy is false' ); 
}, 4);

test('alike examples', function () {
    var a;
    alike( 1, 1, 'alike: one is one' );
    alike( true, true, 'alike: true is true' );
    alike( 'jest', 'jest', 'alike: string is string' );
    alike( a = [1], a, 'alike: array is array' );
}, 4);

test('unlike examples', function () {
    var a;
    unlike( 1, 2, 'unlike: one is not two' );
    unlike( true, false, 'unlike: true is not false' );
    unlike( 'jest', 'jester', 'unlike: string is not string' );
    unlike( a = [1], [1], 'unlike: array is not array' );
}, 4);

test('same examples', function () {
    same( 1, 1, 'same: one is one' );
    same( 'jest', 'jest', 'same: string is string' );
    same( [1], [1], 'same: array is array' );
    same( { 1 : 1 }, { 1 : 1 }, 'same: object is object' );
}, 4);

test('different examples', function () {
    different( 1, 2, 'different: one is not two' );
    different( 'jest', 'jester', 'different: string is not string' );
    different( [1], [0], 'different: array is not array' );
    different( { 1 : 0 }, { 1 : 1 }, 'different: objects are different' );
}, 4);

test('range examples', function () {
    range( 1, [0,10], 'range: one is between 0 and 10' );
    range( 2, [-1,3], 'range: two is between -1 and 3');
}, 2);
    