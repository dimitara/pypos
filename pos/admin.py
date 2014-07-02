from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from pos.models import Employee
from pos.models import Table
from pos.models import Category
from pos.models import CategoryType
from pos.models import Product
from pos.models import Order
from pos.models import OrderItem

class TableAdmin(admin.ModelAdmin):
    list_display = ('__unicode__',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

class CategoryTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name','category', 'price',)


class OrderAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'openedBy', 'total','discount','closed', 'reported')

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('addedBy','product','quantity','tableName','changed',)

# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class EmployeeInline(admin.StackedInline):
    model = Employee
    can_delete = False
    verbose_name_plural = 'employee'

# Define a new User admin
class UserAdmin(UserAdmin):
    inlines = (EmployeeInline, )

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

admin.site.register(Table, TableAdmin)
admin.site.register(CategoryType, CategoryTypeAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
