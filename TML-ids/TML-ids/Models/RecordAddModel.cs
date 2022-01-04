using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace TML_ids.Models
{
    public class RecordAddModel
    {
        
        [JsonProperty("sourceIp")]
        [Required]
        public string SourceIp { get; set; }
        
        [JsonProperty("destinationIp")]
        [Required]
        public string DestinationIp { get; set; }

        [JsonProperty("destinationPort")] 
        [Required]
        public string DestinationPort { get; set; }

        [JsonProperty("label")]
        [Required]
        public string Label { get; set; }
    }
}