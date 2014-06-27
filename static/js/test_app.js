var app = angular.module('POSApp', ['ui.router'], function($httpProvider){
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
    usersInit: 'users-init'
});

app.constant('APP_EVENTS', {
    ordersReady: 'orders-ready',
    orderSelected: 'order-selected',
    orderClosed: 'order-closed',
    orderItemsReady: 'order-items-ready',
    orderItemSaved: 'order-item-saved',
    tableSelected: 'table-selected',
    tableTaken: 'table-taken',
    productSelected: 'product-selected'
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
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, response);
            }
            
            if (response.status === 403) {
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, response);
            }
        
            if (response.status === 419 || response.status === 440) {
                $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout,response);
            }

            return $q.reject(response);
        }
    };
});


app.factory('TableService', function ($http, Session, $q) {
    var tableService = {};
    tableService.list = [];

    tableService.get = function(){
        return $http.get('/tables/').then(function(response){
            tableService.list = response.data.results;
        });
    };

    tableService.createTable = function(parentTable){
        /*
        return $http.post('/tables/').then(function(response){
            tableService.tables = response.data.results;
        });
        */
    };

    return tableService;
});

app.factory('CategoryService', function ($http, Session, $q) {
    var categoryService = {};
    categoryService.list = [];

    categoryService.get = function(){
        return $http.get('/categories/').then(function(response){
            categoryService.list = response.data.results;
        });
    };

    return categoryService;
});

app.factory('ProductService', function ($http, Session, $q) {
    var productService = {};
    productService.list = [];

    productService.get = function(){
        return $http.get('/products/').then(function(response){
            productService.list = response.data.results;
        });
    };

    return productService;
});

app.factory('OrderService', function ($http, Session, $rootScope, $q, APP_EVENTS, UserService) {
    var orderService = {};
    var allOrders = [];
    orderService.list = [];

    function getById(id){
        for(var i=0; i<orderService.list.length; i++){
            if(orderService.list[i].id === id) return orderService.list[i]
        }

        return null;
    }

    orderService.get = function(){
        return $http.get('/orders/').then(function(response){
            orderService.list = response.data.results;
            allOrders = response.data.results;

            orderService.list = orderService.list.filter(function(os){
                return os.operatedById === UserService.current;
            });

            $rootScope.$broadcast(APP_EVENTS.ordersReady);
        });
    };

    orderService.save = function(order){
        return $http.put('/orders/' + order.id + '/', order).then(function(response){
            orderService.get();
            if(order.status) $rootScope.$broadcast(APP_EVENTS.orderClosed);
        });
    };

    orderService.add = function(order){
        return $http.post('/orders/', order).then(function(response){
            orderService.get();

            $rootScope.$broadcast(APP_EVENTS.orderSelected, order);
        });
    };

    $rootScope.$on(APP_EVENTS.tableSelected, function(args, id){
        for(var i=0; i < allOrders.length; i++){
            if(allOrders[i].tableId === id){
                if(allOrders[i].operatedById === UserService.current){
                    $rootScope.$broadcast(APP_EVENTS.orderSelected, allOrders[i]);
                }
                else{
                    $rootScope.$broadcast(APP_EVENTS.tableTaken, allOrders[i].tableId);
                }
                
                return ;
            }
        }

        var order = {};
        order.openedBy = window.location.origin + "/users/" + UserService.current + "/";
        order.operatedBy = window.location.origin + "/users/" + UserService.current + "/";
        order.table = window.location.origin + "/tables/" + id + "/";
        order.tableId = id;

        orderService.add(order);
    });

    $rootScope.$on(APP_EVENTS.orderItemSaved, function(args, id){
        orderService.save(getById(id));
    });

    return orderService;
});

app.factory('OrderItemService', function ($http, $rootScope, Session, $q, APP_EVENTS) {
    var orderItemService = {};
    orderItemService.list = [];

    orderItemService.get = function(){
        return $http.get('/orderitem/').then(function(response){
            orderItemService.list = response.data.results;

            $rootScope.$broadcast(APP_EVENTS.orderItemsReady);
        });
    };

    orderItemService.save = function(orderItem){
        return $http.put('/orderitem/' + orderItem.id + "/", orderItem).then(function(response){
            orderItemService.get();
            
            $rootScope.$broadcast(APP_EVENTS.orderItemSaved, orderItem.orderId);
        });
    };

    orderItemService.add = function(orderItem){
        return $http.post('/orderitem/', orderItem).then(function(response){
            orderItemService.get();

            $rootScope.$broadcast(APP_EVENTS.orderItemSaved, orderItem.orderId);
        });
    };

    $rootScope.$on(APP_EVENTS.orderClosed, function(){
        orderItemService.list = [];
    });

    return orderItemService;
});

