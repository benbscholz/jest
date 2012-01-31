#Jest: a unit-testing framework for javascript in the browser.

ALPHA

Jest.js simplifies javascript testing.

##Getting Started

Add Jest to an HTML file:

	<link href="jest.css" rel="stylesheet" type="text/css">
	<script src="jest.js"></script>
	
Add your tests:

	<script src="tests.js"></script>
	
Indicate where on the page the tests should appear:

	<div id="jest"></div>
	
##Create tests

Jest organizes individual tests into **test-groups** and test-groups into **modules**.
Each test file should begin with the declaration of the module name:

	jest('boolean module');
	
Each test-group following this declaration will be considered a member of `module` 'boolean module', unless `jest()` is called again with a different module name.

A test-group is declared with a name, a callback containing the tests, and the expected number of tests:

	test('true tests', function () {
		yes(true, 'true is true');
		no(!true, 'not true is false');
	}, 2);

For a complete demonstration of Jest's functions, see `examples/tests.js` or open `html/jest.html` in your browser.

##Run tests

Loading an HTML page with the proper resources and `<div id="jest"></div>` in the body will run Jest.