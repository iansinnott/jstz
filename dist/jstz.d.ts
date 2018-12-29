declare namespace jstz {
    class TimeZone {
        name():string;
        stdTimezoneOffset():number;
        timezoneOffset():number;
    }

    function determine(): TimeZone;
    
    //this is not actualy exposed by the library so probably don't need to be in the spec
    // namespace olson {
    //     const timezones: {
    //         [key: string]: string
    //     }
    // }
}

declare module "jstz" {
    export = jstz;
}
