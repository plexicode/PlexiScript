using System.Collections.Generic;
using System.Linq;

namespace PlexiScriptCompile.Internal
{
    internal static class FunctionWrapper
    {
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8603 // Possible null reference return.
#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.
        private static int[] PST_stringToUtf8Bytes(string str)
        {
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(str);
            int len = bytes.Length;
            int[] output = new int[len];
            for (int i = 0; i < len; i++)
            {
                output[i] = ((int)bytes[i]) & 255;
            }
            return output;
        }

        private static readonly string[] PST_SplitSep = new string[1];

        private static string[] PST_StringSplit(string value, string sep)
        {
            if (sep.Length == 1) return value.Split(sep[0]);
            if (sep.Length == 0) return value.ToCharArray().Select<char, string>(c => "" + c).ToArray();
            PST_SplitSep[0] = sep;
            return value.Split(PST_SplitSep, System.StringSplitOptions.None);
        }

        private static T PST_ListPop<T>(List<T> list)
        {
            if (list.Count == 0) throw new System.InvalidOperationException();
            int lastIndex = list.Count - 1;
            T val = list[lastIndex];
            list.RemoveAt(lastIndex);
            return val;
        }

        private static Dictionary<string, System.Func<object[], object>> PST_ExtCallbacks = new Dictionary<string, System.Func<object[], object>>();

        public static void PST_RegisterExtensibleCallback(string name, System.Func<object[], object> func)
        {
            PST_ExtCallbacks[name] = func;
        }

        public static ImageAtlas createSolitaryAtlas(ImageResource img)
        {
            System.Collections.Generic.List<ImageResource> resources = new List<ImageResource>();
            resources.Add(img);
            img.x = 0;
            img.y = 0;
            System.Collections.Generic.Dictionary<string, int> lookup = new Dictionary<string, int>();
            lookup[img.path] = 0;
            return new ImageAtlas(resources, img.isJpeg, lookup, img.width, img.height, null);
        }

        public static int[] generateImagePayloadForBundle(ImageManifest manifest)
        {
            System.Collections.Generic.List<int> output = new List<int>();
            pushArrayIntToList(output, PST_stringToUtf8Bytes(serializeImageManifest(manifest)));
            output.Add(0);
            int i = 0;
            while (i < manifest.atlases.Length)
            {
                int[] atlasBytes = manifest.atlases[i].bytes;
                int sz = atlasBytes.Length;
                pushArrayIntToList(output, integerToBigEndian4(sz));
                pushArrayIntToList(output, atlasBytes);
                i += 1;
            }
            return output.ToArray();
        }

        public static void ImageAtlas_computeSize(ImageAtlas atlas)
        {
            int width = 0;
            int height = 0;
            System.Collections.Generic.List<ImageResource> images = atlas.images;
            int sz = images.Count;
            int i = 0;
            while (i < sz)
            {
                ImageResource img = images[i];
                int right = img.x + img.width;
                int bottom = img.y + img.height;
                if (right > width)
                {
                    width = right;
                }
                if (bottom > height)
                {
                    height = bottom;
                }
                i += 1;
            }
            atlas.width = width;
            atlas.height = height;
        }

        public static int[] integerToBigEndian4(int value)
        {
            int[] output = new int[4];
            output[0] = value >> 24 & 255;
            output[1] = value >> 16 & 255;
            output[2] = value >> 8 & 255;
            output[3] = value & 255;
            return output;
        }

