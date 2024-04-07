
$("#error").hide();
$("#resultHolder").hide();
const dropArea = document.getElementById('drop-area');
const inputFile = document.getElementById('input-file');
const imageView = document.getElementById('img-view');

inputFile.addEventListener('change', uploadImage);
function uploadImage(file) {
    console.log('uploadImage function called');
    const imgLink = URL.createObjectURL(inputFile.files[0]);
    console.log('Image URL:', imgLink);
    imageView.style.backgroundImage = `url("${imgLink}")`;
    imageView.textContent = "";
    imageView.style.border = 0;
     if (inputFile.files.length > 0) {
        const file = inputFile.files[0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            reader.onload = function () {
                const imageData = reader.result;
                sendImageToServer(imageData);
            }
            reader.readAsDataURL(file);
        } else {
            console.error('Invalid file type:', file);
        }
    } else {
        console.error('No file selected.');
    }
}
dropArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    console.log('Dragover event fired');
});
function sendImageToServer(imageData) {
    const url = "http://127.0.0.1:5000/"; // Replace with your Flask route URL
    const formData = new FormData();
    formData.append('image_data', imageData);

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (!data || data.length === 0) {
            $("#resultHolder").hide();
            $("#divClassTable").hide();
            $("#error").show();
            return;
        }

        let players = ["lionel_messi", "maria_sharapova", "roger_federer", "serena_williams", "virat_kohli"];
        let match = null;
        let bestScore = -1;
        for (let i = 0; i < data.length; ++i) {
            let maxScoreForThisClass = Math.max(...data[i].class_probability);
            if (maxScoreForThisClass > bestScore) {
                match = data[i];
                bestScore = maxScoreForThisClass;
            }
        }

        if (match) {
            $("#error").hide();
            $("#resultHolder").show();
            $("#divClassTable").show();
            $("#resultHolder").html($(`[data-player="${match.class}"]`).html());
            let classDictionary = match.class_dictionary;
            for (let personName in classDictionary) {
                let index = classDictionary[personName];
                let probabilityScore = match.class_probability[index];
                let elementName = "#score_" + personName;
                $(elementName).html(probabilityScore);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
dropArea.addEventListener('drop', function(e) {
    e.preventDefault();
    console.log('Drop event fired');
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files);
    if (files.length > 0) {
        inputFile.files = new DataTransfer().files;
        Array.from(files).forEach(file => inputFile.files.add(file));
        uploadImage(); // Call uploadImage without any arguments
    }
});
