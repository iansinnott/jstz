declare namespace jstz {
    class TimeZone {
        name():string;
    }
    function determine(): TimeZone;
    namespace olson {
        const timezones: {
            [key: string]: string
        }
    }
}

declare module "jstz" {
    export = jstz;
}
