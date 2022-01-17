using System;
using Newtonsoft.Json;

namespace TML_ids.Models
{
    public class RecordFilterModel
    {
        [JsonProperty("start")]
        public int Start { get; set; }
        
        [JsonProperty("perPage")]
        public int PerPage { get; set; }
        
        [JsonProperty("fromDate")]
        public DateTime? FromDate { get; set; }
        
        [JsonProperty("toDate")]
        public DateTime? ToDate { get; set; }
        
        [JsonProperty("attack")]
        public string Attack { get; set; }
    }
}