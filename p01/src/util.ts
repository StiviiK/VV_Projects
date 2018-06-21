// Implements a "throttle" for async functions
export const sleep = (sleepInMs: number): Promise<any> => {
    return new Promise((resolve) => setTimeout(resolve, sleepInMs));
};

// Implementation of Array.prototype.forEach but callback is executed asynchronously
export const asyncForEach = async (array: any[], callback: (element, index, array)  => void) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};
