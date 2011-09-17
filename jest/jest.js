// jest is a unit testing framework.
// 2011 (c) Ben Brooks Scholz. MIT Licensed.

(function (window) {
    
window.queue = {};

var Test = function (name, expected, callback) {
    this.name = name;
    this.expected = expected;
    this.actual = 0;
    this.callback = callback; 
    this.tests = []; 
};

Test.prototype = {
    setup : function () {
        
    },
    
    finish : function () {
        
    },
    
    queue : function () {
        var q = window.queue,
            module = window.module;
            
        if (Jest.isArray(window.queue[module]))
            window.queue[module].push(this.callback);
        else
            window.queue[module] = [];
    }
};

var Jest = {
    jest : function (moduleName) {
        window.module = moduleName;
    },

    test : function (testsName, expectedTests, tests) {
        var test = new Test(testsName, expectedTests, tests);
        test.queue();
    },
    
    yes : function (given, message) {
        var result = !!given;
        Jest.process(result, message);
    },
    
    no : function (given, message) {
        var result = !given;
        Jest.process(result, message);
    },
    
    alike : function (given, expected, message) {
        var result = !!(given == expected);
        Jest.process(result, message);
    },
    
    unlike : function (given, expected, message) {
        var result = !(given == expected);
        Jest.process(result, message);
    },
    
    same : function (given, expected, message) {
        var result = !!Jest.isEqual(given, expected);
        Jest.process(result, message);
    },
    
    different : function (given, expected, message) {
        var result = !Jest.isEqual(given, expected);
        Jest.process(result, message);
    }
};

expose(window, Jest);

expose(Jest, { 
    load : function () {
        Jest.run();
    },
    
    process : function (result, message) {
        console.log(result.toString() + ' ' + message);    
    },
    
    isEqual : function (a, b) {
        var i,
            prop,
            aType = typeof a,
            bType = typeof b;
            
        if (a === b)    
            return true;
            
        if (aType !== bType) 
            return false;
        
        if (Jest.isArray(a) && Jest.isArray(b)) {
            if (a.length !== b.length) 
                return false; 
                
            for (i = 0; i < a.length; i+=1) {
                if (a[i] !== b[i]) 
                    return false;
            }
            
            return true;
        }
        
        if (aType !== 'object') 
            return false;
            
        for (prop in a) {
            if (a.hasOwnProperty(prop) && !b.hasOwnProperty(prop)) 
                return false;
                
            if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop))
                return Jest.isEqual(a[prop], b[prop]);
        }
        
        return true;
    },
    
    isArray :  function (a) {
        if (a && typeof a === 'object' && a.constructor === Array)
            return true;
        else if (Object.prototype.toString.call(a) == '[object Array]')
            return true;
        else
            return false;
    },
    
    run : function () {
        for (var module in window.queue) {
            while (window.queue[module].length)
                window.queue[module].shift()();
        }
    }
});

addEvent(window, 'load', Jest.load);

function expose (exposee, exposer) {
    for (var property in exposer)
        exposee[property] = exposer[property];
    return exposee;
}

function addEvent (element, type, callback) {
    if (element.addEventListener)
        element.addEventListener(type, callback, false);
    else if (element.attachEvent)
        element.attachEvent('on' + type, callback);
}

function getBrowser () {
    var browser = '',
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
    } else if (navigator.appName === "Microsoft Internet Explorer") {
        version = parseVersion(3);
        browser = 'Internet Explorer';
    } else if (navigator.product === 'Gecko') {
        version = parseVersion(1);
        browser = 'Firefox';
    } 
    return browser + ' ' + version;
}

}(this));



