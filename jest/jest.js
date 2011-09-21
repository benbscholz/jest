// jest is a unit testing framework.
// 2011 (c) Ben Brooks Scholz. MIT Licensed.

(function (window) {

var Test = function (module, name, expected, callback) {
    this.module = module;
    this.name = name;
    this.expected = expected;
    this.actual = 0;
    this.failed = 0;
    this.callback = callback;
    this.results = [];
};

Test.prototype = {
    setup : function () {
        var jestTests = byId('jest-tests'),
            module = byId(this.module.split(' ').join('-')),
            testList = create('ol'),
            testsHeader = create('h3'),
            moduleHeader;
        
        if (!module) {
            module = create('ol');
            module.id = this.module.split(' ').join('-');
            moduleHeader = create('h2');
            moduleHeader.innerHTML = this.module;
            module.appendChild(moduleHeader);
        }
        
        testList.id = this.name.split(' ').join('-');
        testsHeader.id = this.name.split(' ').join('-') + '-header';
        
        testList.appendChild(testsHeader);
        module.appendChild(testList);
        jestTests.appendChild(module);
    },
    
    run : function () {
        var self = this;
        expose(Jest.data, {
            currentTest : self
        });
        this.callback();
    },
    
    finish : function () {
        var module = byId(this.module.split(' ').join('-')),
            testList = byId(this.name.split(' ').join('-')),
            test,
            moduleHeader,
            header,
            i;

        header = byId(this.name.split(' ').join('-') + '-header');
        header.innerHTML = this.name + ' -- ' + (this.actual - this.failed) + ' of ' + this.actual + ' passed';
        
        while (this.results.length) {
            test = create('li');
            test.innerHTML = this.results.shift();
            testList.appendChild(test);
        }
    }
};

var Jest = {
    jest : function (moduleName) {
        Jest.data.currentModule = moduleName;
    },

    test : function (testsName, expectedTests, tests) {
        var test = new Test(Jest.data.currentModule, testsName, expectedTests, tests);
        Jest.data.tests.push(test);
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

var data = {
    tests : [],
    jestStats : { total : 0, failed : 0, time : 0 }
}

expose(Jest, {
    data : data,
    
    load : function () {
        var i,
            test,
            start, 
            done;
        start = new Date();
        
        while (Jest.data.tests.length) {
            test = Jest.data.tests.shift();
            test.setup.call(test);
            test.run.call(test);
            test.finish.call(test);
        }
        
        done = new Date();
        Jest.data.jestStats.time = done.getTime() - start.getTime();
        Jest.finish();
    },
    
    process : function (result, message) {
        var resultStr = 'passed',
            resultData;
        if (!result) {
            resultStr = 'failed';
            Jest.data.jestStats.failed += 1;
            Jest.data.currentTest.failed += 1;
        }
        resultData = resultStr + ' -- ' + message;
        Jest.data.jestStats.total += 1;
        Jest.data.currentTest.actual += 1;
        Jest.data.currentTest.results.push(resultData);
    },
    
    finish : function () {
        var stat = Jest.data.jestStats;
            browser = byId('user-info'),
            passedNumber = byId('passed-number'),
            light = byId('light'),
            time = byId('jest-time');
        
        browser.innerHTML = getBrowser();
        passedNumber.innerHTML += ' ' + (stat.total - stat.failed) + ' of ' + stat.total + ' tests passed &rarr;';
    
        if (stat.failed) 
            light.style.background = '#FF6464';

        time.innerHTML = stat.time + ' milliseconds';
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
        if (a == 'undefined')
            return false;
        else if (a && typeof a === 'object' && a.constructor === Array)
            return true;
        else if (Object.prototype.toString.call(a) == '[object Array]')
            return true;
        else
            return false;
    }
})

addEvent(window, 'load', Jest.load);

function expose (exposed, exposer) {
    for (var property in exposer) {
        if (exposer.hasOwnProperty(property))
            exposed[property] = exposer[property]; 
    }
}

function addEvent (obj, type, callback) {
    if (obj.addEventListener)
        obj.addEventListener(type, callback);
    else if (obj.attachEvent)
        obj.attachEvent('on' + type, callback);
}

function create (elem) {
    return document.createElement(elem);
}

function byId (id) {
    var elem = document.getElementById(id);
    if (elem) 
        return elem;
    else 
        return false;
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



