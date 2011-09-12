#Jest 
##A unit-testing framework for javascript.

Usage:

    jest('test');
    
    test('basic tests', 6, function() {
        yes( true, 'true is true' );
        yes( 1, 'truthy is true' );
        
        no( false, 'false is false' ); 
        no( 0, 'falsy is false' ); 
        
        // basic equality check 
        //alike();
        
        // deep equality check
        //same();
    });