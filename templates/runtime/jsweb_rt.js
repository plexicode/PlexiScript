const newPlexiScriptWebRuntime_0_1_0 = (domHost) => {
  const VERSION = '%%%VERSION_DOTTED%%%';
  const CommonScript = window.getCommonScript(VER);
  let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', VERSION);
  const VALUE_CONVERTER = CommonScript.runtimeValueConverter;
  const HOST = domHost || document.body;

  let EXT = {};
  // %%%EXTENSIONS%%%

  Object.keys(EXT).forEach(k => {
    engineBuilder.registerExtension(k, extensions[k]);
  });

  return engineBuilder.lockConfiguration();
};
