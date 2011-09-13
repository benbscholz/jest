// jest is a unit testing framework.
// 2011 (c) Ben Brooks Scholz. MIT Licensed.

(function (window) {

jest = function (moduleName) {
	window.previousModule = window.currentModule;
    window.currentModule = moduleName;
    window.results = [];
    window.failed = 0;
};

var Jest = {
    yes : function (testFunction, message) {
        // cast to boolean
        var result = !!testFunction;
        var testResult = {
            boolResult : result,
            msgResult : message
        };
        if (!result) window.failed += 1;
        window.results.push(testResult);
    },
    
    no : function (testFunction, message) {
        // cast to boolean
        var result = !testFunction;
        var result = {
            boolResult : result,
            msgResult : message
        };
        if (!result) window.failed += 1;
        window.results.push(result);
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
    for (property in extender) 
        extendee[property] = extender[property];
    return extendee;
};

extend(window, Jest);

extend(Jest, {
    parseStats : function () {
        var statsHtml = [],
            bodyInit = '<div id=\"stat-summary\"><h1 id=\"jest-header\">Jest Test Suite</h1><span id=\"success-light\"></span><p id=\"user-info\">';
        statsHtml.push(bodyInit);
        statsHtml.push(getBrowserString());
        statsHtml.push('</p>');
        statsHtml.push('<p id=\"passed-number\">');
        statsHtml.push((window.results.length - window.failed) + ' out of ' + window.results.length.toString()); 
        statsHtml.push(' tests passed.');
        statsHtml.push('</p><p id=\"test-time\">time: 86 milliseconds.</p></div><h2 id=\"module-name\">');
        statsHtml.push(currentModule);
        statsHtml.push('</h2>');
        return statsHtml.join('');
    },
    
    parseTests : function (currentTests) {
        var result,
            resultsHtml = [];
        resultsHtml.push('<ol class=\"test-module\"><h3 id=\"test-group\">'); 
        resultsHtml.push(currentTests);
        resultsHtml.push('</h2>');
        for (result = 0; result < window.results.length; result += 1) {
            resultsHtml.push('<li class=\"result\"><p>');
            if (window.results[result].boolResult === true)
                resultsHtml.push('passed');
            else
                resultsHtml.push('failed');
            resultsHtml.push(' -- ');
            resultsHtml.push(window.results[result].msgResult);
            resultsHtml.push('</p></li>');
        }
        resultsHtml.push('</ol>');
        return resultsHtml.join('');
    }
});

test = function (testsName, expectedTests, tests) {
    var currentTests = testsName;
    var expectedTests = expectedTests;

    tests();
    document.body.innerHTML = Jest.parseStats();
    document.body.innerHTML += Jest.parseTests(currentTests);
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
    } else if (version[1] === 'MSIE' ||
               version[2] === 'MSIE' ||
               version[3] === 'MSIE' ||
               version[4] === 'MSIE') {
        version = parseVersion(3);
        browser = 'Internet Explorer';
    } else if (navigator.product === 'Gecko') {
        version = parseVersion(1);
        browser = 'Firefox';
    }
    console.log(browser + ' ' + version);
    return browser + ' ' + version;
};


}(this));



