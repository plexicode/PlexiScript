const newPlexiScriptWebRuntime_0_1_0 = (domHost) => {
  const VERSION = '0.1.0';
  const CommonScript = window.getCommonScript(VER);
  let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', VERSION);
  const VALUE_CONVERTER = CommonScript.runtimeValueConverter;
  const HOST = domHost || document.body;

  let EXT = {};
  // 
EXT.io_stdout = (_, args) => {
  console.log(VALUE_CONVERTER.toReadableString(args[0]));
};


  Object.keys(EXT).forEach(k => {
    engineBuilder.registerExtension(k, extensions[k]);
  });

  return engineBuilder.lockConfiguration();
};
