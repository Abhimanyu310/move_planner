
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetaddr, city, imgsrc;
    streetaddr = $('#street').val();
    city = $('#city').val();
    imgscr = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + streetaddr +", "+city;

    $('body').append('<img class = "bgimg" src='+imgscr+'>');
    console.log(imgscr);

    var articlesrc = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?&q="'+city+'"&sort=newest&api-key=d4bae15637f6e45faae14e3149b2bd30:1:73600565'
    console.log(articlesrc);
    $.getJSON(articlesrc, function(data){
        console.log(data);
        $.each(data, function(key, val) {
            articles = data.response.docs;
            for(var i = 0; i< articles.length; i++){
                var article = articles[i];
                $nytElem.append('<li class="article"><a href="'+article.web_url+'">'+article.headline.main+'</a>'
                    +'<p>'+article.snippet+'</p>'+'</li>');
            };
        });
    }).error(function(){
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
        });
    //console.log(data);


    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });


    return false;
};

$('#form-container').submit(loadData);
