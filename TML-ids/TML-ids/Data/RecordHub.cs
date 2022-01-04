using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TML_ids.Models;

namespace TML_ids.Data
{
    public class RecordHub: Hub
    {
        public async Task SendRecord(Record record)
        {
            await Clients.All.SendAsync("ReceiveRecord", record);
        }
    }
}