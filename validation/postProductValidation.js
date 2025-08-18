const joi = require('joi')


function validationPostProduct(obj){
    const schema = joi.object({
        product_name:joi.string().min(3).max(100).trim().required(),
        product_description:joi.string().required().trim().min(3).max(200),
        quantity :joi.number().min(0).required(),
        price:joi.number().required().min(0),
        categoryId :joi.object().required()
    });
    return schema.validate(obj)
}
module.exports=validationPostProduct;