const video = document.getElementById('video')
const mainEl = document.getElementById('main')
const emotionSpan = document.getElementById('emotion')



    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models')
    ]).then(startVideo)


function startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            video.srcObject = stream;
          })
          .catch(function (err0r) {
            console.log("Something went wrong!");
          });
      }
}

//startVideo()
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    main.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) // creer een neiuwe canavs elke keer
      faceapi.draw.drawDetections(canvas, resizedDetections) //teken op het canvas het blauwe vierkant en detecteer een gezicht
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) //de landmarks zijn de lijntjes op het gezicht
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections) //laat de emotie zien van het gezicht
      //console.log(detections)
      const expressions = detections[0]['expressions']
    //   if(detections){
    //   console.log(detections[0]['expressions'])
    //   }

        let max = 0;
        let maxKey = "";

        for(let express in expressions){
        if(expressions[express]> max){
            max = expressions[express];
            maxKey= express
            }
        }
        emotionSpan.innerHTML=maxKey
        //console.log(maxKey)

     // console.log(Object.entries(expressions))
      // console.log(expressions)
      
    }, 4000)
  })