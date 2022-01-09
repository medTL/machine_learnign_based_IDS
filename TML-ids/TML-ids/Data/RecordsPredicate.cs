using System;
using System.Linq.Expressions;
using TML_ids.Models;

namespace TML_ids.Data
{
    public static class RecordsPredicate
    {

        public static Expression<Func<Record, bool>> RecordByFilter(RecordFilterModel filter)
        {
            var query = RecordTrueQuery;
            if (!string.IsNullOrWhiteSpace(filter.Attack))
            {
               query = query.And(record => record.Label.ToLower()
                   .Trim().Contains(filter.Attack.ToLower().Trim()));
            }

            if (filter.FromDate != null)
            {
                query = query.And(record => record.CreatedAt >= filter.FromDate);
            }
            if (filter.ToDate != null)
            {
                query = query.And(record => record.CreatedAt <= filter.ToDate);
            }

            return query;
        }
        public static Expression<Func<Record, bool>> RecordTrueQuery => PredicateBuilder.True<Record>();
    }
    
}