EXT["io_stdout"] = (object task, object[] args) => {
    System.Console.WriteLine(CommonScript.Runtime.ValueConverter.RTValueToReadableString(args[0]));
    return null;
};
