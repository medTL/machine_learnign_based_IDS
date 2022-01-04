using System;
using Newtonsoft.Json;

namespace TML_ids.Models
{
    public class RecordUpdateModel
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }
        
        [JsonProperty("sourceIp")]
        public string SourceIp { get; set; }
        
        [JsonProperty("destinationIp")]
        public string DestinationIp { get; set; }
        
        [JsonProperty("destinationPort")]
        public string DestinationPort { get; set; }
        
        [JsonProperty("label")]
        public string Label { get; set; }
    }
}