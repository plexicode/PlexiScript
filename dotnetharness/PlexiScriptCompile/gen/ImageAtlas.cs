using System.Collections.Generic;

namespace PlexiScriptCompile.Internal
{
    public class ImageAtlas
    {
        public System.Collections.Generic.List<ImageResource> images;
        public bool isJpeg;
        public System.Collections.Generic.Dictionary<string, int> imagePathToIndex;
        public int width;
        public int height;
        public int[] bytes;

        public ImageAtlas(System.Collections.Generic.List<ImageResource> images, bool isJpeg, System.Collections.Generic.Dictionary<string, int> imagePathToIndex, int width, int height, int[] bytes)
        {
            this.images = images;
            this.isJpeg = isJpeg;
            this.imagePathToIndex = imagePathToIndex;
            this.width = width;
            this.height = height;
            this.bytes = bytes;
        }
    }
}
