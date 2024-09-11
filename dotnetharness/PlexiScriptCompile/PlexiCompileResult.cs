using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlexiScriptCompile
{
    public class PlexiCompileResult
    {
        public bool IsSuccess { get; internal set; }
        public string Error { get; internal set; }
        public byte[] ByteCode { get; internal set; }
        public string ByteCodeBase64 { get { return this.ByteCode == null ? null : System.Convert.ToBase64String(this.ByteCode); } }

        internal PlexiCompileResult() { }

        internal static PlexiCompileResult GetError(string error)
        {
            return new PlexiCompileResult() { IsSuccess = false, Error = error };
        }
    }
}
