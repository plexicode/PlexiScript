using System.Collections.Generic;
using System.Linq;

namespace PlexiScript
{
    internal class Program
    {
        private class CliCommand
        {
            public bool IsExport { get; set; }
            public bool IsRun { get; set; }
            public string BuildFilePath { get; set; }
            public string ExportPlatform{ get; set; }
            public string ExportDestination { get; set; }
            public string ExportFormat { get; set; }
        }

        private static CliCommand? ParseUsage(string[] args)
        {
            if (args.Length == 0) return null;
            if (args.Length == 1) return new CliCommand() { IsRun = true, BuildFilePath = args[0], };

            HashSet<string> options = new HashSet<string>([
                "export",
                "exportdest",
                "exportformat",
            ]);
            string buildFilePath = args[0];
            Dictionary<string, string> kvp = new Dictionary<string, string>();
            for (int i = 1; i < args.Length; i++)
            {
                bool isValid = false;
                string optionFlag = args[i].Split('=')[0];
                if (options.Contains(optionFlag))
                {
                    string optionValue = args[i].Substring(optionFlag.Length + 1);
                    if (optionValue.Trim().Length > 0)
                    {
                        isValid = true;
                        kvp[optionFlag] = optionValue;
                    }
                }
            }
            if (kvp.ContainsKey("export"))
            {
                return new CliCommand()
                {
                    IsExport = true,
                    BuildFilePath = args[0],
                    ExportPlatform = kvp["export"],
                    ExportDestination = kvp["exportdest"],
                };
            }

            return null;
        }

        static void Main(string[] args)
        {
            MainImpl(args);
        }

        private static bool ShowErrorAndEnd(params string[] lines)
        {
            foreach (string line in lines)
            {
                System.Console.WriteLine(line);
            }
            return false;
        }

        private static bool MainImpl(string[] args)
        {
            CliCommand? command = ParseUsage(args);
            if (command == null)
            {
                return ShowErrorAndEnd([
                        "PlexiScript Usage:",
                    "  Run:",
                    "    plexi buildfile.json",
                    "  Export:",
                    "    plexi buildfile.json export=[web|plexios] \\",
                    "      exportdest=[path for export]",
                ]);
            }

            string buildFile = command.BuildFilePath;

            PlexiScriptCompile.PlexiCompiler compiler = new PlexiScriptCompile.PlexiCompiler();
            PlexiScriptCompile.PlexiCompileResult result = compiler.DoCompilation(buildFile);

            if (!result.IsSuccess) return ShowErrorAndEnd(result.Error);

            if (command.IsExport)
            {
                if (command.ExportPlatform == null)
                {
                    return ShowErrorAndEnd("Missing export platform. See usage.");
                }

                if (!new string[] { "plexios", "web" }.Contains(command.ExportPlatform))
                {
                    return ShowErrorAndEnd("Unknown export platform: '" + command.ExportPlatform + "'. See usage for valid platform IDs.");
                }

                if (command.ExportDestination == null)
                {
                    return ShowErrorAndEnd("Missing export destination. See usage.");
                }

                if (command.ExportFormat == "b64")
                {
                    System.IO.File.WriteAllText(command.ExportDestination, result.ByteCodeBase64);
                }
                else if (command.ExportFormat == null || command.ExportFormat == "bytes")
                {
                    System.IO.File.WriteAllBytes(command.ExportDestination, result.ByteCode);
                }
                else
                {
                    return ShowErrorAndEnd("Unknown export format: '" + command.ExportFormat + "'");
                }

                Exporter exporter = new Exporter(command.ExportPlatform);
                exporter.Export(command.ExportDestination);
            }

            if (command.IsRun)
            {
                new PlexiScriptRuntime.PlexiRuntime(result.ByteCode, new string[0]).Run();
            }

            return true;
        }
    }
}
