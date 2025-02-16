EXT.dom_append_string = (task, args) => {
    let e = VALUE_CONVERTER.unwrapNativeHandle(args[0]);
    let str = VALUE_CONVERTER.toReadableString(args[1]);
    e.append(str);
};
