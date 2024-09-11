using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlexiScript
{
    internal class Exporter
    {
        // TODO: enum
        private string exportPlatform;

        public Exporter(string exportPlatform)
        {
            this.exportPlatform = exportPlatform;
        }

        public void Export(string destinationPath)
        {
            Dictionary<string, FileOutput> files = new Dictionary<string, FileOutput>();
            switch (this.exportPlatform)
            {
                case "web":

                    break;

                case "plexios":
                    break;

                default:
                    throw new NotImplementedException();
            }
            FileExporter.ExportFiles(destinationPath, files);
        }
    }
}
