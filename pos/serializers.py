from django.contrib.auth.models import User, Group
from pos.models import Table, Product, Category, Employee, Order, OrderItem

from rest_framework import serializers


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.Field()
    
    class Meta:
        model = Employee
        fields = ('id', 'username', 'pin')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'url', 'name')

class TableSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Table
        fields = ('id', 'number', 'nickname', 'taken', 'parent', 'booked')

class ProductSerializer(serializers.HyperlinkedModelSerializer):
    categoryId = serializers.Field()
    categoryNeatName = serializers.Field()

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'categoryId', 'price', 'availability', 'availabilityUpdated', 'order', 'categoryNeatName')

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

    class Meta:
        model = OrderItem
        fields = ('id', 'orderId', 'order', 'productId', 'productName', 'product', 'quantity', 'changed', 'wasted', 'wastedReason', 'addedBy', 'sent')


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'neatName', 'order')