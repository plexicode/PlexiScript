using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PlexiScriptCompile
{
    internal static class FileUtil
    {
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
