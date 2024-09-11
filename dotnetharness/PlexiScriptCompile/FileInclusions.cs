using System.Collections.Generic;

// THIS FILE IS AUTOMATICALLY UPDATED BY A SCRIPT.

namespace PlexiScriptCompile
{
    internal class FileInclusions
    {
        public static Dictionary<string, Dictionary<string, string>> GetFiles()
        {
            Dictionary<string, Dictionary<string, string>> files = new Dictionary<string, Dictionary<string, string>>();
            string[] moduleIds = [
                // %%%BUILTIN_MODULES_START%%%
                "Game", "Resources",
                // %%%BUILTIN_MODULES_END%%%
            ];

            foreach (string mid in moduleIds)
            {
                files[mid] = new Dictionary<string, string>();
            }

            // %%%BUILTIN_FILES_START%%%

            files["Game"]["game.plx"] = "function runGame() {\n    print(\"Hello, World!\");\n}\n";
            files["Resources"]["resources.plx"] = "function loadTextResource(path) {\n    print(\"TODO: load the resource\");\n}\n";

            // %%%BUILTIN_FILES_END%%%


            return files;
        }
    }
}
