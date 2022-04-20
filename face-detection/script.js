const video = document.getElementById('video')

// function startVideo() {
//     navigator.mediaDevices.getUserMedia(
//       { video: {audio: false, video: true} },
//       stream => video.srcObject = stream,
//       err => console.error(err)
//     )
// }

function startVideo() {
    navigator.mediaDevices.getUserMedia({
        video: { 
            audio: false,
            facingMode: "environment",
            video: true,
            autoplay: true
        }
    })
}

//video.srcObject = mediaStream;
//video.autoplay = true;

startVideo()