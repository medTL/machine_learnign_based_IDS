using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TML_ids.Models;

namespace TML_ids.Data
{
    public interface IRecordRepository
    {
        Task<IEnumerable<Record>> ListRecords(RecordFilterModel model);

        Task<Record> GetRecord(Guid id);

        Task<Record> AddRecord(Record record);
        
        Task<Record> UpdateRecord(RecordUpdateModel model,Record record);

        Task DeleteRecord(Record record);
        
        Task ClearRecords();
    }
}