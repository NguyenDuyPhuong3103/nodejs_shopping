module.exports = function getFileName(url) {
  const urlArray = url.split('/');
  const urlCut = `${urlArray[urlArray.length - 3]}/${urlArray[urlArray.length - 2]}/${urlArray[urlArray.length - 1]}`
  const fileName = urlCut.split('.')[0]
  return fileName;
}
