$(function(){
  var imgWrapEle = $('#imgWrap')
  var multipleFileEle = $('#multipleFile')
  var messageEle = $('#message')
  var allImgNames = []
  var categoryImgList = []
  var uniqueCategoryImgList = []
  var categoryImgListObj = {}
  var submitFlag = false

  // 清空所有图片
  $('#clear').click(function () {
    $('#imgWrap').html('')
    multipleFileEle.value = ''
    $('#chooseFile').html('请上传文件')
    allImgNames = []
    categoryImgList = []
    uniqueCategoryImgList = []
    categoryImgListObj = {}
  })

  $('#zoomBigImg').click(function () {
    zoomImg('big')
  })

  $('#zoomSmallImg').click(function () {
    zoomImg('small')
  })
  
  function zoomImg(params) {
    const liList = $("li")
    for (let index = 0; index < liList.length; index++) {
      liList[index].setAttribute("class",params);
    }
  }

  $('#multipleFile').change(function (ev) {
    console.log('ev', ev);
    //判断 FileReader 是否被浏览器所支持
    if (!window.FileReader) return;
    var fileList = ev.target.files;  
    console.log('fileList', fileList);
    Object.getOwnPropertyNames(fileList).forEach(function(key){
      var fileName = fileList[key].name
      if (!allImgNames.includes(fileName)) {
        printImg(fileList[key])
      }
      categoryImgList.push(fileName.split('_')[0])
      allImgNames.push(fileName)
    });
    console.log('categoryImgList', categoryImgList);
    
    $('#chooseFile').html('共上传' + categoryImgList.length + '个文件')
    uniqueCategoryImgList = unique(categoryImgList)
    for (let index = 0; index < uniqueCategoryImgList.length; index++) {
      const element = uniqueCategoryImgList[index];
      if (!categoryImgListObj[element]) {
        categoryImgListObj[element] = randomStr()
      }
    }
    ev.target.value = ''
  })

  function unique(arr) {
    if (!Array.isArray(arr)) return
    var array = []
    for (var uindex = 0; uindex < arr.length; uindex++) {
      if (!array.includes(arr[uindex])) {
        array.push(arr[uindex])
      }
    }
    return array
  }


  function printImg(file) {
    if(!file.type.match('image/*')){
      alert('上传的图片必须是png,gif,jpg格式！');
      ev.target.value = ""; //显示文件的值赋值为空
      return;
    }
    var reader = new FileReader();  // 创建FileReader对象
    reader.readAsDataURL(file); // 读取file对象，读取完毕后会返回result 图片base64格式的结果
    reader.onload = function(e) {
      drawToImg(this.result, file.name);
    }
  }

  function drawToImg(result, name) {
    var imgClassName = categoryImgListObj[name.split('_')[0]]
    var ulEle
    if (document.getElementsByClassName(imgClassName)[0]) {
      ulEle = document.getElementsByClassName(imgClassName)[0]
    } else {
      ulEle = document.createElement('ul')
    }
    var liEle = document.createElement('li')
    var imgEle = document.createElement('img')
    var spanEle = document.createElement('p')
    ulEle.setAttribute('class', imgClassName)
    liEle.setAttribute('class', 'small')
    imgEle.setAttribute('class', 'imgFlag')
    spanEle.setAttribute("style", "white-space: nowrap;width: 200px;overflow: hidden;text-overflow: ellipsis;font-size: 12px; height: 20px");
    imgEle.src = result
    spanEle.innerHTML = name
    ulEle.appendChild(liEle)
    liEle.appendChild(imgEle)
    liEle.appendChild(spanEle)
    imgWrapEle.append(ulEle)
  }

  function randomStr() {
    return Math.random().toString(36).slice(-8)
  }

  $('#imgWrap').click(function (event) {
    event = event || window.event;
    const imgSrc = event && event.target && event.target.currentSrc
    var target = event.target || event.srcElement;
    var imgParentNode = target.parentNode
    window.imgIndex = Array.prototype.slice.call($('img')).indexOf(event.target)
    if (target.tagName === 'IMG' && imgParentNode.tagName === 'LI') {
      const contentHtml = `
        <div class="modal-dialog-content" id="modal-dialog-content">
          <img id="modal-img" class="modal-img" src=${imgSrc} alt="大图" />
          <div>
            <button id="prev-button">上一个</button>
            <button class="close-button">X</button>
            <button id="next-button">下一个</button>
          </div>
        </div
      `;
      showModa(contentHtml)
    }
  })
  
  // 提交所有数据
  $("#submit").click(function() {
    console.log('ubmits');
    if (submitFlag) return
    submitFlag = true
    var formData = new FormData();
    var files = $('#multipleFile')[0]
    for(var index = 0; index < files.length; index++) {
      formData.append("file", files[index]);
    }
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          console.log(xhr.responseText);
          $('#message').html('提交成功，3秒后消失').attr('style', 'color: green')
          setTimeout(() => {
            messageEle.remove()
          }, 3000);
          submitFlag = false
        } else {
          $('#message').html('提交失败，3秒后消失').attr('style', 'color: red')
          setTimeout(() => {
            messageEle.remove()
          }, 3000);
          submitFlag = false
        }
      }
    }
    xhr.open('POST', 'http://139.199.18.143:8080/upload')
    xhr.send(formData)
  });

  function showModa(contentHtml) {
    const layerEle = document.createElement('div');
    layerEle.setAttribute('class', 'modal-layer');
    const contentContainerEle = document.createElement('div');
    contentContainerEle.setAttribute('class', 'modal-dialog-container');
    contentContainerEle.innerHTML = contentHtml;
    layerEle.appendChild(contentContainerEle);
    document.body.appendChild(layerEle);
    $('.modal-img').attr({ height: window.innerHeight*0.85 });
  }
  // 关闭
  $(document).on('click','.close-button',function(){
    $('.modal-layer').remove()
  });
  // 上一个
  $(document).on('click','#prev-button',function(){
    var imgIndex = -- window.imgIndex
    if (imgIndex >= 0) {
      var imgSrc = Array.prototype.slice.call($('.imgFlag'))[imgIndex].currentSrc
      $('#modal-img').attr('src', imgSrc)
    } else {
      ++ window.imgIndex
    }
  });

  // 下一个
  $(document).on('click','#next-button',function(){
    var imgIndex = ++ window.imgIndex
    var imgLength =  Array.prototype.slice.call($('.imgFlag')).length
    if (imgIndex < imgLength) {
      var imgSrc = Array.prototype.slice.call($('.imgFlag'))[imgIndex].currentSrc
      $('#modal-img').attr('src', imgSrc)
    } else {
      -- window.imgIndex
    }
  });
});