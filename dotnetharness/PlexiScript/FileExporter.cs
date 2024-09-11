using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace PlexiScript
{
    internal static class FileExporter
    {
        public static void ExportFiles(string directory, Dictionary<string, FileOutput> files)
        {
            directory = System.IO.Path.GetFullPath(directory);
            EnsureDirectoryExists(directory, null);

            foreach (string filePath in files.Keys)
            {
                FileOutput file = files[filePath];
                string absPath = System.IO.Path.Combine(
                    directory,
                    string.Join(System.IO.Path.DirectorySeparatorChar, filePath.Split('/')));
                EnsureDirectoryExists(absPath, null);
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

        private static bool EnsureDirectoryExists(string path, string root)
        {
            if (root == null) root = System.IO.Path.GetPathRoot(path);
            if (System.IO.Directory.Exists(path)) return true;
            if (System.IO.File.Exists(path)) return false;
            if (root == path) return false;
            string parent = System.IO.Path.GetDirectoryName(path);
            EnsureDirectoryExists(parent, root);
            System.IO.Directory.CreateDirectory(path);
            return true;
        }
    }
}
