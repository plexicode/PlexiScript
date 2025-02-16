EXT.dom_append_item = (task, args) => {
    let e = VALUE_CONVERTER.unwrapNativeHandle(args[0]);
    let o = VALUE_CONVERTER.unwrapNativeHandle(args[1]);
    e.append(o);
};
