from django.contrib.auth.models import User, Group
from pos.models import Table, Product, Category, Employee, Order, OrderItem

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework import viewsets
from pos.serializers import EmployeeSerializer, UserSerializer, GroupSerializer, TableSerializer, ProductSerializer, CategorySerializer, OrderSerializer, OrderItemSerializer

from django.shortcuts import render
from django.http import HttpResponse

"""
class AuthView(APIView):
    authentication_classes = (QuietBasicAuthentication,)
 
    def post(self, request, *args, **kwargs):
        login(request, request.user)
        return Response(UserSerializer(request.user).data)
 
    def delete(self, request, *args, **kwargs):
        logout(request)
        return Response({})
"""
class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class TableViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows products to be viewed or edited.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows products to be viewed or edited.
    """
    queryset = Order.objects.filter(status=False)
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows products to be viewed or edited.
    """
    queryset = OrderItem.objects.filter(order__status=False)
    serializer_class = OrderItemSerializer

def pos(request):
    return render(request, 'pos/index.html')

def test_app(request):
    return render(request, 'pos/login.html')

def auth(request):
    return render(request, 'pos/auth.html')

def pos_op(request):
    return render(request, 'pos/pos_op.html')

def kitchen(request):
    return render(request, 'pos/kitchen.html')