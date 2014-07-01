# -*- coding: utf-8 -*- 
from serialEscPos import serialEscPos

ser = serialEscPos()

def printReport(waiter, total):
    ser.doubleStrike(1)

    ser.underline(1)

    ser.centre()

    ser.println(u'ОТЧЕТ'.encode('cp866', 'ignore'))

    ser.println("")

    ser.println(waiter.encode('cp866', 'ignore'))

    ser.centre()

    ser.underline(0)

    ser.println("")
    ser.println(str("{0:.2f}".format(total)) + u' лв.'.encode('cp866', 'ignore'))

    ser.println("")

    ser.println("")

    ser.println("")
    
    ser.println("")

    ser.cut();

def printOrder(order, orderItems):

    ser.doubleStrike(1)

    ser.underline(1)

    ser.centre()

    ser.println(u'БОЦМАНА - СКАРА БАР'.encode('cp866', 'ignore'))

    ser.centre()

    ser.underline(0)

    ser.println("")
    ser.println(u'ПОРЪЧКА'.encode('cp866', 'ignore'))

    ser.println("")

    ser.println("")

    ser.left()

    for i in orderItems:
        if i.quantity > 0:
            length = len(i.productName)
            ser.printin(unicode(i.productName.upper().ljust(30, ' ')).encode('cp866', 'ignore'))
        
            ser.printin(unicode(str(i.quantity)).encode('cp866', 'ignore'))
            ser.printin(unicode(u' x ').encode('cp866', 'ignore'))
            ser.printin(unicode(str(i.productPrice)).encode('cp866', 'ignore'))
            ser.printin(u'лв.'.encode('cp866', 'ignore'));
            ser.println("")

    ser.println("")
    ser.println("")
    ser.println("---------------------------------------")
    ser.println("")

    ser.println(u'ОБЩО  '.ljust(30, ' ').encode('cp866', 'ignore') + unicode(str("{0:.2f}".format(order.total))).encode('cp866', 'ignore') + u' лв.'.encode('cp866', 'ignore'))

    ser.println("")
    ser.println("")

    ser.cut();

def printTest():
    ser.doubleStrike(1)

    ser.underline(1)

    ser.centre()

    ser.println(unicode("Test").encode('ascii', 'ignore'))

    ser.left()

    ser.underline(0)

    ser.println("Това е тест")

    ser.println("")

    ser.println("")
    ser.println("")

    ser.cut();