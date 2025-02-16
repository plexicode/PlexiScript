EXT.dom_create_element = (task, args) => {
    let tag = VALUE_CONVERTER.toReadableString(args[0]);
    let e = document.createElement(tag);
    return VALUE_CONVERTER.wrapNativeHandle(e);
};
