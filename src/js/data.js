

const Data = {
    get: item => window?.localStorage?.getItem(item),
    set: (item, data) => window?.localStorage?.setItem(item, data),
    remove: item => window?.localStorage?.removeItem(item)
};

export default Data;