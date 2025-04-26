(async () => {
  const CommonScript = (await PlexiOS.HtmlUtil.loadComponent('CommonScript_compile_%%%VERSION_UNDERSCORE%%%'));
  let EXTENSIONS = '%%%EXTENSION_IDS%%%'.split(',');

  const PST = (() => {
    //%%%PLEXI_SCRIPT_UTILS%%%
    return {
      generateBundle: PUBLIC_generateBundle,
      imageResourceOf: PUBLIC_ImageResourceOf,
      bytesToBase64: PUBLIC_bytesToBase64,
      getImageType: PUBLIC_getImageType,
      ImageResource: {
        getX: PUBLIC_ImageResource_getX,
        getY: PUBLIC_ImageResource_getY,
        getOriginalImage: PUBLIC_ImageResource_getOriginalImage,
        getOriginalBytes: PUBLIC_ImageResource_getOriginalBytes,
      },
      ImageAtlas: {
        getWidth: PUBLIC_ImageAtlas_getWidth,
        getHeight: PUBLIC_ImageAtlas_getHeight,
        isJpeg: PUBLIC_ImageAtlas_isJpeg,
        getImages: PUBLIC_ImageAtlas_getImages,
        setBytes: PUBLIC_ImageAtlas_setBytes,
      },
      ImageManifest: {
        generate: PUBLIC_generateImageManifest,
        getAtlases: PUBLIC_ImageManifest_getAtlases,
      },
    };

  })();

  const PlexiScript = CommonScript()('PlexiScript', '%%%VERSION_DOTTED%%%', EXTENSIONS);

  let usageNotes = [
    //%%%USAGE_NOTES%%%
  ][0];

  plexiModulesSrcByModuleId = JSON.parse(
    //%%%BUILTIN_MODULES_DOUBLE_STRINGIFY%%%
  );

  let userCompilation = async (mainModuleId, fileLookupByModuleId) => {
    return PlexiScript.doStaticCompilation(mainModuleId, fileLookupByModuleId, plexiModulesSrcByModuleId)
  };

  let loadImage = async (byteBuf) => {
    let base64 = PST.bytesToBase64(byteBuf);
    // 'iV' is the standard PNG heading in B64.
    let isJpeg = !base64.startsWith('iV');
    return new Promise(res => {
      let loader = document.createElement('img');
      // TODO: check if invalid.
      loader.addEventListener('load', () => {
        let c = document.createElement('canvas');
        let { width, height } = loader;
        c.width = width;
        c.height = height;
        let g = c.getContext('2d');
        g.drawImage(loader, 0, 0);
        res({ ok: true, isJpeg, image: c, width, height, bytes: byteBuf });
      });
      loader.src = 'data:image/' + (isJpeg ? 'jpeg' : 'png') + ';base64,' + base64;
    });
  };

  let generateResourceData = async (resourceFileRelativePaths, readFileBytesAsync) => {
    let fileLookup = {};
    let promises = [];
    let failures = [];
    for (const rel of resourceFileRelativePaths) {
      let pr = Promise.resolve(readFileBytesAsync(rel)).then(bytes => {
        if (!bytes) {
          failures.push(rel);
        } else {
          fileLookup[rel] = bytes;
        }
      });
      promises.push(pr);
    };
    await Promise.all(promises);
    if (failures.length) {
      return { ok: false, error: 'RESOURCE_LOAD_FAILED', files: failures.sort() };
    }

    let imagePromises = [];
    let rawByteResources = [];
    let imgLoadFailures = [];
    for (let path of Object.keys(fileLookup)) {
      if (PST.getImageType(path)) {
        imagePromises.push(loadImage(fileLookup[path]).then(img => {
          if (!img.ok) {
            imgLoadFailures.push({ ok: false, error: 'RESOURCE_INVALID_IMAGE', path });
            return;
          }
          return PST.imageResourceOf(path, img.width, img.height, img.isJpeg, img.image, img.bytes);
        }));
      } else {
        NYI(); // similar Pastel struct of raw byte resources.
      }
    }
    let images = await Promise.all(imagePromises);
    if (imgLoadFailures.length) {
      imgLoadFailures.sort((a, b) => a.path.localeCompare(b.path));
      return { ok: false, error: 'RESOURCE_INVALID_IMAGE', files: imgLoadFailures.map(v => v.path) };
    }

    return {
      ok: true,
      images,
      rawByteResources,
    };
  };

  let createBlittableSurface = (w, h) => {
    let canv = document.createElement('canvas');
    canv.width = w;
    canv.height = h;
    let g = canv.getContext('2d');
    return {
      getCanvas: () => canv,
      blit: (img, x, y) => { g.drawImage(img, x, y); },
      getBytes: () => {
        let b64 = canv.toDataURL().split(',').pop();
        return PlexiOS.Util.base64ToBytes(b64);
      },
    }
  };

  let NYI = () => { throw new Error('NOT IMPLEMENTED'); };

  let plexiCompile = async (mainModuleId, fileLookupByModuleId, resourceFilePaths, readFileBytesAsync) => {

    let readFileBytes = async path => {
      try {
        let { ok, bytes } = await Promise.resolve(readFileBytesAsync(path));
        if (!ok) return null;
        return bytes;
      } catch (ex) {
        return null;
      }
    };
    let result = await userCompilation(mainModuleId, fileLookupByModuleId);
    if (result.byteCodePayload) {
      result = { ...result, byteCodeB64: PlexiOS.Util.bytesToBase64(result.byteCodePayload) };
    }
    let resInfo = await generateResourceData(resourceFilePaths, readFileBytes);
    if (!resInfo.ok) return resInfo;

    let { images, rawByteResources } = resInfo;

    let imageManifest = PST.ImageManifest.generate(images);
    for (let atlas of PST.ImageManifest.getAtlases(imageManifest)) {
      let width = PST.ImageAtlas.getWidth(atlas);
      let height = PST.ImageAtlas.getHeight(atlas);
      let isJpeg = PST.ImageAtlas.isJpeg(atlas);
      let atlasImg = isJpeg ? null : createBlittableSurface(width, height);
      for (let img of PST.ImageAtlas.getImages(atlas)) {
        if (isJpeg) {
          PST.ImageAtlas.setBytes(atlas, PST.ImageResource.getOriginalBytes(img));
        } else {
          atlasImg.blit(PST.ImageResource.getOriginalImage(img), PST.ImageResource.getX(img), PST.ImageResource.getY(img));
        }
      }
      if (!isJpeg) {
        PST.ImageAtlas.setBytes(atlas, atlasImg.getBytes());
      }
    }

    let appId = null;
    let title = "Untitled App";
    let iconBytes = null;
    let verMajMinPat = '%%%VERSION_DOTTED%%%'.split('.').map(v => parseInt(v));
    let bytesIntList = PST.generateBundle(
      appId, // app ID
      title,
      result.byteCodePayload,
      iconBytes || [],
      imageManifest,
      {}, // binary resources
      verMajMinPat
    );
    let bytes = Uint8Array.from(bytesIntList);

    if (rawByteResources.length) NYI();

    return Object.freeze({ ok: true, id: appId, title, bytes, icon: iconBytes });
  };

  let compiler = Object.freeze({
    compile: plexiCompile,
    getUsageNotes: () => usageNotes,
  });

  PlexiOS.HtmlUtil.registerComponent('PlexiScript_compile_%%%VERSION_UNDERSCORE%%%', () => compiler);
})();
