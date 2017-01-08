declare namespace jstz {
    class TimeZone {
        name();
    }
    function determine(): TimeZone;
}

declare module "jstz" {
    export = jstz;
}