app.factory('UserService', function ($http, Session, $q, $rootScope, AUTH_EVENTS) {
    var userService = {};
    userService.list = [];
    userService.current = void 0;

    userService.get = function(){
        return $http.get('/employees/').then(function(response){
            userService.list = response.data.results;
            $rootScope.$broadcast(AUTH_EVENTS.usersInit);
        });
    };

    userService.set = function(pin){
        userService.list.forEach(function(u){
            if(u.pin === pin){
                userService.current = u.id;
            }
        });
        
        return userService.current;
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
                            //$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, response);
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

app.controller('ApplicationController', function($scope, $rootScope, AUTH_EVENTS, USER_ROLES, AuthService, UserService, Session){
    $scope.currentUser = null;
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

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
        UserService.get();
    });
});

app.controller('TablesController', function($scope, $rootScope, AUTH_EVENTS, APP_EVENTS, TableService){
    $scope.tables = TableService;

    $scope.selectTable = function(table){
        $rootScope.$broadcast(APP_EVENTS.tableSelected, table.id);
    };

    $rootScope.$on(AUTH_EVENTS.usersInit, function(){
        TableService.get();     
    });

    $rootScope.$on(APP_EVENTS.tableTaken, function(){
        alert("Съжелявам - тази маса е заета");
    });
});

app.controller('CategoryController', function($scope, $rootScope, AUTH_EVENTS, CategoryService){
    $scope.categories = CategoryService;
    $rootScope.$on(AUTH_EVENTS.usersInit, function(){
        CategoryService.get();
    });
});

app.controller('ProductController', function($scope, $rootScope, AUTH_EVENTS, APP_EVENTS, ProductService){
    $scope.products = ProductService;
    
    $scope.selectProduct = function(product){
        $rootScope.$broadcast(APP_EVENTS.productSelected, product.id);
    };

    $rootScope.$on(AUTH_EVENTS.usersInit, function(){
        ProductService.get();
    });
});

app.controller('OrderController', function($scope, $rootScope, AUTH_EVENTS, APP_EVENTS, OrderService, UserService){
    $scope.orders = OrderService;
    $rootScope.$on(AUTH_EVENTS.userReady, function(){
        OrderService.get();
    });

    $scope.add = function(order){
        order.openedBy = window.location.origin + "/users/" + UserService.current + "/";
        order.operatedBy = window.location.origin + "/users/" + UserService.current + "/";
        order.table = window.location.origin + "/tables/" + order.tableId + "/";
        order.tableId = order.tableId;
        
        OrderService.add(order);
    };

    $scope.setOrder = function(order){
        $rootScope.$broadcast(APP_EVENTS.orderSelected, order);
    };
});

app.controller('OrderItemsController', function($scope, $rootScope, APP_EVENTS, OrderItemService, ProductService, OrderService, UserService){
    $scope.currentOrder = void 0;
    $scope.currentOrderItems = [];
    $scope.hasNewOrderItems = false;
    $scope.noNewOrderItems = true;

    $scope.allOrderItems = OrderItemService;

    $scope.add = function(orderItem){
        orderItem.order = window.location.origin + "/orders/" + $scope.currentOrder.id + "/";
        orderItem.product = window.location.origin + "/products/" + orderItem.productId + "/";
        orderItem.addedBy = window.location.origin + "/users/" + UserService.current + "/";
        orderItem.orderId = $scope.currentOrder.id;

        $scope.hasNewOrderItems = true;
        $scope.noNewOrderItems = false;
        
        var lastOrderItem = $scope.currentOrderItems[$scope.currentOrderItems.length - 1];
        if(lastOrderItem && lastOrderItem.productId === parseInt(orderItem.productId) && !lastOrderItem.sent){
            lastOrderItem.quantity += orderItem.quantity;

            lastOrderItem.product = window.location.origin + "/products/" + lastOrderItem.productId + "/";

            OrderItemService.save(lastOrderItem);

            return ;
        }

        OrderItemService.add(orderItem);
    };

    $scope.sendNewOrderItems = function(){
        $scope.allOrderItems.list.forEach(function(item){
            if(!item.sent){
                item.sent = true;
                item.product = window.location.origin + "/products/" + item.productId + "/";
                OrderItemService.save(item);    
            }
        });

        $scope.hasNewOrderItems = false;
        $scope.noNewOrderItems = true;
    };

    $scope.close = function(order){
        if(!$scope.hasNewOrderItems){
            $scope.currentOrder.status = true;
            $scope.currentOrder.discount = order.discount;

            $scope.currentOrder.fis = order.fis;
            
            OrderService.save($scope.currentOrder);
        }
    };

    $scope.remove = function(item){
        if(item.sent){
            alert("Поръчката вече е изпратена.");
            return ;
        } 

        //TODO: Remove item
    };

    $scope.reduce = function(item){
        if(item.sent){
            alert("Поръчката вече е изпратена.");
            return ;
        } 

        if( item.quantity > 1 ){
            console.error("X");
            item.quantity--;

            item.product = window.location.origin + "/products/" + item.productId + "/";
            
            OrderItemService.save(item);
        }
    };

    $rootScope.$on(APP_EVENTS.ordersReady, function(){
        if(!$scope.currentOrder) return ;

        OrderService.list.forEach(function(item){
            if($scope.currentOrder.tableId === item.tableId){
                $scope.currentOrder = item; 
            }
        });
    });

    $rootScope.$on(APP_EVENTS.orderSelected, function(args, order){
        $scope.hasNewOrderItems = false;
        $scope.currentOrder = order;
        $scope.currentOrderItems = [];
        OrderItemService.get();
    });

    $rootScope.$on(APP_EVENTS.orderItemsReady, function(){
        $scope.currentOrderItems = [];
        $scope.allOrderItems.list.forEach(function(item){
            if(item.orderId === $scope.currentOrder.id){
                ProductService.list.forEach(function(p){
                    if(p.id === item.productId){
                        item.product = p;        
                    }
                });
                
                if(!item.sent){ 
                    $scope.hasNewOrderItems = true;
                    $scope.noNewOrderItems = false;
                }

                $scope.currentOrderItems.push(item);
            }
        });  
    });

    $rootScope.$on(APP_EVENTS.orderClosed, function(){
        $scope.currentOrder = void 0;
        $scope.currentOrderItems = [];
        $scope.hasNewOrderItems = false;
        $scope.noNewOrderItems = true;
    });

    $rootScope.$on(APP_EVENTS.productSelected, function(args, id){
        $scope.add({
            productId: id,
            quantity: 1
        });
    });
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

app.run(function ($rootScope, AUTH_EVENTS, AuthService, UserService, Session) {
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
        UserService.get();
    }
});