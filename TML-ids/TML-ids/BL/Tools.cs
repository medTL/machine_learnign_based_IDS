using System;

namespace TML_ids.BL
{
    public static class Tools
    {
        public static string GetExtension(string file)
        {
            if (string.IsNullOrWhiteSpace(file))
            {
                return "";
            }

            var arr = file.Split(".");
            return arr[^1];
        }
        
        public static string GetEnvString(string key)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable(key)))
                {
                    DotNetEnv.Env.Load();
                    return DotNetEnv.Env.GetString(key);
                }

                return Environment.GetEnvironmentVariable(key);
            }
            catch (Exception e)
            {
                Console.WriteLine("===================ENV ERROR====================");
                Console.WriteLine(e);
                Console.WriteLine("================================================");
                return string.Empty;
            }
        }
        
    }
}