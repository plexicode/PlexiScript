using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;

namespace PlexiScriptCompile
{
    internal class BuildFile
    {
        public bool IsValid { get; private set; }
        public string Error { get; private set; }

        public PlexiModule MainModule { get; private set; }
        public PlexiModule[] Modules { get; private set; }

        public BuildFile(string path, string content)
        {
            BuildFileJson? parsedFile = null;
            try
            {
                Utf8JsonReader jsonReader = new System.Text.Json.Utf8JsonReader(Encoding.UTF8.GetBytes(content));
                parsedFile = System.Text.Json.JsonSerializer.Deserialize<BuildFileJson>(content);
            }
            catch (Exception)
            {
                // syntax problem
            }

            if (parsedFile == null)
            {
                this.IsValid = false;
                this.Error = "Build file is not valid JSON";
            }
            else
            {
                string parentDir = System.IO.Path.GetDirectoryName(path);
                this.Init(parentDir, parsedFile);
            }

        }

        private void Init(string projectPath, BuildFileJson rawData)
        {
            string err = this.TryInitOrGetError(projectPath, rawData);
            if (err == null)
            {
                this.IsValid = true;
            } else
            {
                this.IsValid = false;
                this.Error = err;
            }
        }

        private static string LETTERS = "abcdefghijklmnopqrstuvwxyz";
        private static string NUMBERS = "0123456789";
        private static HashSet<char> VALID_MODULE_CHARS = new HashSet<char>((LETTERS + LETTERS.ToUpperInvariant() + NUMBERS + "_").ToCharArray());
        private static bool IsModuleNameValid(string name)
        {
            if (name == null) return false;
            if (name.Length < 1) return false;
            if (name[0] >= '0' && name[0] <= '9') return false;
            foreach (char c in name.ToCharArray())
            {
                if (!VALID_MODULE_CHARS.Contains(c))
                {
                    return false;
                }
            }
            return true;
        }


        private string TryInitOrGetError(string projectPath, BuildFileJson rawData)
        {

            List<PlexiModule> modules = new List<PlexiModule>();
            HashSet<string> moduleIdsSeen = new HashSet<string>();

            if (rawData.modules == null)
            {
                return "The build file does not define any modules.";
            }

            if (rawData.mainModule == null || rawData.mainModule.Trim() == "")
            {
                return "The build file does is missing a valid 'mainModule' field.";
            }

            foreach (ModuleJson modJson in rawData.modules)
            {
                PlexiModule m = new PlexiModule();
                m.SourceDirectoryAbsolutePath = modJson.source;
                m.ModuleId = modJson.name;
                if (m.ModuleId == null) return "A module is missing its 'name' field.";
                if (m.ModuleId.Trim() == "") return "A module has a blank 'name' field.";
                if (!IsModuleNameValid(m.ModuleId)) return "The module name '" + m.ModuleId + "' is not valid. Module names must contain alphanumeric characters or underscores only and cannot begin with a number.";


                if (m.SourceDirectoryAbsolutePath == null) return "The module '" + m.ModuleId + "' is missing its 'source' field.";
                string path = m.SourceDirectoryAbsolutePath;
                if (!System.IO.Path.IsPathFullyQualified(path))
                {
                    path = System.IO.Path.Combine(projectPath, path);
                }
                path = System.IO.Path.GetFullPath(path);
                if (System.IO.Directory.Exists(path))
                {
                    m.SourceDirectoryAbsolutePath = path;
                }
                else if (System.IO.File.Exists(path))
                {
                    return "The module '" + m.ModuleId + "' has a path points to a file. It must point to a directory instead.";
                }
                else
                {
                    return "The source path for the module '" + m.ModuleId + "' does not exist.";
                }

                if (moduleIdsSeen.Contains(m.ModuleId))
                {
                    return "There are multiple modules with the name '" + m.ModuleId + "'.";
                }
                moduleIdsSeen.Add(m.ModuleId);
                if (m.ModuleId == rawData.mainModule) this.MainModule = m;
                modules.Add(m);
            }
            this.Modules = modules.ToArray();

            if (this.MainModule == null)
            {
                return "The main module specified in the build file does not exist in the module list.";
            }

            return null;
        }

        public class ModuleJson
        {
            public string source { get; set; }
            public string name { get; set; }
        }

        public class BuildFileJson
        {
            public ModuleJson[] modules { get; set; }
            public string mainModule { get; set; }
        }

    }
}
