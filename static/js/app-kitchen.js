app.factory('TableService', function ($http, Session, $q) {
    var tableService = {};
    tableService.list = [];

    tableService.getById = function(id){
        for(var i=0; i<tableService.list.length; i++){
            if(tableService.list[i].id === id) return tableService.list[i];
        }
    }

    tableService.get = function(){
        return $http.get('/tables/').then(function(response){
            tableService.list = response.data.results;
        });
    };

    tableService.save = function(table){
        return $http.put('/tables/' + table.id + '/', table).then(function(response){
        });
    };

    tableService.add = function(parentTable){
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

app.factory('ProductService', function ($http, Session, $rootScope, $q, APP_EVENTS) {
    var productService = {};
    productService.list = [];

    productService.get = function(){
        return $http.get('/products/').then(function(response){
            productService.list = response.data.results;

            $rootScope.$broadcast(APP_EVENTS.productsReady);
        });
    };

    return productService;
});

app.factory('OrderItemService', function ($http, $rootScope, Session, $q, APP_EVENTS, ProductService) {
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
        });
    };

    return orderItemService;
});

app.controller('OrderItemController', function($scope, $rootScope, AUTH_EVENTS, APP_EVENTS, OrderItemService, ProductService, UserService){
    $scope.allOrderItems = OrderItemService;
    $scope.orderItems = [];
    var d = new Date();
    var minutes = d.getMinutes().toString();
    minutes = minutes.length === 1 ? "0" + minutes : minutes;

    $scope.now = d.getHours() + ":" + minutes;

    $scope.remove = function(item){
        item.cooked = true;
        OrderItemService.save(item);

        for(var i=0; i<$scope.orderItems.length; i++){
            if($scope.orderItems[i].id === item.id){
                $scope.orderItems.splice(i, 1); 
                break;
            } 
        }
    };

    $scope.getClass = function(item){
        var cls = item.categoryNeatName;
        if(item.reduced > 0){
            cls += " reduced";
        }

        return cls;
    };

    $scope.getReduced = function(item){
        if(item.reduced > 0){
            return item.reduced + " / "
        }

        return "";
    };

    $rootScope.$on(AUTH_EVENTS.usersInit, function(){
        ProductService.get();
        OrderItemService.get();
    });

    $rootScope.$on(APP_EVENTS.orderItemsReady, function(){
        $scope.orderItems = [];

        $scope.allOrderItems.list.forEach(function(item){
            if(item.quantity > 0 && item.sent && filter.indexOf(item.categoryType) > -1 && !item.cooked){
                item.since = Math.round((d.getTime() - Date.parse(item.changed))/(1000*60));
                var changed = new Date(item.changed);
                
                var minutes = changed.getMinutes();
                minutes = minutes.length === 1 ? "0" + minutes : minutes;
                item.last = changed.getHours() + ":" + minutes;
                $scope.orderItems.push(item);  
            } 
        });
    });
});
