// //import collection (Course) in mongoDB compass => Course export model (Schema)
const cloudinary = require("../../config/cloudinary/cloudinary");
const { StatusCodes } = require("http-status-codes");
const responseFormat = require("../../util/responseFormat.js");

class ImgsController {
    //[POST] /
    async uploadImages(req, res, next) {
        // try {
        //     const images = req.files.map(file => file.path)

        //     const uploadedImages = []

        //     for (let image of images){
        //         const results = await cloudinary.uploader.upload(image)
        //         console.log(results)
        //         uploadedImages.push({
        //             url: results.secure_url,
        //             publicId: results.public_id
        //         })
        //     }
        //     // console.log(images)
        //     return res.status(StatusCodes.OK).json(responseFormat(true, {
        //         message: `upload image successfully!!!`
        //     },uploadedImages))
        // } catch (error) {
        //     return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        //         message: `Co loi o server uploadedImages`,
        //     }))
        // }

        const link_img = req.files["image"][0];
        return res.status(StatusCodes.OK).json(
            responseFormat(
                true,
                {
                    message: `upload image successfully!!!`,
                },
                link_img
            )
        );
    }

    //[DELETE] /
    async removeImages(req, res, next) {
        try {
            const publicId = req.params.publicId;
            const urlArray = publicId.split('/');
            const image = `${urlArray[urlArray.length - 3]}/${urlArray[urlArray.length - 2]}/${urlArray[urlArray.length - 1]}`
            const imageName = image.split('.')[0]

            cloudinary.api.delete_resources([imageName], (error, result) => {
                if (error) {
                    console.error('Lỗi khi xóa ảnh:', error);
                } else {
                    console.log('Xóa ảnh thành công:', result);
                }
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json(
                responseFormat(false, {
                    message: `Co loi o server removeImages`,
                    error: error,
                })
            );
        }
    }
}

module.exports = new ImgsController();
