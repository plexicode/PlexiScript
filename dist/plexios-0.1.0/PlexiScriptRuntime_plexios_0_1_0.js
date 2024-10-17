(async () => {
  const CommonScript = (await PlexiOS.HtmlUtil.loadComponent('CommonScript_0_1_0'))();
  const newRuntime = (os) => {
    let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', '0.1.0');
    const VALUE_CONVERTER = CommonScript.runtimeValueConverter;
    const OS = os;
    const { unwrapAppContext } = VALUE_CONVERTER;

    let EXT = {};
    // 
EXT.io_stdout = (task, args) => {
  let { procInfo } = unwrapAppContext(task);
  procInfo.stdout.writeln(VALUE_CONVERTER.toReadableString(args[0]));
};


    Object.keys(EXT).forEach(k => {
      engineBuilder.registerExtension(k, EXT[k]);
    });

    return engineBuilder.lockConfiguration();
  };
  PlexiOS.HtmlUtil.registerComponent('PlexiScript_0_1_0', newRuntime);
})();
