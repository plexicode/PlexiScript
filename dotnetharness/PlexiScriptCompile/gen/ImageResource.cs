using System.Collections.Generic;

namespace PlexiScriptCompile.Internal
{
    public class ImageResource
    {
        public string path;
        public int width;
        public int height;
        public bool isJpeg;
        public int x;
        public int y;
        public object loadedImageData;
        public int[] fileBytesOriginal;

        public ImageResource(string path, int width, int height, bool isJpeg, int x, int y, object loadedImageData, int[] fileBytesOriginal)
        {
            this.path = path;
            this.width = width;
            this.height = height;
            this.isJpeg = isJpeg;
            this.x = x;
            this.y = y;
            this.loadedImageData = loadedImageData;
            this.fileBytesOriginal = fileBytesOriginal;
        }
    }
}
