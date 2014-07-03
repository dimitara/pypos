from django.contrib.auth.models import User, Group
from pos.models import Table, Product, Category, Employee, Order, OrderItem

from rest_framework import serializers


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    name = serializers.Field()
    username = serializers.Field()
    userId = serializers.Field()

    class Meta:
        model = Employee
        fields = ('id', 'username', 'pin', 'name', 'userId')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'url', 'name')

class TableSerializer(serializers.HyperlinkedModelSerializer):
    parentId = serializers.Field()

    class Meta:
        model = Table
        fields = ('id', 'number', 'nickname', 'taken', 'parent', 'booked', 'parentId')

class ProductSerializer(serializers.HyperlinkedModelSerializer):
    categoryId = serializers.Field()
    categoryNeatName = serializers.Field()

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'categoryId', 'price', 'availability', 'availabilityUpdated', 'order', 'categoryNeatName', 'available')

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    tableId = serializers.Field()
    operatedById = serializers.Field()

    class Meta:
        model = Order
        fields = ('id', 'tableId', 'table', 'total', 'discount', 'discountReason', 'notes', 'status', 'openedBy', 'operatedById', 'fis')

class OrderItemSerializer(serializers.HyperlinkedModelSerializer):
    orderId = serializers.Field()
    productId = serializers.Field()
    productName = serializers.Field()
    productDesc = serializers.Field()
    productPrice = serializers.Field()
    tableName = serializers.Field()
    categoryType = serializers.Field()
    categoryNeatName = serializers.Field()
    waiter = serializers.Field()

    class Meta:
        model = OrderItem
        fields = ('id', 'orderId', 'order', 'productId', 'productName', 'productPrice', 'product', 'quantity', 'changed', 'wasted', 'wastedReason', 'addedBy', 'sent', 'tableName', 'categoryType', 'categoryNeatName', 'waiter', 'cooked', 'comment', 'entered', 'productDesc', 'reduced')


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'neatName', 'order')