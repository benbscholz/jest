jest('test');

test('basic tests', 6, function() {
    yes( true, 'true is true' );
    yes( !false, 'not false is true' );
    yes( !!true, 'not not true is true' );
    yes( 1, 'truthy is true' );
    
    no( false, 'false is false' );
    no( !true, 'not true is false' );
    no( !!false, 'not not false is false' ); 
    no( 0, 'falsy is false' ); 
    
    //alike();
    
    //same();
});