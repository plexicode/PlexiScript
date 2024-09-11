const newPlexiScriptPlexiOsRuntime_0_1_0 = (os) => {
  const VERSION = '0.1.0';
  const CommonScript = window.getCommonScript(VER);
  let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', VERSION);
  const VALUE_CONVERTER = CommonScript.runtimeValueConverter;
  const OS = os;
  const { unwrapAppCtx } = VALUE_CONVERTER;

  let EXT = {};
  // 
EXT.io_stdout = (task, args) => {
  let { procinfo } = getAppCtx(task);
  procinfo.stdout.writeln(VALUE_CONVERTER.toReadableString(args[0]));
};


  Object.keys(EXT).forEach(k => {
    engineBuilder.registerExtension(k, extensions[k]);
  });

  return engineBuilder.lockConfiguration();
};
