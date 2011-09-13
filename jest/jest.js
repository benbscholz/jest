// jest is a unit testing framework.
// 2011 (c) Ben Brooks Scholz. MIT Licensed.

(function (window) {

jest = function (moduleName) {
	previousModule = jest.currentModule;
    currentModule = moduleName;
    results = [];
};

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
        var result = {
            boolResult : result,
            msgResult : message
        };
        results.push(result);
    },
    
    alike : function (testFunction, expected, message) {
        
    },
    
    unlike : function (testFunction, expected, message) {
        
    },
    
    same : function (testFunction, expected, message) {
        
    },
    
    different : function (testFunction, expected, message) {
        
    }
};

// extend an object (extendee) with the properties of another object (extender)
var extend = function (extendee, extender) {
    var property;
    for (property in extender) {
        extendee[property] = extender[property];
    }
    return extendee;
};

var getBrowserString = function () {
    var browser,
        version = navigator.userAgent.split(' '),
        parseVersion = function (position) {
            return version[version.length-position].split('/')[1];
        };
    
        
    if (navigator.vendor === 'Apple Computer, Inc.') {
        version = parseVersion(2);
        browser = 'Safari';
    } else if (navigator.vendor === 'Google Inc.') {
        version = parseVersion(2);
        browser = 'Chrome';
    } else if (window.opera) {
        version = parseVersion(1);
        browser = 'Opera';
    } else if (navigator.product === 'Gecko') {
        version = parseVersion(1);
        browser = 'Firefox';
    }
    console.log(browser + ' ' + version);
    return browser + ' ' + version;
};

extend(window, Jest);

extend(Jest, {
    parseStats : function (currentTests) {
        statsHtml = [];
        statsHtml.push("<h1>Jest Test Suite</h1><div id=\"stat-summary\"><p id=\"user-info\">" + 
                        getBrowserString() + "</p>");
        statsHtml.push("<p id=\"passed-number\">6 out 6 tests passed.</p><p id=\"test-time\">execution time: 86 milliseconds.</p></div><h2 id=\"module-name\">" + currentModule + "</h2>");
        statsHtml.push("<h2 id=\"test-group\">" + 
                        currentTests +
                        "</h2>");
        return statsHtml.join('');
    }
});

test = function (testsName, expectedTests, tests) {
    var currentTests = testsName;
    var expectedTests = expectedTests;

    tests();
    this.document.body.innerHTML = Jest.parseStats(currentTests);
};


}(this));



