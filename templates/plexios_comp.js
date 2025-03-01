(async () => {
  const CommonScript = (await PlexiOS.HtmlUtil.loadComponent('CommonScript_compile_%%%VERSION_UNDERSCORE%%%'));
  let EXTENSIONS = '%%%EXTENSION_IDS%%%'.split(',');

  const PlexiScript = CommonScript()('PlexiScript', '%%%VERSION_DOTTED%%%', EXTENSIONS);

  plexiModulesSrcByModuleId = JSON.parse(
    // %%%BUILTIN_MODULES_DOUBLE_STRINGIFY%%%
  );

  let userCompilation = async (mainModuleId, fileLookupByModuleId) => {
    return PlexiScript.doStaticCompilation(mainModuleId, fileLookupByModuleId, plexiModulesSrcByModuleId)
  };

  let plexiCompile = async (mainModuleId, fileLookupByModuleId, dstPath) => {
    let result = await userCompilation(mainModuleId, fileLookupByModuleId);
    if (result.byteCodePayload) {
      result = { ...result, byteCodeB64: PlexiOS.Util.bytesToBase64(result.byteCodePayload) };
    }
    return Object.freeze({ ...result });
  };

  let compiler = Object.freeze({
    compile: plexiCompile,
  });
  
  PlexiOS.HtmlUtil.registerComponent('PlexiScript_compile_%%%VERSION_UNDERSCORE%%%', () => compiler);
})();
