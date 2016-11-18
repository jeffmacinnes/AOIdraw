var subjID
var stimList = [];
var imgs = [];
var imgCounter;
var imgData;
var taskCanvas;
var brushSize
var brushArr = [];
var brushColor
var AOIcounter;
var AOInames = [];
var AOIguides = [];
var AOIimg;
var isAOIstarted;

// Preload Function: Runs before setup. 
function preload(){
    // Preload stim list and images
    loadTable('_images/stimList2.csv', 'header', loadStimsFromText);
}


function setup(){
    
    // set pixel density to ward off retina issues
    pixelDensity(1);
    
    //initialize brush settings
    brushSize = 20;
    brushColor = color(255, 0, 0);
    
    // Bind new canvas to parent div
    taskCanvas = createCanvas(500, 500);
    taskCanvas.parent('imageContainer');
    
    // hide certain elements at first
    $("#middleContent").hide();
    
    // Initialize task settings
    frameRate(30);              // set desired frameRate
    imgCounter = 0;             // start image counter
    showBG = false;
    AOIimg = createImage(width, height);
    isAOIstarted = false;
    AOIcounter = 0;
    AOInames = ["Left Eye", "Right Eye", "Nose", "Mouth"];
    AOIguides = ["leftEye.jpg", "rightEye.jpg", "nose.jpg", "mouth.jpg"];
}


function draw(){  
    // redraw empty canvas
    background('#FFFFFF');
    
    if (showBG == true){
        image(imgs[imgCounter])
    }
    
    //get brush size
    getBrushSize();
    
    // draw cursor
    cursor(CROSS);
    fill(brushColor);
    noStroke();
    ellipse(mouseX, mouseY, brushSize, brushSize);
    
    // Draw new brush locations
    if (mouseIsPressed){
        if ((mouseX > 0) && (mouseX <= width) && (mouseY > 0) && (mouseY <= height)){
            brushArr.push({x:mouseX, y:mouseY, s:brushSize});
            AOIimg.loadPixels();
            if (isAOIstarted == false){
                isAOIstarted = true;
            }
            
            // fill the pixels w/in radius of brush center
            for (var x = -brushSize; x <= brushSize; x++){
                for (var y = -brushSize; y <= brushSize; y++){
                    var imgX = constrain(mouseX+x, 0, width);
                    var imgY = constrain(mouseY+y, 0, height);
                    
                    // calculate distance between this pixel and brush center
                    if (dist(mouseX, mouseY, imgX, imgY) <= brushSize/2){
                        AOIimg.set(imgX, imgY, color(255,0,0,255));
                    }
                }
            }
            AOIimg.updatePixels();
        }  
    }
    
    // draw AOI
    image(AOIimg, 0, 0);
  
}


function getBrushSize(){
    var s = document.getElementById("brushSizeRange").value;
    brushSize = map(s, 0, 100, 6, 30);
}

// Start the AOI drawing
function initSettings(){
    var formData = $('form').serializeArray();
    subjID = formData[0].value;
    if (subjID == ""){
        alert("Please enter your ID");
    } else {
        // show the middle content, hide the top content
        $("#middleContent").show();
        $("#settingsDiv").hide();
        
        // show the starting background image
        imgCounter = formData[1].value - 1;
        $('#imageNumLabel').text("Image: " + (imgCounter+1));
        showBG = true;

        // update AOI guides
        AOIcounter = 0;
        $('#AOIname').text(AOInames[AOIcounter]);
        $('#AOIguide').attr("src", "AOI_guides/" + AOIguides[AOIcounter]);
    }
    resetBrush();
}


// 'N' key function for nextAOI
function keyTyped(){
    if (key === 'n'){
        nextAOI();
    }
}


// Reset Button function
function resetBrush(){
    AOIimg = createImage(width, height);
    isAOIstarted = false;
}

// next AOI button function
function nextAOI(){
    // check the AOI validity button
    var invalidAOI = document.getElementById("invalidAOI").checked;

    // make sure there's data
    if ((isAOIstarted == false) && (invalidAOI == false)) {
        alert("Please draw an AOI (or choose N/A for this AOI)");
    } else {
        
        // save the current AOI (if valid)
        if (invalidAOI == false){
            sendToServer(subjID, imgCounter, AOIcounter, AOIimg)  
        }
        
        // increment AOI
        AOIcounter ++;
        if (AOIcounter >= AOInames.length){
            // move to next image
            imgCounter ++
            $('#imageNumLabel').text("Image: " + (imgCounter+1));
            if (imgCounter >= imgs.length){
                alert('All Done!')
                $("#middleContent").hide();
            }
            AOIcounter = 0;
        }

        // update AOI name and guide
        $('#AOIname').text(AOInames[AOIcounter]);
        $('#AOIguide').attr("src", "AOI_guides/" + AOIguides[AOIcounter]);
        
        // reset invalid AOI checkbox
        if (invalidAOI == true){
            document.getElementById("invalidAOI").checked = false;
        }
        
        // reset the brush
        resetBrush();
    }   
}


// Write the data to the server
function sendToServer(id, imgNum, AOInum, AOI_image){
    //figure out AOI name
    var AOIname;
    if (AOInum == 0){
        AOIname = 'leftEye';
    } else if (AOInum == 1){
        AOIname = 'rightEye';
    } else if (AOInum == 2){
        AOIname = 'nose';
    } else if (AOInum == 3){
        AOIname = 'mouth';
    } else {
        alert("Invalid AOI Number");
    }
    
    // load pixels before writing
    //AOIimg.loadPixels();
    
    //console.log(AOIimg.imageData)
    var AOIimgURL = AOIimg.canvas.toDataURL('image/png');
    
    $.ajax({
        url: "scripts/saveImg.php",
        type: "post",
        data: {subjID: id, imgNum: imgNum, AOIname: AOIname, imgDataURL: AOIimgURL},
        dataType: "json"
    });
}

//************ Preload the stimuli named in the text file
function loadStimsFromText(stimText){
    nTrials = stimText.getRowCount();
    for (i=0; i<nTrials; i++){
        var stimName = '_images/' + stimText.getString(i,1);
        stimList[i] = stimName;
        imgs[i] = loadImage(stimName);
    }
}




