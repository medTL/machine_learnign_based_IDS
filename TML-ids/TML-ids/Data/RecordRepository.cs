using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TML_ids.Models;

namespace TML_ids.Data
{
    public class RecordRepository : IRecordRepository
    {
        private readonly RecordContext _context;

        public RecordRepository(RecordContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Record>> ListRecords(RecordFilterModel model)
        {
            return await _context.Records.OrderByDescending(m => m.CreatedAt)
                .Skip(model.Start)
                .Take(model.PerPage)
                .Where(RecordsPredicate.RecordByFilter(model)).ToListAsync();
        }

        public Task<Record> GetRecord(Guid id)
        {
            return _context.Records.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Record> AddRecord(Record record)
        {
            await _context.Records.AddAsync(record);
            await _context.SaveChangesAsync();
            return record;
        }

        public async Task<Record> UpdateRecord(RecordUpdateModel model, Record record)
        {
            record.Label = model.Label;
            record.DestinationIp = model.DestinationIp;
            record.DestinationPort = model.DestinationPort;
            record.SourceIp = model.DestinationIp;
            record.CreatedAt = DateTime.Now;
            record.UpdatedAt = DateTime.Now;
            _context.Records.Update(record);
            await _context.SaveChangesAsync();
            return record;
        }

        public Task DeleteRecord(Record record)
        {
            _context.Records.Remove(record);
            return _context.SaveChangesAsync();
        }

        public Task ClearRecords()
        {
            var records = from c in _context.Records select c;
            _context.Records.RemoveRange(records);
            return _context.SaveChangesAsync();
        }

        public Task<int> RecordsCount()
        {
            return _context.Records.CountAsync();
        }
    }
}