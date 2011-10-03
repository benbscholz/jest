// jest is a unit testing framework.
// 2011 (c) Ben Brooks Scholz. MIT Licensed.

(function (window) {

"use strict";
    
var Module = function (name) {
    this.name = name;
    this.tests = [];
};

Module.prototype = {
    setup : function () {
        var jestTests = id('jest-tests'),
            module = id(this.name.split(' ').join('-')),
            moduleHeader;
        
        if (!module && jestTests) {
            module = create('ol');
            module.id = this.name.split(' ').join('-');
            moduleHeader = create('h2');
            moduleHeader.innerHTML = this.name;
            module.appendChild(moduleHeader);
            jestTests.appendChild(module);
        } 
    },
    
    run : function() {
        var test;
        
        while (this.tests.length) {
            test = this.tests.shift();
            this.currentTest = test;
            test.setup.call(test);
            test.run.call(test);
            test.finish.call(test);
        }
    },
    
    finish : function () {
        return;
    }
};

var Test = function (module, name, expected, callback) {
    this.module = module;
    this.name = name;
    this.expected = expected;
    this.actual = 0;
    this.failed = 0;
    this.time;
    this.callback = callback;
    this.results = [];
};

Test.prototype = {
    setup : function () {
        var jestTests = id('jest-tests'),
            module = id(this.module.split(' ').join('-')),
            testList = create('ol'),
            testsHeader = create('h3');
        
        if (jestTests) {
            testList.id = this.name.split(' ').join('-');
            testsHeader.id = this.name.split(' ').join('-') + '-header';
            
            testList.appendChild(testsHeader);
            module.appendChild(testList);
            jestTests.appendChild(module);
        }
    },
    
    run : function () {
        this.time = getTime(this.callback);
        
        if (this.time === 0) {
            this.time = '<1';
        } else if (this.time === 1) {
            this.time = '~1';
        }
    },
    
    finish : function () {
        var module = id(this.module.split(' ').join('-')),
            testList = id(this.name.split(' ').join('-')),
            test,
            header,
            warning;
        
        if (module) {
            header = id(this.name.split(' ').join('-') + '-header');

            if ((this.failed === 0) && (this.expected === this.actual)) {
                header.innerHTML = '&#10004; ';
            } else {
                header.innerHTML = '&#10008; ';
            }
            
            header.innerHTML += this.name + ' ( ' + this.actual + ' tests in ' + 
                               this.time;
                               
            if (typeof this.time !== 'number') {
                header.innerHTML += ' millisecond. )';
            } else {
                header.innerHTML += ' milliseconds. )';
            }
            
            while (this.results.length) {
                test = create('li');
                test.innerHTML = this.results.shift();
                testList.appendChild(test);
            }
            
            if (this.expected !== this.actual) {
                warning = create('h1');
                warning.className = 'warning';
                warning.innerHTML = 'Warning: ' + this.actual + 
                                    ' tests were executed, but ' + this.expected + ' were expected.';
                testList.insertBefore(warning, testList.firstChild.nextSibling);
            }
        }
    }
};

// functions available to the user
var Jest = {
    jest : function (moduleName) {
        var module = new Module(moduleName);
        Jest.modules.push(module);
        Jest.currentModule = module;
    },

    test : function (testsName, tests, expectedTests) {
        var test = new Test(Jest.currentModule.name, testsName, expectedTests, tests);
        Jest.currentModule.tests.push(test);
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
    },
    
    range : function (given, range, message) {
        var result = ((given > range[0]) && (given < range[1]));
        Jest.process(result, message);
    }
};

expose(window, Jest);

expose(Jest, {
    jestStats : { total : 0, failed : 0, time : 0 },
    
    modules : [], 
    
    init : function () {
        var summary = create('div'),
            jestHeader = create('h1'),
            userInfo = create('p'),
            testStats = create('p'),
            passedNumber = create('span'),
            light = create('span'),
            jestTime = create('span'),
            error = create('div'),
            jestTests = id('jest-tests'),
            body = document.body;   
        
        if (!jestTests) {
            error.id = 'error';
            error.innerHTML = '<span class=\"error\"> !! </span>Jest requires a div tag with an id of \'jest-tests\'.';
            body.insertBefore(error, body.firstChild);
            body.style.border = 'none';
            body.style.width = '100%';
            body.style.margin = '0';
            return false;
        }
        
        summary.id = 'summary';
        jestHeader.id = 'jest-header';
        userInfo.id = 'user-info';
        testStats.id = 'test-stats';
        passedNumber.id = 'passed-number';
        light.id = 'light';
        jestTime.id = 'jest-time';
        
        light.className = "running";
        
        jestHeader.innerHTML = 'Jest Unit Tests';
        
        summary.appendChild(jestHeader);
        summary.appendChild(userInfo);
        passedNumber.appendChild(light);
        testStats.appendChild(passedNumber);
        testStats.appendChild(jestTime);
        summary.appendChild(testStats);
        body.insertBefore(summary, jestTests);
        body.insertBefore(create('hr'), jestTests);
        
        return true;
    },
    
    load : function () {
        if (Jest.init()) {
            var module;
                
            Jest.jestStats.time = getTime(function () {
                while (Jest.modules.length) {
                    module = Jest.modules.shift();
                    module.setup.call(module);
                    module.run.call(module);
                    module.finish.call(module);
                }
            });
            
            Jest.finish();
        }
    },
    
    process : function (result, message) {
        var resultData,
            resultStr = 'passed';
            
        if (!result) {
            resultStr = 'failed';
            Jest.jestStats.failed += 1;
            Jest.currentModule.currentTest.failed += 1;
        }
        
        resultData = '<div class=\"' + resultStr + ' test\">' + resultStr + '</div> ' + message;
        Jest.jestStats.total += 1;
        Jest.currentModule.currentTest.actual += 1;
        Jest.currentModule.currentTest.results.push(resultData);
    },
    
    finish : function () {
        var stat = Jest.jestStats,
            browser = id('user-info'),
            passedNumber = id('passed-number'),
            time = id('jest-time'),
            ui = userInfo();
              
        browser.innerHTML = '<p>' + ui.browser + ' ' + ui.version + '</p>' + 
                            '<p>' + ui.os + '</p>';
        
        passedNumber.innerHTML += ' ' + (stat.total - stat.failed) + 
                                  ' of ' + stat.total + ' tests passed in ';

        if (stat.failed !== 0) {
            id('light').className = "failed";
        } else {
            id('light').className = "passed";
        }

        time.innerHTML = stat.time + ' milliseconds' + '.';
    },
    
    isEqual : function (a, b) {
        var i,
            prop,
            aType = typeof a,
            bType = typeof b;
            
        if (a === b) {  
            return true;
        }
            
        if (aType !== bType) {
            return false;
        }
        
        if (Jest.isArray(a) && Jest.isArray(b)) {
            if (a.length !== b.length) {
                return false; 
            }
                
            for (i = 0; i < a.length; i+=1) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }
            
            return true;
        }
        
        if (aType !== 'object') {
            return false;
        }
            
        for (prop in a) {
            if (a.hasOwnProperty(prop) && !b.hasOwnProperty(prop)) {
                return false;
            }
                
            if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop)) {
                return Jest.isEqual(a[prop], b[prop]);
            }
        }
        
        return true;
    },
    
    isArray : function (a) {
        if (a === 'undefined') {
            return false;
        } else if (a && typeof a === 'object' && a.constructor === Array) {
            return true;
        } else if (Object.prototype.toString.call(a) === '[object Array]') {
            return true;
        } else {
            return false;
        }
    }
});

