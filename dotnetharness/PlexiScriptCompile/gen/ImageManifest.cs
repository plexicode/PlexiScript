using System.Collections.Generic;

namespace PlexiScriptCompile.Internal
{
    public class ImageManifest
    {
        public ImageAtlas[] atlases;

        public ImageManifest(ImageAtlas[] atlases)
        {
            this.atlases = atlases;
        }
    }
}
