// jest is a unit testing framework.
// 2011 (c) Ben Brooks Scholz. MIT Licensed.

var Jest = {
    yes : function (testFunction, message) {
        // cast to boolean
        var result = !!testFunction;
        var testResult = {
            boolResult : result,
            msgResult : message
        };
        results.push(testResult);
    },
    
    no : function (testFunction, message) {
        // cast to boolean
        var result = !testFunction;
        var testResult = {
            boolResult : result,
            msgResult : message
        };
        results.push(testResult);
    },
    
    alike : function (testFunction, expected, message) {
        
    },
    
    same : function ( testFunction, expected, message) {
        
    }

};

jest = function (moduleName) {
	previousModule = jest.currentModule;
    currentModule = moduleName;
    results = [];
};

test = function (testsName, expectedTests, tests) {
    var currentTests = testsName;
    var expectedTests = expectedTests;
    
    yes = Jest.yes;
    no = Jest.no;

    tests();

    var htmlOutput = '<h1>Jest Test Suite</h1><h2>' + currentModule + '</h2>' +
                     '<h3>' + currentTests + '</h3>';
    
    for (var i = 0; i < results.length; i++) {
        htmlOutput += '<p>' + results[i].boolResult.toString() + '</p>';
        htmlOutput += '<p>' + results[i].msgResult + '</p>';
    }

    document.body.innerHTML = htmlOutput;
};


