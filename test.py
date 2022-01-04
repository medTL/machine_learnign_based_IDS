
import requests
import json
from RecordModel import Record
def SendRecord(data):
    print(data.sourceIp)
    print(data.destinationIp)
    url = "http://localhost:2500/Home/AddRecord"
    print(vars(data))
    headers = {'Content-type': 'application/json'}
    payload = vars(data)
    response = requests.post(url, data = json.dumps(payload), timeout= 10, headers = headers)
    print(response.text)
    print(response.status_code)
    return response

p = Record(sourceIp = "192.168.1.8", destinationIp = "192.168.1.6", destinationPort = "80", label = "Dos")
SendRecord(p)