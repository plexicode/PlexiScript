(async () => {
    let iconPr = PlexiOS.buildIcon('%%%ICON_BASE64%%%');
    let [icon] = await Promise.all([iconPr]);
    staticAppRegistry.registerAppMetadata('%%%APP_ID%%%', '%%%APP_VERSION%%%', '%%%APP_TITLE%%%', icon);
})();