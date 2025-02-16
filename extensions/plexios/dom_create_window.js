
// TODO: support whether or not this window's show() invocation is blocking
EXT.dom_create_window = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    let getArg = i => VALUE_CONVERTER.listGet(args[0], i);

    let title = VALUE_CONVERTER.toReadableString(getArg(0));
    let width = VALUE_CONVERTER.unwrapInteger(getArg(1));
    let height = VALUE_CONVERTER.unwrapInteger(getArg(2));
    let onInit = getArg(3);
    let onShown = getArg(4);
    let onClosed = getArg(5);
    let onClosing = getArg(6);

    // More properties and handlers needed:
    // destroy process on close
    // onResize, onFocus, onMinimized, onMaximized
    // disable resize, isManaged, innerWidth/Height, x, y, icon, parent

    OS.Shell.showWindow(procInfo.pid, {
        title,
        width,
        height,
        destroyProcessUponClose: true,
        onInit: (contentHost, winData) => {
            let wrappedContentHost = VALUE_CONVERTER.wrapNativeHandle(contentHost);
            let wrappedHandle = VALUE_CONVERTER.wrapNativeHandle(winData);
            CommonScript.task.invokeFunction(task, onInit, [wrappedContentHost, wrappedHandle]);
        },
        onShown: () => {
            console.log("Window is now shown");
        },
        onClosing: () => {
            console.log("Closing");
        },
        onClosed: () => {
            console.log("TODO: resume task");
        },
    });

    CommonScript.task.suspendTask(task);
};