addEvent(window, 'load', Jest.load);

function expose (exposed, exposer) {
    for (var property in exposer) {
        if (exposer.hasOwnProperty(property)) {
            exposed[property] = exposer[property]; 
        }
    }
}

function addEvent (obj, type, callback) {
    if (obj.addEventListener) {
        obj.addEventListener(type, callback, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + type, callback);
    }
}

function getTime (callback) {
    var start = new Date(),
        done;
        
    callback();
    done = new Date();
    
    return done.getTime() - start.getTime();
}

function create (elem) {
    return document.createElement(elem);
}

function id (str) {
    return document.getElementById(str);
}

// from detect.js
// (c) 2011 Ben Brooks Scholz. MIT Licensed.
// http://github.com/benbscholz/detect
function userInfo () {
    var browser,
        os,
        version,
        string,
        ua = window.navigator.userAgent,
        platform = window.navigator.platform,

        info = function () {
            if ( /MSIE/.test(ua) ) {
                browser = 'Internet Explorer';
                if ( /IEMobile/.test(ua) ) {
                    browser += ' Mobile';
                }
                version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];  
            } else if ( /Chrome/.test(ua) ) {
                browser = 'Chrome';
                version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];
            } else if ( /Opera/.test(ua) ) {
                browser = 'Opera';
                if ( /mini/.test(ua) ) {
                    browser += ' Mini';
                } else if ( /Mobile/.test(ua) ) {
                    browser += ' Mobile';
                } 
            } else if ( /Android/.test(ua) ) {
                browser = 'Android Webkit Browser';
                mobile = true;
                os = /Android\s[\.\d]+/.exec(ua);
            } else if ( /Firefox/.test(ua) ) {
                browser = 'Firefox';
                if ( /Fennec/.test(ua) ) {
                    browser += ' Mobile';
                }
                version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
            } else if ( /Safari/.test(ua) ) {
                browser = 'Safari';
                if ( (/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua)) ) {
                    os = 'iOS';
                }
            }

            if ( !version ) {
                 version = /Version\/[\.\d]+/.exec(ua);
                 if (version) {
                     version = version[0].split('/')[1];
                 } else {
                     version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1]
                 }
            }
            
            if ( platform === 'MacIntel' || platform === 'MacPPC' ) {
                os = 'Mac OS X ' + /10[\.\_\d]+/.exec(ua)[0];
                if ( /[\_]/.test(os) ) {
                    os = os.split('_').join('.');
                }
            } else if ( platform === 'Win32' ) {
                os = 'Windows 32 bit';
            } else if ( platform == 'Win64' ) {
                os = 'Windows 64 bit';
            } else if ( !os && /Linux/.test(platform) ) {
                os = 'Linux';
            }
            
            if ( !os && /Windows/.test(ua) ) {
                os = 'Windows';
            }
            
        }();
    return {
        browser : browser,
        version : version,
        os : os
    };        
}

}(this));




