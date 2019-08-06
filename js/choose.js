//prendo i dati dall'altra pagina html
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var queries = queryString.split("&");
var nome = (queries[0].split("="))[1];
console.log(nome);

//titolo dinamico
d3.select(".title").html(nome);

var path = window.location.pathname;
var page = path.split("/").pop();
console.log( page );

var image1 = document.getElementById("generale");
if(page == "moreFilmInfo.html")
   var image2 = document.getElementById("trailer");
else
   var image2 = document.getElementById("immagine");
console.log(image1);
console.log(image2);

        
image1.onclick = function(event) {
        window.open("https://marvelcinematicuniverse.fandom.com/wiki/" +nome);
};
		
image2.onclick = function(event) {
        if(page == "moreFilmInfo.html")
            window.open("https://www.youtube.com/results?search_query=" +nome+ " Trailer");
        else
            window.open("https://www.google.it/search?hl=it&biw=1536&bih=706&tbm=isch&sa=1&ei=SJtJXbrzNoH9kwXit7KgDQ&q="+nome+"&oq="+nome+"&gs_l=img.3..0l10.17220.18876..19150...0.0..0.93.584.7......0....1..gws-wiz-img.......0i67.eA39LmEJvQk&ved=0ahUKEwi6t9Stxu7jAhWB_qQKHeKbDNQQ4dUDCAY&uact=5");
};      