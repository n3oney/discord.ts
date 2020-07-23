import camelCase from "https://deno.land/x/case/camelCase.ts";

export function snakeToCamel(object: any): any {
    const changeArray = (a: any[]): any[] => {
        let newA: any[] = [];

        for(let key in a) {
            if(Array.isArray(a[key])) {
                newA[key] = changeArray(a[key]);
            } else if(typeof a[key] === "object" && a[key] !== null) {
                newA[key] = changeObject(a[key]);
            } else newA[key] = a[key];
        }

        return newA;
    }

    const changeObject = (o: any): any => {
        let newO: any = {};

        for (let key of Object.keys(o)) {
            if(Array.isArray(o[key])) {
                newO[camelCase(key)] = changeArray(o[key]);
            } else if(typeof o[key] === "object" && o[key] !== null) {
                newO[camelCase(key)] = changeObject(o[key]);
            } else newO[camelCase(key)] = o[key];
        }

        return newO;
    }

    return changeObject(object);
}
