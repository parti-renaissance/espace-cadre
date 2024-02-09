/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/**
 *
 * @author Onur Zorluer
 *
 */
export var Resizer = /** @class */ (function () {
  function Resizer() {}
  Resizer.changeHeightWidth = function (height, maxHeight, width, maxWidth, minWidth, minHeight) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width)
      width = maxWidth
    }
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height)
      height = maxHeight
    }
    if (minWidth && width < minWidth) {
      height = Math.round((height * minWidth) / width)
      width = minWidth
    }
    if (minHeight && height < minHeight) {
      width = Math.round((width * minHeight) / height)
      height = minHeight
    }
    return { height: height, width: width }
  }
  Resizer.resizeAndRotateImage = function (
    image,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    compressFormat,
    quality,
    rotation
  ) {
    if (compressFormat === void 0) {
      compressFormat = 'jpeg'
    }
    if (quality === void 0) {
      quality = 100
    }
    if (rotation === void 0) {
      rotation = 0
    }
    var qualityDecimal = quality / 100
    var canvas = document.createElement('canvas')
    var width = image.width
    var height = image.height
    var newHeightWidth = this.changeHeightWidth(height, maxHeight, width, maxWidth, minWidth, minHeight)
    if (rotation && (rotation === 90 || rotation === 270)) {
      canvas.width = newHeightWidth.height
      canvas.height = newHeightWidth.width
    } else {
      canvas.width = newHeightWidth.width
      canvas.height = newHeightWidth.height
    }
    width = newHeightWidth.width
    height = newHeightWidth.height
    var ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'
    ctx.fillRect(0, 0, width, height)
    if (ctx.imageSmoothingEnabled && ctx.imageSmoothingQuality) {
      ctx.imageSmoothingQuality = 'high'
    }
    if (rotation) {
      ctx.rotate((rotation * Math.PI) / 180)
      if (rotation === 90) {
        ctx.translate(0, -canvas.width)
      } else if (rotation === 180) {
        ctx.translate(-canvas.width, -canvas.height)
      } else if (rotation === 270) {
        ctx.translate(-canvas.height, 0)
      } else if (rotation === 0 || rotation === 360) {
        ctx.translate(0, 0)
      }
    }
    ctx.drawImage(image, 0, 0, width, height)
    return canvas.toDataURL('image/'.concat(compressFormat), qualityDecimal)
  }
  Resizer.b64toByteArrays = function (b64Data, contentType) {
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unused-vars
    contentType = contentType || 'image/jpeg'
    var sliceSize = 512
    var byteCharacters = atob(b64Data.toString().replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ''))
    var byteArrays = []
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize)
      var byteNumbers = new Array(slice.length)
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      var byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    return byteArrays
  }
  Resizer.b64toBlob = function (b64Data, contentType) {
    var byteArrays = this.b64toByteArrays(b64Data, contentType)
    var blob = new Blob(byteArrays, { type: contentType, lastModified: new Date() })
    return blob
  }
  Resizer.b64toFile = function (b64Data, fileName, contentType) {
    var byteArrays = this.b64toByteArrays(b64Data, contentType)
    var file = new File(byteArrays, fileName, { type: contentType, lastModified: new Date() })
    return file
  }
  Resizer.createResizedImage = function (
    file,
    maxWidth,
    maxHeight,
    compressFormat,
    quality,
    rotation,
    responseUriFunc,
    outputType,
    minWidth,
    minHeight
  ) {
    if (outputType === void 0) {
      outputType = 'base64'
    }
    if (minWidth === void 0) {
      minWidth = null
    }
    if (minHeight === void 0) {
      minHeight = null
    }
    var reader = new FileReader()
    if (file) {
      if (file.type && !file.type.includes('image')) {
        throw Error('File Is NOT Image!')
      } else {
        reader.readAsDataURL(file)
        reader.onload = function () {
          var image = new Image()
          image.src = reader.result
          image.onload = function () {
            var resizedDataUrl = Resizer.resizeAndRotateImage(
              image,
              maxWidth,
              maxHeight,
              minWidth,
              minHeight,
              compressFormat,
              quality,
              rotation
            )
            var contentType = 'image/'.concat(compressFormat)
            switch (outputType) {
              case 'blob':
                var blob = Resizer.b64toBlob(resizedDataUrl, contentType)
                responseUriFunc(blob)
                break
              case 'base64':
                responseUriFunc(resizedDataUrl)
                break
              case 'file':
                var fileName = file.name
                var fileNameWithoutFormat = fileName.toString().replace(/(png|jpeg|jpg|webp)$/i, '')
                var newFileName = fileNameWithoutFormat.concat(compressFormat.toString())
                var newFile = Resizer.b64toFile(resizedDataUrl, newFileName, contentType)
                responseUriFunc(newFile)
                break
              default:
                responseUriFunc(resizedDataUrl)
            }
          }
        }
        reader.onerror = function (error) {
          throw Error(error)
        }
      }
    } else {
      throw Error('File Not Found!')
    }
  }
  return Resizer
})()

Resizer.imageFileResizer = function (
  file,
  maxWidth,
  maxHeight,
  compressFormat,
  quality,
  rotation,
  responseUriFunc,
  outputType,
  minWidth,
  minHeight
) {
  return Resizer.createResizedImage(
    file,
    maxWidth,
    maxHeight,
    compressFormat,
    quality,
    rotation,
    responseUriFunc,
    outputType,
    minWidth,
    minHeight
  )
}
