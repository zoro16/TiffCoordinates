  $(document).ready(function () {

    var fileTypes = ['tiff', 'tif']; //acceptable file types
    $("input:file").change(function(evt) {
      var tgt = evt.target || window.event.srcElement,
	  files = tgt.files;
      // FileReader support
      if (FileReader && files && files.length) {
	var fr = new FileReader();
	var extension = files[0].name.split('.').pop().toLowerCase();
	var tif = false;
	if (extension == "tiff" || extension == "tif")
	  tif = true;
	fr.onload = function(e) {
	  success = fileTypes.indexOf(extension) > -1;
	  if (success) {
	    if (tif) {
	      //Using tiff.min.js library - https://github.com/seikichi/tiff.js/tree/master
	      console.debug("Parsing TIFF image...");
	      //initialize with 100MB for large files
	      Tiff.initialize({
		TOTAL_MEMORY: 900000000
	      });
	      var tiff = new Tiff({
		buffer: e.target.result
	      });
	      var tiffCanvas = tiff.toCanvas();

	      var image = convertCanvasToImage(tiffCanvas);

	      document.getElementById("pngImg").appendChild(image);
	      
	    } else {
	      console.debug("render immmm");
	    }
	  }

	}

	fr.onloadend = function(e) {
	  console.debug("Load End");
	}
	if (tif)
	  fr.readAsArrayBuffer(files[0]);
	else
	  fr.readAsDataURL(files[0]);
      }

    });


    
    $('img').selectAreas({
      minSize: [1, 1],
      onChanged: debugQtyAreas,
    });				 

    
    $('#btnView').click(function () {
      var areas = $('img').selectAreas('areas');
      displayAreas(areas);
    });
    $('#btnViewRel').click(function () {
      var areas = $('img').selectAreas('relativeAreas');
      displayAreas(areas);
    });
    $('#btnReset').click(function () {
      output("reset")
      $('img').selectAreas('reset');
    });
    $('#btnDestroy').click(function () {
      $('img').selectAreas('destroy');

      output("destroyed")
      $('.actionOn').attr("disabled", "disabled");
      $('.actionOff').removeAttr("disabled")
    });
    $('#btnCreate').attr("disabled", "disabled").click(function () {
      $('img').selectAreas({
	minSize: [1, 1],
	onChanged : debugQtyAreas,
	width: 500,
      });

      output("created")
      $('.actionOff').attr("disabled", "disabled");
      $('.actionOn').removeAttr("disabled")
    });
    $('#btnNew').click(function () {
      var areaOptions = {
	x: Math.floor((Math.random() * 200)),
	y: Math.floor((Math.random() * 200)),
	width: Math.floor((Math.random() * 100)) + 50,
	height: Math.floor((Math.random() * 100)) + 20,
      };
      output("Add a new area: " + areaToString(areaOptions))
      $('img').selectAreas('add', areaOptions);
    });
    $('#btnNews').click(function () {
      var areaOption1 = {
	x: Math.floor((Math.random() * 200)),
	y: Math.floor((Math.random() * 200)),
	width: Math.floor((Math.random() * 100)) + 50,
	height: Math.floor((Math.random() * 100)) + 20,
      }, areaOption2 = {
	x: areaOption1.x + areaOption1.width + 10,
	y: areaOption1.y + areaOption1.height - 20,
	width: 50,
	height: 20,
      };
      output("Add a new area: " + areaToString(areaOption1) + " and " + areaToString(areaOption2))
      $(tiffCanvas).selectAreas('add', [areaOption1, areaOption2]);
    });

    $("#saveBtn").click(function() {
      var areas = $('img').selectAreas('areas');
      var coordinates = [];
      $.each(areas, function (id, area) {
	// console.log(area.id + ": X: " + area.x);
	// console.log(area.id + ": Y: " + area.y);
	coordinates.push({areaId: area.id, x: area.x, y: area.y});
      });

      //console.log(JSON.stringify(coordinates));
      save(JSON.stringify(coordinates));

    });
    
    var selectionExists;

    function convertCanvasToImage(canvas) {
      var image = new Image();
      image.src = canvas.toDataURL("image/png");
      return image;
    }
    function areaToString (area) {
      return (typeof area.id === "undefined" ? "" : (area.id + ": ")) + area.x + ':' + area.y  + ' ' + area.width + 'x' + area.height + '<br />'
    }

    function output (text) {
      $('#output').html(text);
    }

    // Log the quantity of selections
    function debugQtyAreas (event, id, areas) {
      console.log(areas.length + " areas", arguments);
    };

    // Display areas coordinates in a div
    function displayAreas (areas) {
      var text = "";
      $.each(areas, function (id, area) {
	text += areaToString(area);
      });
      output(text);
    };
    

    function save(data) {
      console.log(data);
      $.ajax({
	type: "POST",
	url: "/save",
	data: data,
	dataType: "json",
	success: function(data){
	  console.log("success!");
	},
	error: function (xhr, status, error) {
	  console.log('Error: ' + error.message);
	},

      });
    }
  });
