jest('tests');

test('yes examples', 4, function () {
    yes( true, 'yes: true is true' );
    yes( !false, 'yes: not false is true' );
    yes( !!true, 'yes: not not true is true' );
    yes( 1, 'yes: truthy is true' );
});


test('no examples', 4, function () {    
    no( false, 'no: false is false' );
    no( !true, 'no: not true is false' );
    no( !!false, 'no: not not false is false' ); 
    no( 0, 'no: falsy is false' ); 
});

test('alike examples', 4, function () {
    alike( 1, 1, 'alike: one is one' );
    alike( true, true, 'alike: true is true' );
    alike( 'jest', 'jest', 'alike: string is string' );
    var a = [1];
    alike( a, a, 'alike: array is array' );
});

test('unlike examples', 4, function () {
    unlike( 1, 2, 'unlike: one is not two' );
    unlike( true, false, 'unlike: true is not false' );
    unlike( 'jest', 'jester', 'unlike: string is not string' );
    unlike( [1], [2], 'unlike: array is not array' );
});

test('same examples', 4, function () {
    same( 1, 1, 'same: one is one' );
    same( 'jest', 'jest', 'same: string is string' );
    same( [1], [1], 'same: array is array' );
    same( { 1 : 1 }, { 1 : 1 }, 'same: object is object' );
});

test('different examples', 4, function () {
    different( 1, 2, 'different: one is not two' );
    different( 'jest', 'jester', 'different: string is not string' );
    different( [1], [0], 'different: array is not array' );
    different( { 1 : 0 }, { 1 : 1}, 'different: objects are different' )
});
