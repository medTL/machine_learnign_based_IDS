import csv
import time
import traceback
import pickle
from scapy.layers.inet import TCP
from scapy.sendrecv import sniff
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import requests
from RecordModel import Record
import json
from flow.Flow import Flow
from flow.PacketInfo import PacketInfo
from dotenv import load_dotenv
load_dotenv()
import os
URL = os.environ.get("base-url")

import warnings
warnings.filterwarnings("ignore")

f = open("output_logs.csv", 'w')
w = csv.writer(f)

current_flows = {}
FlowTimeout = 600
global normalisation
global classifier
record = None

def classify(features):

    # preprocess
    f = features
    features = [np.nan if x in [np.inf, -np.inf] else float(x) for x in features]

    if np.nan in features:
        return

    features = normalisation.transform([features])
    result = classifier.predict(features)

    feature_string = [str(i) for i in f]
    classification = [str(result[0])]
   # print(feature_string + classification)
    if result != 'Benign':
        print(" Detected "+ result +" attack from :["+ record.src+"]")
        newRecord = Record(sourceIp = record.src,
                        destinationIp = record.dest,
                        destinationPort = str(record.dest_port),
                        label = result[0])
        SendRecord(newRecord)
        time.sleep(1)
       

    w.writerow(feature_string + classification)

    return feature_string + classification
def newPacket(p):
    try:
        packet = PacketInfo()
        packet.setDest(p)
        packet.setSrc(p)
        packet.setSrcPort(p)
        packet.setDestPort(p)
        packet.setProtocol(p)
        packet.setTimestamp(p)
        packet.setPSHFlag(p)
        packet.setFINFlag(p)
        packet.setSYNFlag(p)
        packet.setACKFlag(p)
        packet.setURGFlag(p)
        packet.setRSTFlag(p)
        packet.setPayloadBytes(p)
        packet.setHeaderBytes(p)
        packet.setPacketSize(p)
        packet.setWinBytes(p)
        packet.setFwdID()
        packet.setBwdID()

        #print(p[TCP].flags, packet.getFINFlag(), packet.getSYNFlag(), packet.getPSHFlag(), packet.getACKFlag(),packet.getURGFlag() )
     
    
        if packet.getFwdID() in current_flows.keys():
            flow = current_flows[packet.getFwdID()]

            # check for timeout
            # for some reason they only do it if packet count > 1
            if (packet.getTimestamp() - flow.getFlowStartTime()) > FlowTimeout:
                classify(flow.terminated())
                del current_flows[packet.getFwdID()]
                flow = Flow(packet)
                current_flows[packet.getFwdID()] = flow

            # check for fin flag
            elif packet.getFINFlag() or packet.getRSTFlag():
                flow.new(packet, 'fwd')
                classify(flow.terminated())
                del current_flows[packet.getFwdID()]
                del flow

            else:
                flow.new(packet, 'fwd')
                current_flows[packet.getFwdID()] = flow

        elif packet.getBwdID() in current_flows.keys():
            flow = current_flows[packet.getBwdID()]

            # check for timeout
            if (packet.getTimestamp() - flow.getFlowStartTime()) > FlowTimeout:
                #classify(flow.terminated())
                del current_flows[packet.getBwdID()]
                del flow
                flow = Flow(packet)
                current_flows[packet.getFwdID()] = flow

            elif packet.getFINFlag() or packet.getRSTFlag():
                flow.new(packet, 'bwd')
                #classify(flow.terminated())
                del current_flows[packet.getBwdID()]
                del flow
            else:
                flow.new(packet, 'bwd')
                current_flows[packet.getBwdID()] = flow
        else:

            flow = Flow(packet)
            global record
            record = packet
            current_flows[packet.getFwdID()] = flow
            # current flows put id, (new) flow

    except AttributeError:
        # not IP or TCP
        return

    except:
        traceback.print_exc()


def live(interface):

    print("Begin Sniffing On interface "+ interface + " ".center(20, ' '))
    sniff(iface=interface, prn=newPacket, store=0)
    for f in current_flows.values():
        classify(f.terminated())
        
def SendRecord(data):
    if data.label == "SSH-Patator" or data.label == "FTP-Patator" :
        data.label = "Brute Force"
    url = URL + "/api/Home/AddRecord"
    headers = {'Content-type': 'application/json'}
    payload = vars(data)
    print(payload)
    response = requests.post(url, data = json.dumps(payload), timeout= 10, headers = headers)
    print(response.text)
    print(response.status_code)
    


def main(interface):
    global normalisation, classifier
    with open('minmaxscaler.pkl', 'rb') as f:
        min_max_scaler = pickle.load(f)
    normalisation = min_max_scaler
    classifier = RandomForestClassifier()
    with open('model.pkl', 'rb') as f:
        classifier = pickle.load(f)
    print(" Sniffing ".center(20, '*'))
    live(interface)



if __name__ == '__main__':
    main()
    f.close()



