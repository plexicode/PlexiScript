using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PlexiScriptCompile
{
    public static class FileUtil
    {
        public static bool EnsureDirectoryExists(string? path, string? root)
        {
            if (root == null) root = System.IO.Path.GetPathRoot(path);
            if (System.IO.Directory.Exists(path)) return true;
            if (System.IO.File.Exists(path)) return false;
            if (root == path) return false;
            string? parent = System.IO.Path.GetDirectoryName(path);
            EnsureDirectoryExists(parent, root);
            if (path == null) return false;
            System.IO.Directory.CreateDirectory(path);
            return true;
        }

        public static string[] RecursiveGetRelativePaths(string rootDir)
        {
            List<string> output = new List<string>();
            FileWalkerImpl(output, rootDir, "");
            return output.ToArray();
        }

        private static void FileWalkerImpl(List<string> output, string currentAbs, string currentRel)
        {
            if (System.IO.Directory.Exists(currentAbs))
            {
                foreach (string path in System.IO.Directory.GetDirectories(currentAbs))
                {
                    string fileName = System.IO.Path.GetFileName(path);
                    FileWalkerImpl(output, path, currentRel == "" ? fileName : (currentRel + '/' + fileName));
                }

                foreach (string path in System.IO.Directory.GetFiles(currentAbs))
                {
                    string fileName = System.IO.Path.GetFileName(path);
                    output.Add(currentRel == "" ? fileName : (currentRel + '/' + fileName));
                }
            }
        }
    }
}
