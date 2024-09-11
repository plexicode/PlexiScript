using CommonScript.Runtime;

namespace PlexiScriptRuntime
{
    public class PlexiRuntime
    {
        private RuntimeContext ctx;

        public PlexiRuntime(byte[] bytecode, string[] cliArgs)
        {
            this.ctx = new RuntimeContext(
                "PlexiScript",
                "0.1.0", // TODO: this needs to be injected
                bytecode,
                new Extensions().BuildExtensionLookup(),
                cliArgs);
        }

        public void Run()
        {
            TaskResult taskResult = this.ctx.StartMainTask();
            while (taskResult.Status != TaskResultStatus.DONE)
            {
                switch (taskResult.Status)
                {
                    case TaskResultStatus.SLEEP:
                        System.Threading.Thread.Sleep(taskResult.SleepMillis);
                        taskResult = this.ctx.MainTask.Resume();
                        break;
                    case TaskResultStatus.SUSPEND:
                        // TODO: this needs to be an event loop with a task queue.
                        return;
                    case TaskResultStatus.ERROR:
                        System.Console.WriteLine(string.Join("\n", taskResult.ErrorMessage));
                        return;
                    default:
                        throw new InvalidOperationException();
                }
            }
        }
    }
}
