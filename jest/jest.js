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
    yes : function (given, message) {
        // cast to boolean
        var result = !!given;
        var testResult = {
            boolResult : result,
            msgResult : message
        };
        if (!result) window.failed += 1;
        window.results.push(testResult);
    },
    
    no : function (given, message) {
        // cast to boolean
        var result = !given;
        var testResult = {
            boolResult : result,
            msgResult : message
        };
        if (!result) window.failed += 1;
        window.results.push(testResult);
    },
    
    alike : function (given, expected, message) {
        var result = (given == expected);
        var testResult = {
            boolResult : result,
            msgResult : message
        };
        if (!result) window.failed += 1;
        window.results.push(testResult);
    },
    
    unlike : function (given, expected, message) {
        var result = (given != expected);
        var testResult = {
            boolResult : result,
            msgResult : message
        }
        if (!result) window.failed += 1;
        window.results.push(testResult);
    },
    
    same : function (given, expected, message) {
        var result = Jest.isEqual(given, expected);
        var testResult = {
            boolResult : result,
            msgResult : message
        };
        if (!result) window.failed += 1;
        window.results.push(testResult);
    },
    
    different : function (given, expected, message) {
        var result = !(Jest.isEqual(given, expected));
        var testResult = {
            boolResult : result,
            msgResult : message
        };
        if (!result) window.failed += 1;
        window.results.push(testResult);
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
            bodyInit = '<div id=\"stat-summary\"><h1 id=\"jest-header\">Jest Test Suite</h1><p id=\"user-info\">';
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
    },
    
    isEqual : function (a, b) {
        var i,
            prop,
            aType = typeof a,
            bType = typeof b;
            
        if (a === b) return true;
        if (aType !== bType) return false;
        
        if (this.isArray(a) && this.isArray(b)) {
            if (a.length !== b.length) return false;
            
            for (i = 0; i < a.length; i+=1) 
                if (a[i] !== b[i]) return false;

            return true;
        }
        
        if (aType !== 'object') return false;
        for (prop in a) {
            if (!b.hasOwnProperty(prop)) return false;
            if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop))
                return this.isEqual(a[prop], b[prop]);
        }
    },
    
    isArray :  function (a) {
        if (a && typeof a === 'object' && a.constructor === Array)
            return true;
        else if (Object.prototype.toString.call(a) == '[object Array]')
            return true;
        else
            return false;
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
    return browser + ' ' + version;
};


}(this));



