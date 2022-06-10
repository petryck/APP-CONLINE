
var APP_NAME = 'Sirius - PWA';
var APP_VER = '1.0';
var CACHE_NAME = APP_NAME + '-' + APP_VER;
var APP_ROOT = '/';
var REQUIRED_FILES = [
	// HTML Files
    APP_ROOT+'pages/comercial.html',
	APP_ROOT+'home.html',
	// Styles
	APP_ROOT+'styles/bootstrap.css',
	// Scripts
	APP_ROOT+'scripts/custom.js',
	APP_ROOT+'scripts/bootstrap.min.js',
	// Images
	APP_ROOT+'images/empty.png',
];
var APP_DIAG = true;
self['addEventListener']('install', function(_0xd36dx7) {
    _0xd36dx7['waitUntil'](caches['open'](CACHE_NAME)['then'](function(_0xd36dx9) {
        return _0xd36dx9['addAll'](REQUIRED_FILES)
    })['catch'](function(_0xd36dx8) {
        if (APP_DIAG) {
            console['log']('Service Worker Cache: Error Check REQUIRED_FILES array in _service-worker.js - files are missing or path to files is incorrectly written -  ' + _0xd36dx8)
        }
    })['then'](function() {
        return self['skipWaiting']()
    })['then'](function() {
        if (APP_DIAG) {
            console['log']('Service Worker: Cache is OK')
        }
    }));
    if (APP_DIAG) {
        console['log']('Service Worker: Installed')
    }
});
self['addEventListener']('fetch', function(_0xd36dx7) {
    _0xd36dx7['respondWith'](caches['match'](_0xd36dx7['request'])['then'](function(_0xd36dxa) {
        if (_0xd36dxa) {
            return _0xd36dxa
        };
        return fetch(_0xd36dx7['request'])
    }));
    if (APP_DIAG) {
        console['log']('Service Worker: Fetching ' + APP_NAME + '-' + APP_VER + ' files from Cache')
    }
});
self['addEventListener']('activate', function(_0xd36dx7) {
    _0xd36dx7['waitUntil'](self['clients']['claim']());
    _0xd36dx7['waitUntil'](caches['keys']()['then']((_0xd36dxb) => {
        return Promise['all'](_0xd36dxb['filter']((_0xd36dxc) => {
            return (_0xd36dxc['startsWith'](APP_NAME + '-'))
        })['filter']((_0xd36dxc) => {
            return (_0xd36dxc !== CACHE_NAME)
        })['map']((_0xd36dxc) => {
            return caches['delete'](_0xd36dxc)
        }))
    }));
    if (APP_DIAG) {
	
        console['log']('Service Worker: Activated')
    }
})
