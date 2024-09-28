const newPlexiScriptWebRuntime_%%%VERSION_UNDERSCORE%%% = (domHost) => {
  const CommonScript = window.getCommonScript('%%%VERSION_DOTTED%%%');
  let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', '%%%VERSION_DOTTED%%%');
  const VALUE_CONVERTER = CommonScript.runtimeValueConverter;
  const HOST = domHost || document.body;

  let EXT = {};
  // %%%EXTENSIONS%%%

  Object.keys(EXT).forEach(k => {
    engineBuilder.registerExtension(k, extensions[k]);
  });

  return engineBuilder.lockConfiguration();
};
