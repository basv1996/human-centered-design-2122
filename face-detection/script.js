const video = document.getElementById('video')

// function startVideo() {
//     navigator.mediaDevices.getUserMedia(
//       { video: {audio: false, video: true} },
//       stream => video.srcObject = stream,
//       err => console.error(err)
//     )
// }

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

//video.srcObject = mediaStream;
//video.autoplay = true;

startVideo()