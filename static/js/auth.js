var app = angular.module('POSApp', ['ui.router', 'ngIdle'], function($httpProvider){
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
 
    /**
    * The workhorse; converts an object to x-www-form-urlencoded serialization.
    * @param {Object} obj
    * @return {String}
    */ 
    var param = function(obj) {
        
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
        for(name in obj) {
            value = obj[name];
        
            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
            }
        }
        else if(value instanceof Object) {
            for(subName in value) {
                subValue = value[subName];
                fullSubName = name + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        }
        else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      
        return query.length ? query.substr(0, query.length - 1) : query;
    };
 
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' && data.method !== "put" ? param(data) : data;
    }];
});

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    logout: 'logout',
    usersInit: 'users-init'
});

app.constant('APP_EVENTS', {
    ordersReady: 'orders-ready',
    orderSelected: 'order-selected',
    orderClosed: 'order-closed',
    orderUpdated: 'order-updated',
    orderPaid: 'order-paid',
    sendOrder: 'send-order',
    payOrder: 'pay-order',
    createSubOrder: 'create-sub-order',
    orderItemsReady: 'order-items-ready',
    orderItemSaved: 'order-item-saved',
    tableSelected: 'table-selected',
    tableTaken: 'table-taken',
    openTables: 'open-tables',
    categoryChanged: 'category-changed',
    categoryReady: 'category-ready',
    productsReady: 'products-ready',
    productSelected: 'product-selected',
    comment: 'comment',
    commented: 'commented'
});

app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
});

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');
});

app.config(function ($stateProvider, USER_ROLES) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'dashboard/index.html',
        data: {
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        }
    });
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);
});

app.config(['$keepaliveProvider', '$idleProvider', function($keepaliveProvider, $idleProvider) {
    if(window.location.href.indexOf('pos-op') > -1){
        $idleProvider.idleDuration(30);
        $idleProvider.warningDuration(3);
    }
}]);

app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS, Session) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if (Session.token) {
                config.headers.Authorization = "Token " + Session.token;
            }
            return config;
        },
        responseError: function (response) {
            if (response.status === 401) {
                console.error("HERE");
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, response);
            }
            
            if (response.status === 403) {
                console.error("THERE");
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, response);
            }
        
            if (response.status === 419 || response.status === 440) {
                $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout,response);
            }

            return $q.reject(response);
        }
    };
});

app.factory('UserService', function ($http, Session, $q, $rootScope, AUTH_EVENTS) {
    var userService = {};
    userService.list = [];
    userService.current = void 0;

    userService.get = function(){
        return $http.get('/employees/').then(function(response){
            userService.list = response.data.results;
            userService.list.forEach(function(u){
                u.id = u.userId;
            });

            $rootScope.$broadcast(AUTH_EVENTS.usersInit, userService.list);
        });
    };

    userService.set = function(pin){
        userService.list.forEach(function(u){
            if(u.pin === pin.toString()){
                userService.current = u;
            }
        });
        
        return userService.current;
    };

    userService.report = function(){
        $http.get('/report-waiter/?w=' + userService.current.userId).then(function(response){
            if(response.data && response.data.indexOf('error') > -1) alert("Имате незатворени сметки.");
            if(response.data && response.data.indexOf('printer') > -1) alert("Има проблем с принтера.");
        });
    };

    return userService;
});

app.factory('AuthService', function ($http, Session, $q) {
    return {
        checkToken: function(){
            Session.restore();

            if(Session.token){
                return true;
            }

            return false;
        },
        login: function (credentials) {
            var csrftoken = this.getCookie('csrftoken');
            
            credentials["csrfmiddlewaretoken"] = csrftoken;
            credentials["next"] = "/";
            credentials["submit"] = "Log in";
            
            return $http
                        .post('/api-token-auth/', credentials)
                        .success(function (res) {
                            Session.create(res.token);
                        }).error(function(){
                        });
        },
        isAuthenticated: function () {
            return !!Session.token;
        },
        isAuthorized: function (authorizedRoles) {
            return (this.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
        },
        getCookie: function(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
        
            return cookieValue;
        }
    };
});

app.service('Session', function () {
    this.create = function (token) {
        this.token = token;
        localStorage.setItem("token", token);
    };
    
    this.destroy = function () {
        this.token = null;
        localStorage.removeItem("token");
    };

    this.restore = function (){
        this.token = localStorage.getItem("token");
    };
  
    return this;
});

app.controller('ApplicationController', function($scope, $rootScope, AUTH_EVENTS, USER_ROLES, AuthService, UserService, Session, $idle, $keepalive){
    $scope.currentUser = null;
    $scope.unlocked = false;
    $scope.userRoles = USER_ROLES;
    $scope.users = UserService;

    $scope.isAuthorized = function(){
        return AuthService.isAuthorized(arguments[0]);
    };

    $scope.isAuthenticated = function(){
        return AuthService.isAuthenticated();
    };

    $scope.signOut = function(){
        localStorage.clear();
        window.location.reload();
    };

    $scope.lock = function(){
        window.location.reload();
    };

    $scope.money = function(total){
        return Math.round(total*100)/100;
    }
    
    $rootScope.$on(AUTH_EVENTS.logout, function(){
        $scope.signOut();
    });

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
        if(window.location.pathname.indexOf('/auth') > -1) window.location.href = "/pos-op";
        else UserService.get();
    });

    $rootScope.$on(AUTH_EVENTS.userReady, function(){
        $scope.unlocked = true;
    });

    $rootScope.$on('$idleTimeout', function() {
        if(!$scope.unlocked) return ; 
        
        $scope.lock();
    });

    $idle.watch();
});

app.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService, UserService) {
    $scope.credentials = {
        username: '',
        password: ''
    };

    $scope.login = function (credentials) {
        var result = AuthService.login(credentials);
        result.then(function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

    $scope.pin = function (credentials) {
        if(UserService.set(credentials.pin)){
            $rootScope.$broadcast(AUTH_EVENTS.userReady);
        }
    };
});

app.directive('handleTouchSubmit', function(){
    return function(scope, element, attr){
        element.bind('submit', function() {
            document.activeElement.blur();
            window.scrollTo(0,0);
        });
    };
});

app.run(function ($rootScope, AUTH_EVENTS, AuthService, UserService, Session, $idle) {
    document.addEventListener("touchstart", function(){}, true);
    
    $rootScope.$on('$stateChangeStart', function (event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
                // user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });

    if(AuthService.checkToken()){
        if(window.location.href === '/auth') window.location.href = "/pos-op";
        else UserService.get();
    }
    else{
        if(window.location.pathname.indexOf('/auth') < 0) window.location.href = '/auth';
    }

    setTimeout(function(){
        if(window.location.pathname.indexOf('/kitchen') > -1) window.location.reload();
        if(window.location.pathname.indexOf('/skara') > -1) window.location.reload();
        if(window.location.pathname.indexOf('/bar') > -1) window.location.reload();
    }, 15000);

    FastClick.attach(document.body);

    $idle.watch();
});