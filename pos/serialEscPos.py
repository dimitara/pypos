import serial,os

class serialEscPos:
    slip = False
    def __init__(self):
        if os.name == "nt":
            self.serial = serial.Serial("COM9",19200)
        else:
            self.serial = serial.Serial('/dev/ttyS0',19200) #bit cludgy but wth!
        self.serial.write("\x1B\x40")
    
    def printin(self,text):
        self.serial.write(text)

    def println(self,text):
        self.serial.write(text)
        self.serial.write("\n")

    def usingSlip(self):
        self.serial.flushInput()
        self.serial.write("\x10\x04\x05")
        reply = self.serial.read()
        if ord(reply) & 4 == 0:
            return True
        else:
            return False

    def slipAvailable(self):
        self.serial.flushInput()
        self.serial.write("\x10\x04\x05")
        reply = self.serial.read()
        if ord(reply) & 32 == 0:
            return True
        else:
            return False

    def slipDone(self): #waiting for removal
        self.serial.flushInput()
        self.serial.write("\x10\x04\x05")
        res = ord(self.serial.read())
        if (res & 50 == 50) and (res & 12 == 0): #mainly trial and error...
            return True
        else:
            return False

    def slipWaiting(self): #waiting for slip to be inserted
        self.serial.flushInput()
        self.serial.write("\x10\x04\x05")
        reply = self.serial.read()
        if ord(reply) & 8 == 8:
            return True
        else:
            return False

    def code39(self,instr):
        #if self.slip:
        #    self.serial.write("\x1Dh\x18")
        #else:
        self.serial.write("\x1Dh\x34")
        self.serial.write("\x1Dw2")
        self.serial.write("\x1DH2\x1Dk\x04*"+instr+"*")
    
    def cut(self):
        self.serial.write("\x1DVA0")
    
    def useSlip(self):
        self.serial.write("\x1B\x63\x30\x04")
        self.slip = True
        
    def ff(self):
        self.serial.write("\x0c")
        self.slip = False
        
    def useRoll(self):
        self.serial.write("\x1B\x63\x30\x01")
        self.slip = False
    
    def newslip(self): #convenience function really
        self.useRoll()
        self.useSlip()

    def doubleStrike(self,on=1):
        self.serial.write("\x1BG"+chr(on))

    def underline(self,on=1):
        self.serial.write("\x1B-"+chr(on))
    
    def left(self):
        self.serial.write("\x1Ba\x00")
    
    def centre(self):
        self.serial.write("\x1Ba\x01")
    
    def right(self):
        self.serial.write("\x1Ba\x02")
        
    def reallywide(self):
        self.serial.write("\x1D\x21\x70")
    def normalwide(self):
        self.serial.write("\x1D\x21\x00")