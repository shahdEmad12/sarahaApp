//.........................find document............................
export const findDocument = async (model, query)=> {
    const isDocumentExists = await model.findOne(query)
    if(!isDocumentExists) return {msg: 'document not found', status: 404, success: false}
    return { msg: 'document found', isDocumentExists, success: true}
}