        public static string PUBLIC_bytesToBase64(int[] buf)
        {
            int i = 0;
            int b = 0;
            System.Collections.Generic.List<int> pairs = new List<int>();
            int sz = buf.Length;
            i = 0;
            while (i < sz)
            {
                b = buf[i];
                pairs.Add(b >> 6 & 3);
                pairs.Add(b >> 4 & 3);
                pairs.Add(b >> 2 & 3);
                pairs.Add(b & 3);
                i += 1;
            }
            while (pairs.Count % 3 != 0)
            {
                pairs.Add(0);
            }
            string[] alphabet = new string[64];
            i = 0;
            while (i < 26)
            {
                alphabet[i] = "" + (char)(65 + i);
                alphabet[i + 26] = "" + (char)(97 + i);
                if (i < 10)
                {
                    alphabet[i + 52] = i.ToString();
                }
                i += 1;
            }
            alphabet[62] = "+";
            alphabet[63] = "/";
            System.Collections.Generic.List<string> sb = new List<string>();
            i = 0;
            while (i < pairs.Count)
            {
                b = pairs[i] << 4 | pairs[i + 1] << 2 | pairs[i + 2];
                sb.Add(alphabet[b]);
                i += 3;
            }
            while (sb.Count % 4 != 0)
            {
                sb.Add("=");
            }
            return string.Join("", sb);
        }

        public static int[] PUBLIC_generateBundle(string optionalAppId, string title, int[] byteCode, int[] iconResource, object imageManifestObj, object[] binaryResourcesObjs, int[] version)
        {
            int i = 0;
            int j = 0;
            System.Collections.Generic.Dictionary<string, int[]> sections = new Dictionary<string, int[]>();
            if (optionalAppId != null)
            {
                sections["ID"] = PST_stringToUtf8Bytes(optionalAppId);
            }
            if (title != null)
            {
                sections["NAME"] = PST_stringToUtf8Bytes(title);
            }
            ImageManifest imageManifest = (ImageManifest)imageManifestObj;
            if (imageManifest.atlases.Length > 0)
            {
                sections["IMG"] = generateImagePayloadForBundle(imageManifest);
            }
            sections["BC"] = byteCode;
            System.Collections.Generic.List<int> output = new List<int>();
            pushArrayIntToList(output, PST_stringToUtf8Bytes("PLXSCR"));
            output.Add(0);
            output.Add(255);
            pushArrayIntToList(output, integerToBigEndian4(version[0]));
            pushArrayIntToList(output, integerToBigEndian4(version[1]));
            pushArrayIntToList(output, integerToBigEndian4(version[2]));
            string[] keys = sections.Keys.ToArray().OrderBy<string, string>(_PST_GEN_arg => _PST_GEN_arg).ToArray();
            i = 0;
            while (i < keys.Length)
            {
                string key = keys[i];
                pushArrayIntToList(output, PST_stringToUtf8Bytes(key));
                output.Add(0);
                int[] payload = sections[key];
                int[] payloadSizeBytes = integerToBigEndian4(payload.Length);
                j = 0;
                while (j < 4)
                {
                    output.Add(payloadSizeBytes[j]);
                    j += 1;
                }
                int sz = payload.Length;
                j = 0;
                while (j < sz)
                {
                    output.Add(payload[j]);
                    j += 1;
                }
                i += 1;
            }
            return output.ToArray();
        }

