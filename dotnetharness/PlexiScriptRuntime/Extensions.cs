using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlexiScriptRuntime
{
    internal class Extensions
    {
        public Dictionary<string, Func<object, object[], object>> BuildExtensionLookup()
        {
            Dictionary<string, Func<object, object[], object>> EXT = new Dictionary<string, Func<object, object[], object>>();

            // %%%EXTENSION_LOOKUP_START%%% 

            EXT["io_stdout"] = (object task, object[] args) => {
                System.Console.WriteLine(CommonScript.Runtime.ValueConverter.RTValueToReadableString(args[0]));
                return null;
            };
            

            // %%%EXTENSION_LOOKUP_END%%% 

            return EXT;
        }
    }
}
