# -*- coding: utf-8 -*- 
from datetime import datetime

from django.conf import settings
from django.db import models
from django.contrib.auth.models import User

class Employee(models.Model):
    user = models.OneToOneField(User)
    pin = models.CharField(max_length=10, unique=True)
    #role = models.

    def _username(self):
        return self.user.username
    username = property(_username)

class Table(models.Model):
    number = models.IntegerField()
    nickname = models.CharField(max_length=100, blank=True, null=True)
    taken = models.BooleanField(default=False)
    parent = models.ForeignKey("Table", blank=True, null=True)
    booked = models.DateField(blank=True, null=True)

    def __unicode__(self):
        return Table._meta.verbose_name + " " + str(self.number)

    class Meta:
        verbose_name = u'Маса'
        verbose_name_plural = u'Маси'

class Category(models.Model):
    name = models.CharField(max_length=500)
    neatName = models.CharField(max_length=100)
    order = models.IntegerField()

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u'Категория'
        verbose_name_plural = u'Категории'


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500, blank=True, null=True)
    category = models.ForeignKey(Category)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    availability = models.IntegerField(default=0)
    availabilityUpdated = models.DateField(blank=True, null=True)
    order = models.IntegerField()

    def _categoryNeatName(self):
        return self.category.neatName
    categoryNeatName = property(_categoryNeatName)

    def _categoryId(self):
        return self.category.id
    categoryId = property(_categoryId)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u'Продукт'
        verbose_name_plural = u'Продукти'

class Order(models.Model):
    table = models.ForeignKey(Table)
    total = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    discount = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    discountReason = models.CharField(max_length=500, blank=True, null=True)
    notes = models.CharField(max_length=500, blank=True, null=True)
    
    started = models.DateTimeField(auto_now=True)
    closed = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField()
    fis = models.BooleanField(default=False)
    reported = models.BooleanField(default=False)


    openedBy = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='openedBy')
    closedBy = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='closedBy', blank=True, null=True)
    operatedBy = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='operatedBy')

    def _tableId(self):
        return self.table.id
    tableId = property(_tableId)

    def _operatedBy(self):
        return self.operatedBy.id
    operatedById = property(_operatedBy)

    def save(self, *args, **kwargs):
        self.operatedBy = self.openedBy

        if self.id:
            orderItems = OrderItem.objects.filter(order__id=self.id)
            
            self.total = 0
            for oi in orderItems:
                self.total += oi.quantity*oi.product.price

            if self.discount > 0:
                self.total -= self.total*(self.discount/100)

            if self.status:
                self.table.taken = False
                self.table.save()
                self.closed = datetime.now()


        super(Order, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.table.nickname + " / " + datetime.strftime(self.started, "%Y-%m-%d %H:%M")

    class Meta:
        verbose_name = u'Поръчка'
        verbose_name_plural = u'Поръчки'

class OrderItem(models.Model):
    order = models.ForeignKey(Order)
    product = models.ForeignKey(Product)
    quantity = models.PositiveIntegerField(default=1)
    entered = models.DateTimeField(auto_now=True)
    #processed = models.DateTimeField(blank=True, null=True)
    changed = models.DateTimeField(blank=True, null=True)
    wasted = models.BooleanField(default=False)
    wastedReason = models.CharField(max_length=500, blank=True, null=True)
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='addedBy', blank=True, null=True)
    wastedBy = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='wastedBy', blank=True, null=True)
    sent = models.BooleanField(default=False)
    comment = models.CharField(max_length=500, blank=True, null=True)
    cooked = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.sent and not self.changed:
            self.changed = datetime.now()
        #self.operatedBy = self.openedBy
        super(OrderItem, self).save(*args, **kwargs)

    def _orderId(self):
        return self.order.id
    orderId = property(_orderId)

    def _productId(self):
        return self.product.id
    productId = property(_productId)

    def _productName(self):
        return self.product.name
    productName = property(_productName)

    def __unicode__(self):
        retVal = self.order.table.nickname + " / " + self.product.name
        if(self.changed):
            retVal += " / " + datetime.strftime(self.changed, "%Y-%m-%d %H:%M")
            return retVal
        
        return retVal + u" / не е обработена"

    class Meta:
        verbose_name = u'Продажба'
        verbose_name_plural = u'Продажби'