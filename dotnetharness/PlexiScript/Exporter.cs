using PlexiScriptCompile;
using System;
using System.Collections.Generic;

namespace PlexiScript
{
    // TODO: shouldn't all the export stuff be in PlexiScriptCompile?
    internal class Exporter
    {
        // TODO: enum
        private string exportPlatform;

        public Exporter(string exportPlatform)
        {
            this.exportPlatform = exportPlatform;
        }

        private void ExportWeb(PlexiCompileResult compilation, Dictionary<string, FileOutput> files)
        {
            throw new NotImplementedException();
        }

        private void ExportPlexiOS(PlexiCompileResult compilation, Dictionary<string, FileOutput> files)
        {
            string jsonOutput = string.Join("",
                "{\n",
                "  \"byteCode\": \"", compilation.ByteCodeBase64, "\"\n",
                "}\n"
            );
            files["app.json"] = new FileOutput() { TextContent = jsonOutput };
        }

        public void Export(string destinationPath, PlexiCompileResult result)
        {
            Dictionary<string, FileOutput> files = new Dictionary<string, FileOutput>();
            switch (this.exportPlatform)
            {
                case "web":
                    ExportWeb(result, files);
                    break;

                case "plexios":
                    ExportPlexiOS(result, files);
                    break;

                default:
                    throw new NotImplementedException();
            }

            FileExporter.ExportFiles(destinationPath, files);
        }
    }
}
