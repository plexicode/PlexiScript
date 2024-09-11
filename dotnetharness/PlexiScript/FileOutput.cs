using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlexiScript
{
    internal class FileOutput
    {
        public string TextContent { get; set; }
        public byte[] ByteContent { get; set; }
        public string CopyContentFromAbsolutePath { get; set; }
    }
}
