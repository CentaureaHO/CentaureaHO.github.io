let mediaRecorder;
let audioChunks = [];

document.getElementById("startRecord").onclick = function () {
    fetch("https://frp-oak.top:29220/start", { method: "POST" })  // 修改了这里
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error starting recording:', error));
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const formData = new FormData();
                const filename = `${Date.now()}.wav`;
                formData.append("audioFile", audioBlob, filename);
                console.log("Audio chunks length:", audioChunks.length);
                fetch("https://frp-oak.top:29220/upload", { method: "POST", body: formData })  // 修改了这里
                    .then(response => {
                        if (response.ok) {
                            return response.text(); // 或者 response.json() 如果服务器响应JSON
                        }
                        throw new Error('Network response was not ok.');
                    })
                    .then(data => console.log(data))
                    .catch(error => console.error('There has been a problem with your fetch operation:', error));

            };
            mediaRecorder.start();
            document.getElementById("stopRecord").disabled = false;
        });
};

document.getElementById("stopRecord").onclick = function () {
    mediaRecorder.stop();
    document.getElementById("stopRecord").disabled = true;
    audioChunks = [];
};
