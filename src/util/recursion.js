export function recursionLoop(array,result={}) {
    array.map(item=>{
        result[item.id]=item.name
        item.children.length && recursionLoop(item.children,result)
    })
    return result
}
