class Record(object):
    
    def __init__ (self, sourceIp, destinationIp,destinationPort,label):
        self.sourceIp = sourceIp
        self.destinationIp = destinationIp
        self.destinationPort = destinationPort
        self.label = label