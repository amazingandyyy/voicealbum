$(function() {
    console.log('jquery started');
    Webcam.set({
        width: 240,
        height: 180,
        image_format: 'jpeg',
        jpeg_quality: 90,
       force_flash: false
    });
    Webcam.attach('#my_camera');
    $('#takePhoto').click(take_snapshot);

    function take_snapshot() {
        // take snapshot and get image data
        Webcam.snap(function(data_uri) {

            var base64Image = data_uri.split("data:image/jpeg;base64,")[1];
            // display results in page
            document.getElementById('results').innerHTML =
                '<img src="' + data_uri + '"/>';
            var byteCharacters = atob(base64Image);
            console.log('data_uri: ', data_uri);
            console.log('byteCharacters: ', byteCharacters);
            console.log('base64Image: ', base64Image);
            $.ajax({
                 type: "POST",
                url: "/api/webcam",
                data: `${data_uri}`,
                success: function(result) {
                    $("#div1").html(result);
                }
            });
        });
    }

    var myInput = document.getElementById('myFileInput');

    function sendPic() {
        var file = myInput.files[0];
        console.log('file: ', file);
        // Send file here either by adding it to a `FormData` object
        // and sending that via XHR, or by simply passing the file into
        // the `send` method of an XHR instance.
    }

    $(document).keydown(function(event){
        console.log('key from jquery: ', event.keyCode);
        if(event.keyCode == 70){
            console.log('yeah');
            // var sharingURL = $(".fbshareBtn a").attr('href');
            // console.log('$fbSHaring: ', sharingURL);
            // $.post(`${sharingURL}`);
            $(".fbshareBtn").find('.fa-facebook').click();
        }
    });
    $(".fbshareBtn").click(function(){
        console.log('fbshareBtn clicked by jquery');
    })


});
