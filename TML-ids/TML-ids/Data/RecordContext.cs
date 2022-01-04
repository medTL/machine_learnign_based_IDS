using Microsoft.EntityFrameworkCore;
using TML_ids.Models;

namespace TML_ids.Data
{
    public class RecordContext: DbContext
    {
        public RecordContext(DbContextOptions<RecordContext> opt):base(opt)
        {
            
        }

        public DbSet<Record> Records { get; set;}

    }
}