        public static object PUBLIC_generateImageManifest(object[] imageResourceObjs)
        {
            int i = 0;
            int j = 0;
            ImageResource img = null;
            int imageCount = imageResourceObjs.Length;
            System.Collections.Generic.Dictionary<string, ImageResource> imageByPath = new Dictionary<string, ImageResource>();
            System.Collections.Generic.List<ImageResource> allImages = new List<ImageResource>();
            i = 0;
            while (i < imageResourceObjs.Length)
            {
                img = (ImageResource)imageResourceObjs[i];
                allImages.Add(img);
                imageByPath[img.path] = img;
                i += 1;
            }
            string[] sortedImagePaths = imageByPath.Keys.ToArray().OrderBy<string, string>(_PST_GEN_arg => _PST_GEN_arg).ToArray();
            System.Collections.Generic.List<ImageAtlas> atlases = new List<ImageAtlas>();
            System.Collections.Generic.List<ImageResource> smallImages = new List<ImageResource>();
            System.Collections.Generic.List<ImageResource> tallImages = new List<ImageResource>();
            System.Collections.Generic.List<ImageResource> wideImages = new List<ImageResource>();
            i = 0;
            while (i < imageCount)
            {
                img = imageByPath[sortedImagePaths[i]];
                bool isBig = false;
                if (img.isJpeg || img.width * img.height > 2000000 || img.width > 2500 || img.height > 2500)
                {
                    atlases.Add(createSolitaryAtlas(img));
                }
                else if (img.width > 600 && img.height < 300 || img.width > 1200)
                {
                    wideImages.Add(img);
                }
                else if (img.height > 600 && img.width < 300 || img.height > 1200)
                {
                    tallImages.Add(img);
                }
                else
                {
                    smallImages.Add(img);
                }
                i += 1;
            }
            rectanglePacker_packImagesStacked(tallImages, atlases, false);
            rectanglePacker_packImagesStacked(wideImages, atlases, true);
            rectanglePacker_packImages(smallImages, atlases);
            i = 0;
            while (i < atlases.Count)
            {
                ImageAtlas_computeSize(atlases[i]);
                i += 1;
            }
            return new ImageManifest(atlases.ToArray());
        }

        public static string PUBLIC_getImageType(string path)
        {
            string[] parts = PST_StringSplit(path, ".");
            if (parts.Length == 1)
            {
                return null;
            }
            string ext = parts[parts.Length - 1];
            ext = ext.ToUpper();
            if (ext == "PNG" || ext == "JPEG")
            {
                return ext;
            }
            if (ext == "JPG")
            {
                return "JPEG";
            }
            return null;
        }

        public static int PUBLIC_ImageAtlas_getHeight(object a)
        {
            return ((ImageAtlas)a).height;
        }

        public static System.Collections.Generic.List<object> PUBLIC_ImageAtlas_getImages(object a)
        {
            System.Collections.Generic.List<object> o = new List<object>();
            System.Collections.Generic.List<ImageResource> images = ((ImageAtlas)a).images;
            int i = 0;
            while (i < images.Count)
            {
                o.Add((object)images[i]);
                i += 1;
            }
            return o;
        }

        public static int PUBLIC_ImageAtlas_getWidth(object a)
        {
            return ((ImageAtlas)a).width;
        }

        public static bool PUBLIC_ImageAtlas_isJpeg(object a)
        {
            return ((ImageAtlas)a).isJpeg;
        }

        public static void PUBLIC_ImageAtlas_setBytes(object a, int[] bytes)
        {
            ((ImageAtlas)a).bytes = bytes;
        }

        public static System.Collections.Generic.List<object> PUBLIC_ImageManifest_getAtlases(object m)
        {
            System.Collections.Generic.List<object> output = new List<object>();
            ImageAtlas[] atlases = ((ImageManifest)m).atlases;
            int i = 0;
            while (i < atlases.Length)
            {
                output.Add((object)atlases[i]);
                i += 1;
            }
            return output;
        }

        public static int[] PUBLIC_ImageResource_getOriginalBytes(object img)
        {
            return ((ImageResource)img).fileBytesOriginal;
        }

        public static object PUBLIC_ImageResource_getOriginalImage(object img)
        {
            return ((ImageResource)img).loadedImageData;
        }

        public static int PUBLIC_ImageResource_getX(object img)
        {
            return ((ImageResource)img).x;
        }

        public static int PUBLIC_ImageResource_getY(object img)
        {
            return ((ImageResource)img).y;
        }

        public static object PUBLIC_ImageResourceOf(string path, int width, int height, bool isJpeg, object loadedImageData, int[] origBytes)
        {
            return new ImageResource(path, width, height, isJpeg, -1, -1, loadedImageData, origBytes);
        }

