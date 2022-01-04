let Connection = null;
let Data = [
];
function BuildConnection() {
    return new signalR.HubConnectionBuilder()
        .withUrl("/RecordsHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();
}

function startConnection()
{
    Connection.start()
        .then(() => console.log('connected!'))
        .catch(console.error);
    SetupTimeline();
}

function ReceiveRecord() {
    if (Connection) {
        console.log(Connection)
        Connection.on('ReceiveRecord', function (record)  {
            AddToTimeLine(record);
            if(Data.length > 0)
            {
                $("#noData").css("display", "none")
            }
        });
    }
}

function SetupTimeline()
{
    $("#Timeline").albeTimeline(Data);
    
}
function AddToTimeLine(record){
    let time = new Date(record.createdAt)
    let timeLineData = {
        time : record.createdAt,
        body: [{
            tag: 'h6',
            content: record.label + " Attack:"
        },
            {
                tag: 'p',
                content: "Source ip: " + record.sourceIp +
                    " | Destination ip: " + record.destinationIp + " | Destination port: "+ record.destinationPort
            },
            {
                tag: 'p',
                content: "Time :" + moment(time).format("MMM DD : HH:mm:ss")
            }

        ]
    }
    Data.push(timeLineData);
    $("#Timeline").albeTimeline(Data);
}

document.addEventListener("DOMContentLoaded", function () {
    Connection = BuildConnection();
    startConnection();
    ReceiveRecord();
});