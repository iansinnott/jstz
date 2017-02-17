declare namespace jstz {
    class TimeZone {
        name():string;
    }
    function determine(): TimeZone;
}

declare module "jstz" {
    export = jstz;
}
