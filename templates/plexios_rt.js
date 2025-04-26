(async () => {
  const CommonScript = (await PlexiOS.HtmlUtil.loadComponent('CommonScript_%%%VERSION_UNDERSCORE%%%'))();
  const newRuntime = (os) => {
    let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', '%%%VERSION_DOTTED%%%');
    const VALUE_CONVERTER = CommonScript.runtimeValueConverter;
    const OS = os;
    const { unwrapAppContext } = VALUE_CONVERTER;

    let EXT = {};
    // %%%EXTENSIONS%%%

    Object.keys(EXT).forEach(k => {
      engineBuilder.registerExtension(k, EXT[k]);
    });

    return {
      // Common Script methods
      ...engineBuilder.lockConfiguration(),

      parseBundleBytes: bytes => {
        // TODO: the bulk of this should be a Pastel-generated helper function.
        let popBigEndian4 = i => {
          let n = 0;
          for (let j = 0; j < 4; j++) {
            n = (n << 8) | bytes[i + j];
          }
          return n;
        };
        let popAsciiString = i => {
          let sb = '';
          while (i < bytes.length && bytes[i] < 128 && bytes[i] > 0) {
            sb += String.fromCharCode(bytes[i++]);
          }
          return sb;
        };

        let rawSections = {};
        let version = [];
        for (let i = 8; i < 20; i += 4) {
          version.push(popBigEndian4(i));
        }

        for (let i = 20; i < bytes.length; ) {
          let header = popAsciiString(i);
          i += header.length;
          if (bytes[i] !== 0) return null;
          let sz = popBigEndian4(++i);
          i += 4;
          let sectionBytes = [];
          for (let j = 0; j < sz; j++) {
            sectionBytes.push(bytes[i + j]);
          }
          rawSections[header] = new Uint8Array(sectionBytes);
          i += sz;
        }

        return {
          id: rawSections.ID,
          name: new TextDecoder().decode(rawSections.NAME),
          byteCode: rawSections.BC,
          imageManifest: rawSections.IMG,
          version: {
            flat: version.join('.'),
            underscore: version.join('_'),
            major: version[0],
            minor: version[1],
            patch: version[2],
          }
        };
      },
    };
  };
  PlexiOS.HtmlUtil.registerComponent('PlexiScript_%%%VERSION_UNDERSCORE%%%', newRuntime);
})();
