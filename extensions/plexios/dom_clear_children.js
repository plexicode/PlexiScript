EXT.dom_clear_children = (task, args) => {
    let e = VALUE_CONVERTER.unwrapNativeHandle(args[0]);
    while (e.firstChild) e.removeChild(e.firstChild);
};
