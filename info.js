var TT_URL="https://api.tomtom.com";
var OWM_URL="https://api.openweathermap.org";
var TT_KEY="GtRmfq0QYA5bGnvFxJhBqRDrxyDN4ZKh";
var OWM_KEY="1e2a97741b1097a82470cc6bee614315";
var OWM_PNG="http://openweathermap.org/img/wn/";
var longitude=0;
var latitude=0;
var place="";
var map="";
var weather="";
var weatherData;
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function findLocation() {
	place=$("#searchBar").val();
	a=$.ajax({
		url: TT_URL+"/search/2/search/"+place+".json?minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&key="+TT_KEY,
		method: "GET"
	}).done(function(data) {
		map=JSON.stringify(data);
		latitude=data.results[0].position.lat;
		longitude=data.results[0].position.lon;
		findWeather();
	}).fail(function(error) {
		console.log("error: ",error);
	});
}

function findWeather() {
	a=$.ajax({
                url: OWM_URL+"/data/2.5/forecast?lat="+latitude+"&lon="+longitude+"&units=imperial&appid="+OWM_KEY,
		method: "GET"
	}).done(function(data) {
		weather=JSON.stringify(data);
		// Make weather visable 
		$("#weatherDiv").attr("style", "visibility: visable");
		// Find Day and temp
		d=new Date(data.list[0].dt_txt);
		$("#currentWeather").find("h5").html("Today "+data.list[0].main.temp+"°");
		d=new Date(data.list[8].dt_txt);
                $("#dayOneWeather").find("h5").html("Tommorrow "+data.list[8].main.temp+"°");
                d=new Date(data.list[16].dt_txt);
		$("#dayTwoWeather").find("h5").html(weekday[d.getDay()]+" "+d.getDate()+", "+data.list[16].main.temp+"°");
                d=new Date(data.list[24].dt_txt);
		$("#dayThreeWeather").find("h5").html(weekday[d.getDay()]+" "+d.getDate()+", "+data.list[24].main.temp+"°");
                d=new Date(data.list[32].dt_txt);
		$("#dayFourWeather").find("h5").html(weekday[d.getDay()]+" "+d.getDate()+", "+data.list[32].main.temp+"°");
		// Find high,low,forecast,visibility,humidity
		$("#currentWeather").find("p").html("High " + data.list[0].main.temp_max+"° Low "+data.list[0].main.temp_min+"°<br>Humidity "+data.list[0].main.humidity+"<br>Visibility "+data.list[0].visibility+"<br>Forecast: "+data.list[0].weather[0].description);
		$("#dayOneWeather").find("p").html("High " + data.list[8].main.temp_max+"° Low "+data.list[8].main.temp_min+"°<br>Humidity "+data.list[8].main.humidity+"<br>Visibility "+data.list[8].visibility+"<br>Forecast: "+data.list[8].weather[0].description);
		$("#dayTwoWeather").find("p").html("High " + data.list[16].main.temp_max+"° Low "+data.list[16].main.temp_min+"°<br>Humidity "+data.list[16].main.humidity+"<br>Visibility "+data.list[16].visibility+"<br>Forecast: "+data.list[16].weather[0].description);
		$("#dayThreeWeather").find("p").html("High " + data.list[24].main.temp_max+"° Low "+data.list[24].main.temp_min+"°<br>Humidity "+data.list[24].main.humidity+"<br>Visibility "+data.list[24].visibility+"<br>Forecast: "+data.list[24].weather[0].description);
		$("#dayFourWeather").find("p").html("High " + data.list[32].main.temp_max+"° Low "+data.list[32].main.temp_min+"°<br>Humidity "+data.list[32].main.humidity+"<br>Visibility "+data.list[32].visibility+"<br>Forecast: "+data.list[32].weather[0].description);
		// Search for images
		$("#currentWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[0].weather[0].icon+"@2x.png");
		$("#dayOneWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[8].weather[0].icon+"@2x.png");
		$("#dayTwoWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[16].weather[0].icon+"@2x.png");
		$("#dayThreeWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[24].weather[0].icon+"@2x.png");
		$("#dayFourWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[32].weather[0].icon+"@2x.png");
		saveSearch();
	}).fail(function(error) {
		console.log("error: ",error);
	});


}

function saveSearch() {
	a=$.ajax({
		url: "http://172.17.13.129/final_project/final.php",
		method: "POST",
		data: {
			method: "setWeather",
			location: place,
			mapJson: map,
			weatherJson: weather
		}
	}).done(function(data) {
		console.log("Success");
	}).fail(function(error) {
		console.log(error);
	});
}

function showResults() {
	date=$("#date").val();
	a=$.ajax({
                url: "http://172.17.13.129/final_project/final.php",
                method: "POST",
                data: {
                        method: "getWeather",
                	date: date
		}
        }).done(function(data) {
		$("#goButton").attr("style", "visibility: visable");
		len = $("#max").val();
		if (len>data.result.length) len=data.result.length;
		$("#list").html("");
		$("#list").append("<h5>History Results:</h5>");
		for (let i=0;i<len;i++) {
			$("#list").append('<div class="form-check"><input class="form-check-input myRadio" type="radio" name="myButtons" id="button'+i+'" value="'+i+'"><label class="form-check-label" for="button'+i+'">'+data.result[i].dateTime+', '+data.result[i].location+'</label></div>');
		}
		weatherData=data;
	}).fail(function(error) {
                console.log(error);
        });
}

function disp() {
	buttonNum=$("input[name='myButtons']:checked").val();
	data=JSON.parse(weatherData.result[buttonNum].weatherJson);
	// Make weather visable 
	$("#weatherDiv").attr("style", "visibility: visable");
	// Find Day and temp
	d=new Date(data.list[0].dt_txt);
	$("#currentWeather").find("h5").html("Today "+data.list[0].main.temp+"°");
	d=new Date(data.list[8].dt_txt);
	$("#dayOneWeather").find("h5").html("Tommorrow "+data.list[8].main.temp+"°");
	d=new Date(data.list[16].dt_txt);
	$("#dayTwoWeather").find("h5").html(weekday[d.getDay()]+" "+d.getDate()+", "+data.list[16].main.temp+"°");
	d=new Date(data.list[24].dt_txt);
	$("#dayThreeWeather").find("h5").html(weekday[d.getDay()]+" "+d.getDate()+", "+data.list[24].main.temp+"°");
	d=new Date(data.list[32].dt_txt);
	$("#dayFourWeather").find("h5").html(weekday[d.getDay()]+" "+d.getDate()+", "+data.list[32].main.temp+"°");
	// Find high,low,forecast,visibility,humidity
	$("#currentWeather").find("p").html("High " + data.list[0].main.temp_max+"° Low "+data.list[0].main.temp_min+"°<br>Humidity "+data.list[0].main.humidity+"<br>Visibility "+data.list[0].visibility+"<br>Forecast: "+data.list[0].weather[0].description);
	$("#dayOneWeather").find("p").html("High " + data.list[8].main.temp_max+"° Low "+data.list[8].main.temp_min+"°<br>Humidity "+data.list[8].main.humidity+"<br>Visibility "+data.list[8].visibility+"<br>Forecast: "+data.list[8].weather[0].description);
	$("#dayTwoWeather").find("p").html("High " + data.list[16].main.temp_max+"° Low "+data.list[16].main.temp_min+"°<br>Humidity "+data.list[16].main.humidity+"<br>Visibility "+data.list[16].visibility+"<br>Forecast: "+data.list[16].weather[0].description);
	$("#dayThreeWeather").find("p").html("High " + data.list[24].main.temp_max+"° Low "+data.list[24].main.temp_min+"°<br>Humidity "+data.list[24].main.humidity+"<br>Visibility "+data.list[24].visibility+"<br>Forecast: "+data.list[24].weather[0].description);
	$("#dayFourWeather").find("p").html("High " + data.list[32].main.temp_max+"° Low "+data.list[32].main.temp_min+"°<br>Humidity "+data.list[32].main.humidity+"<br>Visibility "+data.list[32].visibility+"<br>Forecast: "+data.list[32].weather[0].description);
	// Search for images
	$("#currentWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[0].weather[0].icon+"@2x.png");
	$("#dayOneWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[8].weather[0].icon+"@2x.png");
	$("#dayTwoWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[16].weather[0].icon+"@2x.png");
	$("#dayThreeWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[24].weather[0].icon+"@2x.png");
	$("#dayFourWeather").find("img").attr("src","http://openweathermap.org/img/wn/"+data.list[32].weather[0].icon+"@2x.png");
}
