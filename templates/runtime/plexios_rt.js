(async () => {
  const CommonScript = await PlexiOS.HtmlUtil.getComponent('CommonScript_%%%VERSION_UNDERSCORE%%%');
  const newRuntime = (os) => {
    let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', '%%%VERSION_DOTTED%%%');
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
  PlexiOS.HtmlUtil.registerComponent('PlexiScript_%%%VERSION_UNDERSCORE%%%', newRuntime);
})();
