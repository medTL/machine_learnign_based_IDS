using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using TML_ids.Data;
using TML_ids.Models;

namespace TML_ids.Controllers
{
    [Route("api/[controller]/[action]")]
    [EnableCors("idsPolicy")]
    [ApiController]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private readonly IRecordRepository _recordRepository;
        private readonly IHubContext<RecordHub> _hubContext;


        public HomeController(ILogger<HomeController> logger, IRecordRepository recordRepository, IHubContext<RecordHub> hubContext)
        {
            _logger = logger;
            _recordRepository = recordRepository;
            _hubContext = hubContext;

        }
        

        [HttpPost]
        public async Task<IActionResult> ListRecords([FromBody] RecordFilterModel model)
        {
            return Ok(new ServerResponse<IEnumerable<Record>>
            {
                Data = await _recordRepository.ListRecords(model),
                Message = "OK"
            });
        }
        
        [HttpPost]
        public async Task<IActionResult> AddRecord([FromBody] RecordAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return  BadRequest();
            }

            var record = await _recordRepository.AddRecord(new Record
            {
                Label = model.Label,
                SourceIp = model.SourceIp,
                DestinationIp = model.DestinationIp,
                DestinationPort = model.DestinationPort,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            });
            await _hubContext.Clients.All.SendAsync("ReceiveRecord", record);
            return Ok(new ServerResponse<string>
            {
                Data = record.Id.ToString(),
                Message = "OK"
            });
        }
        
        [HttpPost]
        public async Task<IActionResult> UpdateRecord(RecordUpdateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (await _recordRepository.GetRecord(model.Id) is var record && record == null)
            {
                return BadRequest(new ServerResponse<string>
                {
                    Data = null,
                    Message = "Record not found"
                });
            }

            var updateRecord =  await _recordRepository.UpdateRecord(model, record);
            return Ok(new ServerResponse<Record>
            {
                Data = updateRecord,
                Message = "OK"
            });

        }
        
        

        [HttpGet]
        public async Task<IActionResult> DeleteRecord([FromQuery(Name = "id")] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (await _recordRepository.GetRecord(id) is var record && record == null)
            {
                return NotFound(new  ServerResponse<string>
                {
                    Data = id.ToString(),
                    Message = "Record Not Found"
                });
            }

            await _recordRepository.DeleteRecord(record);
            return Ok(new ServerSimpleResponse
            {
                Message = "Record Deleted Successfully",
            });
        }
        
        [HttpGet]
        public async Task<IActionResult> ClearDatabase()
        {
            await _recordRepository.ClearRecords();
            return Ok(new ServerSimpleResponse
            {
                Message = "Database cleared !!"
            });
        }
        
        [HttpGet]
        public async Task<IActionResult> CountAsync()
        {
            return Ok(new ServerResponse<int>
            {
                Data = await _recordRepository.RecordsCount(),
                Message = "Records count"
            });
        }
    }
}