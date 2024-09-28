using System;
using System.Collections.Generic;

namespace PlexiScript
{
    internal static class FileExporter
    {
        public static void ExportFiles(string directory, Dictionary<string, FileOutput> files)
        {
            directory = System.IO.Path.GetFullPath(directory);
            PlexiScriptCompile.FileUtil.EnsureDirectoryExists(directory, null);

            foreach (string filePath in files.Keys)
            {
                FileOutput file = files[filePath];
                string absPath = System.IO.Path.Combine(
                    directory,
                    string.Join(System.IO.Path.DirectorySeparatorChar, filePath.Split('/')));
                PlexiScriptCompile.FileUtil.EnsureDirectoryExists(System.IO.Path.GetDirectoryName(absPath), null);
                if (file.ByteContent != null)
                {
                    System.IO.File.WriteAllBytes(absPath, file.ByteContent);
                }
                else if (file.TextContent != null)
                {
                    System.IO.File.WriteAllText(absPath, file.TextContent);
                }
                else if (file.CopyContentFromAbsolutePath != null)
                {
                    System.IO.File.Copy(file.CopyContentFromAbsolutePath, absPath);
                }
                else
                {
                    throw new NotImplementedException();
                }
            }
        }
    }
}
