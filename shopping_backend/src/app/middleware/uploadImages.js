const multer = require('multer')
const cloudinary = require('../../config/cloudinary/cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Hàm để tạo đối tượng CloudinaryStorage
function createStorage(folder) {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowedFormats: ['jpg', 'png', 'jpeg'],
    },
  })
}

// Đối tượng lưu trữ cho avatar cửa hàng
const shopAvatarStorage = createStorage('shopping-nodejs/shop-avatar')
const uploadShopToCloud = multer({ storage: shopAvatarStorage })

// Đối tượng lưu trữ cho avatar người dùng
const userAvatarStorage = createStorage('shopping-nodejs/user-avatar')
const uploadUserToCloud = multer({ storage: userAvatarStorage })

module.exports = { uploadShopToCloud, uploadUserToCloud }
