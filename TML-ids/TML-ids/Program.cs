using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace TML_ids
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder
                        .ConfigureLogging((ctx, builder) =>
                        {
                            builder.AddConfiguration(ctx.Configuration.GetSection("Logging"));
                            builder.AddFile(o => o.RootPath = ctx.HostingEnvironment.ContentRootPath);
                        })
                    .UseStartup<Startup>(); 
                    webBuilder.UseUrls("http://0.0.0.0:2500");
                });
        
    }
}