function getcalculation() {
  var heightVal;
  var widthVal;
  heightVal = Math.sqrt(
    Math.pow($("#diagonal").val(), 2) / (1 + Math.pow($("#ar").val(), 2))
  );
  $("#height").val(heightVal.toFixed(2));
  widthVal = $("#height").val() * $("#ar").val();
  $("#width").val(widthVal.toFixed(2));
}
function AspectRatio(element) {
  var radio = $(element).val();
  switch (radio) {
    case "4:3":
      $("#xVal").val(4);
      $("#yVal").val(3);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
    case "16:9":
      $("#xVal").val(16);
      $("#yVal").val(9);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
    case "16:10":
      $("#xVal").val(16);
      $("#yVal").val(10);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
    case "1.85:1":
      $("#xVal").val(1.85);
      $("#yVal").val(1);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
    case "2.35:1":
      $("#xVal").val(2.35);
      $("#yVal").val(1);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
    case "1:1":
      $("#xVal").val(1);
      $("#yVal").val(1);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
    case "2.40:1":
      $("#xVal").val(2.4);
      $("#yVal").val(1);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
    case "3:2":
      $("#xVal").val(3);
      $("#yVal").val(2);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
    case "16:10":
      $("#xVal").val(16);
      $("#yVal").val(10);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
    case "15:9":
      $("#xVal").val(15);
      $("#yVal").val(9);
      $("#ar").val($("#xVal").val() / $("#yVal").val());
      break;
  }
  getcalculation()
}

