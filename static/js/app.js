app.factory('TableService', function ($http, Session, $q, $rootScope, APP_EVENTS, UserService) {
    var tableService = {};
    tableService.list = [];

    tableService.getById = function(id){
        for(var i=0; i<tableService.list.length; i++){
            if(tableService.list[i].id === id) return tableService.list[i];
        }
    }

    tableService.getByParentId = function(id){
        for(var i=0; i<tableService.list.length; i++){
            if(tableService.list[i].parentId === id) return tableService.list[i];
        }
    }

    tableService.get = function(){
        return $http.get('/tables/').then(function(response){
            tableService.list = response.data.results;
            if(UserService.current){
                $rootScope.$broadcast(APP_EVENTS.tablesReady);
            }   
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

app.factory('CategoryService', function ($http, Session, $q, $rootScope, APP_EVENTS) {
    var categoryService = {};
    categoryService.list = [];

    categoryService.get = function(){
        return $http.get('/categories/').then(function(response){
            categoryService.list = response.data.results;

            $rootScope.$broadcast(APP_EVENTS.categoryReady);
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

app.factory('OrderService', function ($http, Session, $rootScope, $q, APP_EVENTS, OrderItemService, UserService) {
    var orderService = {};
    orderService.all = [];
    orderService.list = [];

    function getById(id){
        for(var i=0; i<orderService.list.length; i++){
            if(orderService.list[i].id === id) return orderService.list[i]
        }

        return null;
    }

    function bindOrderItems(){
        orderService.all.forEach(function(o){
            o.orderItems = [];
            o.hasNewItems = false;
            o.total = 0;
            
            OrderItemService.list.forEach(function(oi){
                var d = new Date();
                if(oi.orderId === o.id && oi.quantity > 0){
                    o.orderItems.push(oi);
                    if(!oi.changed) oi.since = 0;
                    else oi.since = Math.round((d.getTime() - Date.parse(oi.changed)));
                    
                    o.total += oi.product.price*oi.quantity;
                    if(!oi.sent) o.hasNewItems = true;
                }
            });
        });
    }

    orderService.get = function(tableId){
        return $http.get('/orders/').then(function(response){
            orderService.list = response.data.results;
            orderService.all = response.data.results;

            bindOrderItems();
            if(UserService.current){
                orderService.list = orderService.list.filter(function(os){
                    return os.operatedById === UserService.current.id;
                });

                $rootScope.$broadcast(APP_EVENTS.ordersReady);

                if(tableId){
                    $rootScope.$broadcast(APP_EVENTS.orderSelected, orderService.getByTableId(tableId));
                }
            }
        });
    };

    orderService.save = function(order){
        order.openedBy = window.location.origin + "/users/" + UserService.current.id + "/";
        order.operatedBy = window.location.origin + "/users/" + UserService.current.id + "/";
        order.table = window.location.origin + "/tables/" + order.tableId + "/";
    
        return $http.put('/orders/' + order.id + '/', order).then(function(response){
            orderService.get();
            
            $rootScope.$broadcast(APP_EVENTS.orderUpdated);
            if(order.status) $rootScope.$broadcast(APP_EVENTS.orderPaid);
        });
    };

    orderService.add = function(order){
        order.openedBy = window.location.origin + "/users/" + UserService.current.id + "/";
        order.operatedBy = window.location.origin + "/users/" + UserService.current.id + "/";
        order.table = window.location.origin + "/tables/" + order.tableId + "/";

        return $http.post('/orders/', order).then(function(response){
            orderService.get(order.tableId);
        });
    };

    orderService.getByTableId = function(id){
        for(var i=0; i < orderService.all.length; i++){
            if(orderService.all[i].tableId === id){
                return orderService.all[i];
            }
        }
    };

    $rootScope.$on(APP_EVENTS.orderItemsReady, function(args, id){
        bindOrderItems();
    });

    return orderService;
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

    orderItemService.save = function(orderItem, skipOrderUpdate){
        orderItem.product = window.location.origin + "/products/" + orderItem.productId + "/";
        if(!orderItem.id){
            orderItemService.add(orderItem);  
            return ;
        } 

        return $http.put('/orderitem/' + orderItem.id + "/", orderItem).then(function(response){
            if(!skipOrderUpdate) orderItemService.get();
            
            $rootScope.$broadcast(APP_EVENTS.orderItemSaved, orderItem.orderId);
        });
    };

    orderItemService.add = function(orderItem){
        return $http.post('/orderitem/', orderItem).then(function(response){
            orderItemService.get();

            $rootScope.$broadcast(APP_EVENTS.orderItemSaved, orderItem.orderId);
        });
    };

    $rootScope.$on(APP_EVENTS.orderItemsReady, function(){
        orderItemService.list.forEach(function(oi){
            ProductService.list.forEach(function(p){
                if(p.id === oi.productId){
                    oi.product = p;        
                }
            });
        });
    });

    $rootScope.$on(APP_EVENTS.orderPaid, function(){
        orderItemService.list = [];
    });

    return orderItemService;
});

app.controller('TableController', function($scope, $rootScope, AUTH_EVENTS, APP_EVENTS, TableService, OrderService, UserService){
    $scope.showTables = false;
    $scope.tables = TableService;
    $scope.filteredTables = [];

    $scope.currentTable = void 0;

    $scope.selectTable = function(table){
        $scope.currentTable = table;
        var saveTable = !$scope.currentTable.taken;
        
        $scope.showTables = false;
        $scope.currentTable.taken = true;

        if(saveTable) TableService.save($scope.currentTable);

        $rootScope.$broadcast(APP_EVENTS.tableSelected, table.id);
    };

    $scope.toggleTables = function(skipCheck){
        if(!$scope.currentTable && !skipCheck) return ;
        $scope.currentTable = void 0;
        $scope.showTables = true;
        $rootScope.$broadcast(APP_EVENTS.openTables);
    }

    $scope.getClass = function(table){
        var className = (table.taken ? "taken" : "");
        
        var tables = OrderService.list.map(function(o){return o.tableId});

        if(tables.indexOf(table.id) < 0){
            className += " disabled";
        }

        className += $scope.currentTable === table.id ? " current" : "";
        return className;
    };

    function refreshTable(){
        $scope.filteredTables = [];

        for(var i=0; i<$scope.tables.list.length; i++){
            if(!$scope.tables.list[i].parent || $scope.tables.list[i].parent && $scope.tables.list[i].taken){
                $scope.filteredTables.push($scope.tables.list[i]);
            }
        }
    }

    $rootScope.$on(APP_EVENTS.createSubOrder, function(args, table){
        $scope.selectTable(table);

        refreshTable();
    });

    $rootScope.$broadcast(APP_EVENTS.tablesReady, function(){
        if(UserService.current) refreshTable();
    });

    $rootScope.$on(AUTH_EVENTS.userReady, function(){
        $scope.showTables = true;    

        $scope.user = UserService.current.name;

        refreshTable();
    });

    $rootScope.$on(AUTH_EVENTS.usersInit, function(args){
        TableService.get();
    });

    $rootScope.$on(APP_EVENTS.tableTaken, function(){
        $scope.showTables = true;
        alert("Съжелявам - тази маса е заета");
    });

    $rootScope.$on(APP_EVENTS.orderPaid, function(){
        $scope.showTables = true;
        TableService.get();
    });
});

app.controller('CategoryController', function($scope, $rootScope, AUTH_EVENTS, APP_EVENTS, CategoryService){
    $scope.categories = CategoryService;
    $scope.scroll = void 0;
    $scope.filter = function(category){
        $rootScope.$broadcast(APP_EVENTS.categoryChanged, category ? category.id : void 0);
    };
    $rootScope.$on(AUTH_EVENTS.usersInit, function(){
        CategoryService.get();
    });

    $rootScope.$on(AUTH_EVENTS.categoryReady, function(){
        setTimeout(function(){
            $scope.scroll = new IScroll("#category", {click: true});
        }, 1000);
    });
});

app.controller('ProductController', function($scope, $rootScope, AUTH_EVENTS, APP_EVENTS, ProductService){
    $scope.products = ProductService;
    $scope.filteredProducts = void 0;

    $scope.scroll = void 0;

    $scope.selectProduct = function(product){
        $rootScope.$broadcast(APP_EVENTS.productSelected, product);
    };

    $rootScope.$on(AUTH_EVENTS.usersInit, function(){
        ProductService.get();
    });

    $rootScope.$on(APP_EVENTS.productsReady, function(){
        $scope.filteredProducts = [];
        
        $scope.products.list.forEach(function(p){
            if(p.available){
                $scope.filteredProducts.push(p);
            }
        });

        setTimeout(function(){
            $scope.scroll = new IScroll("#products", {click: true});
        }, 1000);
    });

    $rootScope.$on(APP_EVENTS.categoryChanged, function(args, id){
        if(!id) $scope.filteredProducts = $scope.products.list;
        else{
            $scope.filteredProducts = [];
            $scope.products.list.forEach(function(p){
                if(p.categoryId === id && p.available) $scope.filteredProducts.push(p);
            });
        }

        if($scope.scroll){ setTimeout(function(){$scope.scroll.refresh();$scope.scroll.scrollTo(0, 0, 0);}, 200); }
    });
});

app.controller('OrderController', function($scope, $rootScope, AUTH_EVENTS, APP_EVENTS, OrderService, OrderItemService, TableService, UserService){
    $scope.currentOrder = void 0;
    
    $scope.showOrder = false;
    $scope.orders = OrderService;
    $rootScope.$on(AUTH_EVENTS.userReady, function(){
        OrderItemService.get();
        OrderService.get();
    });

    $scope.scroll = new IScroll("#order-items", {click: true});

    $scope.add = function(order){
        order.tableId = order.tableId;
        
        OrderService.add(order);
    };

    $scope.setOrder = function(order){
        $scope.currentOrder = order;
        
        $rootScope.$broadcast(APP_EVENTS.orderSelected, order);
    };

    $scope.sendNewOrderItems = function(){
        $rootScope.$broadcast(APP_EVENTS.sendOrder);
        $scope.currentOrder.hasNewItems = false;
    };

    $scope.pay = function(){
        if($scope.currentOrder.hasNewItems) return false;

        $rootScope.$broadcast(APP_EVENTS.payOrder, $scope.currentOrder);
    };

    $scope.getClass = function(button){
        if(!$scope.currentOrder) return "disabled";

        if(button === 'pay'){
            if($scope.currentOrder.hasNewItems) return "disabled";
        }

        if(button === 'sendTo'){
            if(!$scope.currentOrder.hasNewItems) return "disabled";
        }

        return "";
    };

    $scope.createSubOrder = function(order){
        var table = TableService.getByParentId(order.tableId);
        if(table) $rootScope.$broadcast(APP_EVENTS.createSubOrder, table);
    };

    $rootScope.$on(APP_EVENTS.openTables, function(){
        $scope.showOrder = false;
        $scope.currentOrder = void 0;
    });

    $rootScope.$on(APP_EVENTS.orderSelected, function(args, order){
        $scope.showOrder = true;
        $scope.currentOrder = order;

        $scope.currentOrder.table = TableService.getById($scope.currentOrder.tableId);
    });

    $rootScope.$on(APP_EVENTS.orderUpdated, function(){
        $scope.currentOrder.table = TableService.getById($scope.currentOrder.tableId);
    });

    $rootScope.$on(APP_EVENTS.tableSelected, function(args, id){
        var order = OrderService.getByTableId(id);
        if(order){
            if(order.operatedById === UserService.current.id){
                $scope.setOrder(order);
            }
            else{
                $rootScope.$broadcast(APP_EVENTS.tableTaken, id);
            }

            return ;
        }

        var order = {};
        order.openedBy = window.location.origin + "/users/" + UserService.current.id + "/";
        order.operatedBy = window.location.origin + "/users/" + UserService.current.id + "/";
        order.table = window.location.origin + "/tables/" + id + "/";
        order.tableId = id;

        OrderService.add(order);
    });

    $rootScope.$on(APP_EVENTS.orderPaid, function(){
        $scope.showOrder = false;    
        $scope.currentOrder = void 0;
    });
});

app.controller('OrderItemController', function($scope, $rootScope, APP_EVENTS, OrderItemService, ProductService, OrderService, UserService){
    $scope.currentOrder = void 0;
    
    $scope.hasNewOrderItems = false;
    $scope.noNewOrderItems = true;

    $scope.allOrderItems = OrderItemService;

    $scope.newItems = [];

    $scope.add = function(orderItem){
        if(!$scope.currentOrder) return ;

        var lastOrderItem = $scope.currentOrder.orderItems.filter(function(oi){
            return oi.sent === false && oi.productId === orderItem.productId;
        });

        if(lastOrderItem && lastOrderItem.length > 0){
            lastOrderItem = lastOrderItem[0];
            lastOrderItem.quantity++;
        }
        else{
            orderItem.order = window.location.origin + "/orders/" + $scope.currentOrder.id + "/";
            orderItem.product = window.location.origin + "/products/" + orderItem.productId + "/";
            orderItem.addedBy = window.location.origin + "/users/" + UserService.current.id + "/";
            orderItem.orderId = $scope.currentOrder.id;
            orderItem.sent = false;
            orderItem.entered = Date.now();
            orderItem.changed = new Date();
            var d = new Date();
            orderItem.since = (d.getTime() - orderItem.entered);
            
            $scope.currentOrder.orderItems.forEach(function(oi){
                if(oi.entered){
                    oi.since = (d.getTime() - oi.entered);
                    if(isNaN(oi.since)) oi.since = 1000000000;
                }
            });

            $scope.newItems.push(orderItem);
            $scope.currentOrder.orderItems.push(orderItem);
        }

        $scope.hasNewOrderItems = true;
        $scope.noNewOrderItems = false;
        $scope.currentOrder.hasNewItems = true;

        setTimeout(function(){$scope.scroll.refresh();$scope.scroll.scrollTo(0, 0, 0);}, 300);
        /*
        var lastOrderItem = $scope.currentOrder.orderItems.filter(function(oi){
            return oi.sent === false && oi.productId === orderItem.productId;
        });

        if(lastOrderItem && lastOrderItem.length > 0) lastOrderItem = lastOrderItem[0];
        
        if(lastOrderItem && lastOrderItem.productId === parseInt(orderItem.productId) && !lastOrderItem.sent){
            lastOrderItem.quantity += orderItem.quantity;

            lastOrderItem.product = window.location.origin + "/products/" + lastOrderItem.productId + "/";

            OrderItemService.save(lastOrderItem);

            return ;
        }
        */

        //OrderItemService.add(orderItem);
    };

    $scope.remove = function(item){
        if(item.sent){
            alert("Поръчката вече е изпратена.");
            return ;
        } 

        //TODO: Remove item
    };

    $scope.reduce = function(item){
        var result = confirm("Да намалим ли бройката с 1?");
        if(result){
            if( item.quantity > 0 ){
                item.quantity--;

                if(item.id) OrderItemService.save(item);
                else {
                
                }
            }
        }
    };

    $scope.putComment = function(item){
        $rootScope.$broadcast(APP_EVENTS.comment, item);
    };

    $scope.getClass = function(item){
        var className = "";
        if(!item.sent) className = "red";

        if(item.selected) className += " selected";

        return className;
    };

    $scope.selectItem = function(item){
        /*
        for(var i=0; i<$scope.currentOrder.orderItems.length;i++){
            if($scope.currentOrder.orderItems[i].selected){
                $scope.currentOrder.orderItems[i].selected = false; 
            }
        }

        item.selected = true;
        */
    }

    $rootScope.$on(APP_EVENTS.commented, function(args, item){
        if(item && !item.sent){
            OrderItemService.save(item);
        }
    });

    $rootScope.$on(APP_EVENTS.sendOrder, function(){
        $scope.currentOrder.orderItems.forEach(function(item, i){
            if(!item.sent){
                item.sent = true;
                if(i === $scope.allOrderItems.list.length - 1){
                    OrderItemService.save(item);  
                } 
                else{
                    OrderItemService.save(item, true);
                }
            }
        });

        $scope.hasNewOrderItems = false;
        $scope.noNewOrderItems = true;
    });

    $rootScope.$on(APP_EVENTS.openTables, function(){
        $scope.currentOrder = void 0;
    });

    $rootScope.$on(APP_EVENTS.ordersReady, function(){
        if(!$scope.currentOrder) return ;

        OrderService.list.forEach(function(item){
            if($scope.currentOrder.tableId === item.tableId){
                $scope.currentOrder = item; 

                setTimeout(function(){$scope.scroll.refresh();$scope.scroll.scrollTo(0, 0, 0);}, 300);
            }
        });
    });

    $rootScope.$on(APP_EVENTS.orderSelected, function(args, order){
        $scope.hasNewOrderItems = false;
        $scope.currentOrder = order;

        setTimeout(function(){$scope.scroll.refresh();$scope.scroll.scrollTo(0, 0, 0);}, 300);
    });

    $rootScope.$on(APP_EVENTS.orderClosed, function(){
        $scope.currentOrder = void 0;
    
        $scope.hasNewOrderItems = false;
        $scope.noNewOrderItems = true;
    });

    $rootScope.$on(APP_EVENTS.orderItemsReady, function(){
        setTimeout(function(){$scope.scroll.refresh();$scope.scroll.scrollTo(0, 0, 0);}, 300);
    });

    $rootScope.$on(APP_EVENTS.productSelected, function(args, product){
        $scope.add({
            productName: product.name,
            productPrice: product.price,
            productId: product.id,
            quantity: 1
        });
    });
});

app.controller('PopupController', function($scope, $rootScope, Session, AUTH_EVENTS, APP_EVENTS, AuthService, UserService, OrderService, OrderItemService){
    $scope.showPopup = true;
    $scope.orderSent = false;
    $scope.orderClosed = false;
    $scope.settingsOpened = false;
    $scope.pinRequested = true;
    $scope.itemComment = false;
    $scope.comment = {text: ""};

    $scope.back = function(){
        $scope.showPopup = false;
    };

    $scope.payOrder = function(details){
        $scope.currentOrder.total = 0;
        if(details.discount) $scope.currentOrder.discount = details.discount;
        $scope.currentOrder.status = true;
        $scope.currentOrder.fis = $scope.details.f;

        OrderService.save($scope.currentOrder);

        details.discount = "";
    };

    $scope.discount = function(details){
        if(details.discount <= 0) return ;
        $scope.currentOrder.d_total = $scope.currentOrder.total - $scope.currentOrder.total * (details.discount/100);
    };
    $scope.pin = function (credentials) {
        if(UserService.set(credentials.pin)){
            $scope.showPopup = false;
            $scope.pinRequested = false;
            $rootScope.$broadcast(AUTH_EVENTS.userReady);
        }
    };

    $scope.putComment = function (comment) {
        if(!comment){
            $scope.showPopup = false;
            $scope.itemComment = false;

            $scope.currentItem = void 0;
        }

        $scope.currentItem.comment = comment.text;

        $scope.showPopup = false;
        $scope.itemComment = false;

        $rootScope.$broadcast(APP_EVENTS.commented, $scope.currentItem);
        
        $scope.currentItem = void 0;
    };

    $scope.cancelComment = function(){
        $scope.showPopup = false;
        $scope.itemComment = false;

        $scope.currentItem = void 0;
    };

    $rootScope.$on(APP_EVENTS.payOrder, function(args, order){
        $scope.showPopup = true;
        $scope.orderClosed = true;

        $scope.currentOrder = order;
        $scope.currentOrder.d_total = $scope.currentOrder.total;
    });

    $rootScope.$on(APP_EVENTS.orderPaid, function(args){
        $scope.showPopup = false;
        $scope.orderClosed = false;

        $scope.currentOrder = void 0;
    });

    $rootScope.$on(APP_EVENTS.sendOrder, function(){
        //$scope.showPopup = true;
    });

    $rootScope.$on(APP_EVENTS.comment, function(args, item){
        $scope.showPopup = true;
        $scope.itemComment = true;
        $scope.comment = item.comment;
        $scope.currentItem = item;
    });
});