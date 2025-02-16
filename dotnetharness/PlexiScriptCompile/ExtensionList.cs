namespace PlexiScriptCompile
{
    internal static class ExtensionList
    {
        public static string[] GetExtensionIds()
        {
            return [
                // %%%EXTENSION_LIST_START%%%

                "io_stdout",
                "u3_frame_new",
                "u3_client_to_renderer",
                "u3_init",
                "dom_apply_prop",
                "dom_append_string",
                "dom_create_element",
                "dom_create_window",
                "dom_clear_children",
                "game_close_window",
                "game_flip",
                "game_pop_event_from_queue",
                "game_set_title",
                "game_show_window",

                // %%%EXTENSION_LIST_END%%%
            ];
        }
    }
}