        public static void pushArrayIntToList(System.Collections.Generic.List<int> dst, int[] src)
        {
            int sz = src.Length;
            int i = 0;
            while (i < sz)
            {
                dst.Add(src[i]);
                i += 1;
            }
        }

        public static void rectanglePacker_packImages(System.Collections.Generic.List<ImageResource> images, System.Collections.Generic.List<ImageAtlas> atlases)
        {
            int startIndex = 0;
            while (startIndex < images.Count)
            {
                ImageAtlas atlas = rectanglePacker_packNextAtlas(startIndex, images);
                atlas.imagePathToIndex = new Dictionary<string, int>();
                int imageCount = atlas.images.Count;
                int i = 0;
                while (i < imageCount)
                {
                    ImageResource img = atlas.images[i];
                    atlas.imagePathToIndex[img.path] = i;
                    i += 1;
                }
                startIndex += imageCount;
                atlases.Add(atlas);
            }
        }

        public static void rectanglePacker_packImagesStacked(System.Collections.Generic.List<ImageResource> images, System.Collections.Generic.List<ImageAtlas> atlasesOut, bool isVerticalStack)
        {
            int offset = 0;
            while (offset < images.Count)
            {
                int currentStackSizePixels = 0;
                bool keepTrying = true;
                ImageAtlas activeAtlas = new ImageAtlas(new List<ImageResource>(), false, new Dictionary<string, int>(), 0, 0, null);
                atlasesOut.Add(activeAtlas);
                while (keepTrying)
                {
                    ImageResource img = images[offset];
                    int imagePixelSize = img.width;
                    if (isVerticalStack)
                    {
                        imagePixelSize = img.height;
                    }
                    if (activeAtlas.images.Count == 0 || currentStackSizePixels + imagePixelSize <= 3000)
                    {
                        activeAtlas.imagePathToIndex[img.path] = activeAtlas.images.Count;
                        activeAtlas.images.Add(img);
                        img.x = 0;
                        img.y = 0;
                        if (isVerticalStack)
                        {
                            img.y = currentStackSizePixels;
                        }
                        else
                        {
                            img.x = currentStackSizePixels;
                        }
                        currentStackSizePixels += imagePixelSize;
                        offset += 1;
                    }
                    else
                    {
                        keepTrying = false;
                    }
                }
            }
        }

        public static ImageAtlas rectanglePacker_packNextAtlas(int startIndex, System.Collections.Generic.List<ImageResource> images)
        {
            int maxCount = images.Count - startIndex;
            int minCount = 1;
            int currentAttemptCount = 32;
            if (currentAttemptCount > maxCount)
            {
                currentAttemptCount = maxCount;
            }
            ImageAtlas minCountAtlas = null;
            while (maxCount > minCount)
            {
                ImageAtlas activeAttempt = rectanglePacker_tryPackAtlas(startIndex, currentAttemptCount, images);
                if (activeAttempt == null)
                {
                    maxCount = currentAttemptCount - 1;
                }
                else
                {
                    minCount = currentAttemptCount;
                    minCountAtlas = activeAttempt;
                }
                currentAttemptCount = minCount + maxCount >> 1;
                if (currentAttemptCount == minCount)
                {
                    currentAttemptCount = minCount + 1;
                }
            }
            if (maxCount == minCount && minCountAtlas != null)
            {
                return minCountAtlas;
            }
            return createSolitaryAtlas(images[startIndex]);
        }

