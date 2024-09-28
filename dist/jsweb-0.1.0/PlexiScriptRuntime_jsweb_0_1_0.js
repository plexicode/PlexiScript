const newPlexiScriptWebRuntime_0_1_0 = (domHost) => {
  const CommonScript = window.getCommonScript('0.1.0');
  let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', '0.1.0');
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
