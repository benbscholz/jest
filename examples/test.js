// module name
jest("jaylist");

// set 3 expected tests
test("jest examples", 3, function () {
	yes( true, "first test" );
	
	var jaylist = new List();
	//alike( jaylist.object(), {}, "perform basic equality check" );
	
	var beelist = new List();
	//same( jaylist, beelist, "perform deep equality check" );
});