const newPlexiScriptPlexiOsRuntime_0_1_0 = (os) => {
  const VERSION = '%%%VERSION_DOTTED%%%';
  const CommonScript = window.getCommonScript(VER);
  let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', VERSION);
  const VALUE_CONVERTER = CommonScript.runtimeValueConverter;
  const OS = os;
  const { unwrapAppCtx } = VALUE_CONVERTER;

  let EXT = {};
  // %%%EXTENSIONS%%%

  Object.keys(EXT).forEach(k => {
    engineBuilder.registerExtension(k, extensions[k]);
  });

  return engineBuilder.lockConfiguration();
};
