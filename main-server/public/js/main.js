/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;
var countdown = null;
var limitSeconds = 30;
var audio;
var programId = 0;
var musicList = {};

/* TODO:

- offer mono option
- "Monitor input" switch
*/

var sendAudio = function() {
    audioRecorder.exportWAV( sendToServer );
};

var sendToServer = function(blob) {
    if (blob.size < 100) {
        alert('record audio before send');
        $('#send').removeAttr('disabled');
        return;
    }

    var fd = new FormData();
    fd.append("file", blob);
    fd.append("programId", programId);

    $.ajax({
        url: "/record",
        data: fd,
        processData: false,
        contentType: false,
        type: "POST",
        success: function(resp) {
            $('#send').removeAttr('disabled');
            console.log('success');
            playAudioWithTrack(resp._id);
        }
    });
};

var playAudioWithTrack = function(trackId) {
    audio = new Audio('http://211.78.254.238/track/' + trackId);
    audio.play();
};

var playAudio = function() {
    if (audio) audio.play();
    else alert('upload audio before play');
}

function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
}


function drawBuffer( width, height, context, data ) {
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    context.fillStyle = "silver";
    for(var i=0; i < width; i++){
        var min = 1.0;
        var max = -1.0;
        for (j=0; j<step; j++) {
            var datum = data[(i*step)+j];
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    }
}

function drawWave( buffers ) {
    var canvas = document.getElementById("wavedisplay");
    drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
}

function doneEncoding( blob ) {
    Recorder.forceDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;
}

function toggleRecording( e ) {
    if (e.classList.contains("recording")) {
        // stop recording
        audioRecorder.stop();
        e.classList.remove("recording");
        audioRecorder.getBuffer( drawWave );

        clearInterval(countdown);
    } else {
        // start recording
        if (!audioRecorder) return;
        e.classList.add("recording");
        audioRecorder.clear();
        audioRecorder.record();
        var i = 0;
        countdown = setInterval(function() {
            $('#countdown').html(++i);
            if (i>=limitSeconds) {
                clearInterval(countdown);
                toggleRecording(e);
            }
        }, 1000);
    }
}

function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}

function cancelAnalyserUpdates() {
    window.cancelAnimationFrame( rafID );
    rafID = null;
}

function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 3;
        var BAR_WIDTH = 1;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

        analyserNode.getByteFrequencyData(freqByteData);

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#F6D565';
        analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;

        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            var offset = Math.floor( i * multiplier );
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 0; j< multiplier; j++)
                magnitude += freqByteData[offset + j];
            magnitude = magnitude / multiplier;
            var magnitude2 = freqByteData[i * multiplier];
            analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
            analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
        }
    }

    rafID = window.requestAnimationFrame( updateAnalysers );
}

function toggleMono() {
    if (audioInput != realAudioInput) {
        audioInput.disconnect();
        realAudioInput.disconnect();
        audioInput = realAudioInput;
    } else {
        realAudioInput.disconnect();
        audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
}

function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
}

function initAudio() {
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia({audio:true}, gotStream, function(e) {
        alert('Error getting audio');
        console.log(e);
    });
}

window.addEventListener('load', initAudio );

$(function() {
    $('#save').on('click', function() {
        saveAudio();
    });

    $('#send').on('click', function() {
        if (audioRecorder) {
            sendAudio();
            $('#send').attr('disabled', 'disabled');
        }
    });

    $('#playaudio').on('click', function() {
        playAudio();
    });

    $('#filesToUpload').on('change', function(evt) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var files = evt.target.files;

            var result = '';
            var file;
            for (var i = 0; file = files[i]; i++) {
                // if the file is not an image, continue
                if (!file.type.match('image.*')) {
                    continue;
                }

                reader = new FileReader();
                reader.onload = (function (tFile) {
                    return function (evt) {
                        var div = document.createElement('div');
                        div.innerHTML = '<img style="width: 90px;" src="' + evt.target.result + '" />';
                        document.getElementById('filesInfo').appendChild(div);
                    };
                }(file));
                reader.readAsDataURL(file);
            }
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    });

    $('#imageForm').on('submit', function(e) {
        e.preventDefault();

        var file = $('#filesToUpload')[0].files[0];
        if (file && file.type.match('image.*')) {
            var fd = new FormData(this);
                // console.log(fd);
                // fd.append("file", blob);
            fd.append("programId", programId);

            $.ajax({
                url: "/image",
                data: fd,
                processData: false,
                contentType: false,
                type: "POST",
                success: function(resp) {
                    // $('#send').removeAttr('disabled');
                    console.log('success');
                    // playAudioWithTrack(resp._id);
                }
            });

        }
    });

    $.post('/program', function(resp) {
        programId = resp.program._id;
        console.log("program prepared");
    });

    $.get('/json/music.json', function(resp) {
        musicList = resp.data;

        var html = '';
        for (i in musicList) {
            html += '<button class="btn btn-default musicBtn" type="button" data-id="' + musicList[i].id + '"> ' + musicList[i].name + '</button>';
        }
        $('#musicList').html(html);
        $('.musicBtn').on('click', function() {
            $('.musicBtn').removeClass('btn-info');
            $(this).addClass('btn-info');

            $.post('/music', { programId: programId, musicId: $(this).data('id') }, function(resp) {
                console.log(resp);
            });

            $('#musicSource').attr('src', 'http://211.78.254.238/track/' + $(this).data('id'));
            $('#musicPreview')[0].load();
            $('#musicPreview')[0].play();
        });
    });

});
