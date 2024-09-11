using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PlexiScriptCompile
{
    public class PlexiCompiler
    {
        private CommonScript.Compiler.CompilationEngine engine;
        public PlexiCompiler()
        {
            this.engine = new CommonScript.Compiler.CompilationEngine(
                "PlexiScript", 
                "0.1.0", // TODO: this needs to be injected
                ExtensionList.GetExtensionIds());
        }

        public PlexiCompileResult DoCompilation(string buildFilePath) {

            string buildFileAbsPath = System.IO.Path.GetFullPath(buildFilePath);
            if (!System.IO.File.Exists(buildFileAbsPath))
            {
                return PlexiCompileResult.GetError("Could not find build file: " + buildFileAbsPath);
            }
            BuildFile buildFile = new BuildFile(buildFileAbsPath, System.IO.File.ReadAllText(buildFileAbsPath));
            if (!buildFile.IsValid)
            {
                return PlexiCompileResult.GetError(buildFile.Error);
            }

            Dictionary<string, Dictionary<string, string>> files = FileInclusions.GetFiles();

            foreach (PlexiModule mod in buildFile.Modules)
            {
                if (files.ContainsKey(mod.ModuleId))
                {
                    return PlexiCompileResult.GetError("There is a module named '" + mod.ModuleId + "' that conflicts with a built-in module by the same name.");
                }
                Dictionary<string, string> filesForModule = new Dictionary<string, string>();

                string[] codeFiles = FileUtil.RecursiveGetRelativePaths(mod.SourceDirectoryAbsolutePath)
                    .Where(p => p.ToLowerInvariant().EndsWith(".px"))
                    .ToArray();
                foreach (string relPath in codeFiles)
                {
                    string absPath = System.IO.Path.Combine(mod.SourceDirectoryAbsolutePath, relPath.Replace('/', System.IO.Path.DirectorySeparatorChar));
                    filesForModule[mod.ModuleId + ":" + relPath] = System.IO.File.ReadAllText(absPath);
                }

                files[mod.ModuleId] = filesForModule;
            }

            CommonScript.Compiler.CompilationResult result = engine.DoStaticCompilation(buildFile.MainModule.ModuleId, files);
            return new PlexiCompileResult()
            {
                ByteCode = result.ByteCodePayload,
                IsSuccess = result.ErrorMessage == null,
                Error = result.ErrorMessage,
            };
        }
    }
}
