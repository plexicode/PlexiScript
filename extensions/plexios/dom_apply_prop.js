EXT.dom_apply_prop = (task, args) => {
    let e = VALUE_CONVERTER.unwrapNativeHandle(args[0]);
    let key = VALUE_CONVERTER.toReadableString(args[1]);
    let isFn = VALUE_CONVERTER.unwrapNativeHandle(args[3]);
    let fnOrStr = args[2];

    let fireValue = (wrappedArgs) => {
        if (!isFn) throw new Error();
        CommonScript.task.invokeFunction(task, fnOrStr, wrappedArgs);
    };
    switch (key) {
        case 'onClick':
            e.addEventListener('click', () => {
                fireValue([]);
            });
            break;

        case 'onTextChanged':
            {
                let lastFire = '';
                let getValue = () => e.value;
                let maybeFire = () => {
                    let newValue = getValue();
                    if (lastFire !== newValue) {
                        lastFire = newValue;
                        fireValue([VALUE_CONVERTER.wrapString(task, lastFire, false)]);
                    }
                };
                e.addEventListener('keydown', () => maybeFire());
                e.addEventListener('change', () => maybeFire());
            }
            break;

        default:
            if (isFn) throw new Error();
            e.style[key] = VALUE_CONVERTER.toReadableString(fnOrStr);
            break;
    }
};