        public static ImageAtlas rectanglePacker_tryPackAtlas(int startIndex, int imageCount, System.Collections.Generic.List<ImageResource> images)
        {
            ImageAtlas atlas = new ImageAtlas(new List<ImageResource>(), false, null, -1, -1, null);
            System.Collections.Generic.Dictionary<int, System.Collections.Generic.List<ImageResource>> resourcesByHeight = new Dictionary<int, System.Collections.Generic.List<ImageResource>>();
            int i = 0;
            int j = 0;
            ImageResource img = null;
            i = 0;
            while (i < imageCount)
            {
                img = images[i + startIndex];
                atlas.images.Add(img);
                if (!resourcesByHeight.ContainsKey(img.y))
                {
                    resourcesByHeight[img.y] = new List<ImageResource>();
                }
                resourcesByHeight[img.y].Add(img);
                i += 1;
            }
            int[] ySizes = resourcesByHeight.Keys.ToArray().OrderBy<int, int>(_PST_GEN_arg => _PST_GEN_arg).ToArray();
            System.Collections.Generic.List<ImageResource> imagesSortedByHeight = new List<ImageResource>();
            i = 0;
            while (i < ySizes.Length)
            {
                System.Collections.Generic.List<ImageResource> imagesOfHeight = resourcesByHeight[ySizes[i]];
                j = 0;
                while (j < imagesOfHeight.Count)
                {
                    imagesSortedByHeight.Add(imagesOfHeight[j]);
                    j += 1;
                }
                i += 1;
            }
            int imagesLength = imageCount;
            i = 0;
            int currentX = 0;
            int currentY = 0;
            int rowBottom = 0;
            while (i < imagesLength)
            {
                img = imagesSortedByHeight[i];
                img.x = currentX;
                img.y = currentY;
                int right = currentX + img.width;
                if (right > 3000)
                {
                    currentX = 0;
                    currentY = rowBottom;
                    rowBottom += img.height;
                    if (rowBottom > 3000)
                    {
                        return null;
                    }
                }
                else
                {
                    i += 1;
                    currentX = right;
                }
            }
            return atlas;
        }

        public static void serializeImageAtlas(System.Collections.Generic.List<string> rows, ImageAtlas atlas)
        {
            rows.Add("A");
            string[] paths = atlas.imagePathToIndex.Keys.ToArray();
            paths = paths.OrderBy<string, string>(_PST_GEN_arg => _PST_GEN_arg).ToArray();
            System.Collections.Generic.List<string> activePath = new List<string>();
            int i = 0;
            while (i < paths.Length)
            {
                string path = paths[i];
                string[] pathParts = PST_StringSplit(path, "/");
                int matchSize = 0;
                int maxPossibleMatchSize = pathParts.Length;
                if (activePath.Count < maxPossibleMatchSize)
                {
                    maxPossibleMatchSize = activePath.Count;
                }
                int j = 0;
                while (j < maxPossibleMatchSize)
                {
                    if (activePath[j] != pathParts[j])
                    {
                        j += maxPossibleMatchSize;
                    }
                    else
                    {
                        matchSize += 1;
                    }
                    j += 1;
                }
                if (matchSize == pathParts.Length)
                {
                    ImageResource img = atlas.images[atlas.imagePathToIndex[path]];
                    if (img.isJpeg)
                    {
                        rows.Add("B");
                    }
                    else
                    {
                        rows.Add(string.Join("", new string[] { "I:", img.x.ToString(), ":", img.y.ToString(), ":", img.width.ToString(), ":", img.height.ToString() }));
                    }
                    PST_ListPop(activePath);
                }
                else if (activePath.Count > matchSize)
                {
                    PST_ListPop(activePath);
                    rows.Add("P");
                    i -= 1;
                }
                else if (pathParts.Length > matchSize)
                {
                    string pushPathPart = pathParts[matchSize];
                    activePath.Add(pushPathPart);
                    rows.Add("F:" + pushPathPart);
                    i -= 1;
                }
                i += 1;
            }
        }

        public static string serializeImageManifest(ImageManifest imageManifest)
        {
            System.Collections.Generic.List<string> rows = new List<string>();
            int i = 0;
            while (i < imageManifest.atlases.Length)
            {
                ImageAtlas atlas = imageManifest.atlases[i];
                serializeImageAtlas(rows, atlas);
                i += 1;
            }
            return string.Join("\n", rows);
        }
    }
}
