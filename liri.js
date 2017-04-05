var twitterKeys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var command = process.argv[2];

// grab all string after the 'command' and join it
process.argv.shift();
process.argv.shift();
process.argv.shift();
var myStr = process.argv.join(" ");

function twitter() {
    var client = new Twitter(twitterKeys.twitterKeys);

    var params = {
        screen_name: 'vktrwlt',
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {

        if (!error) {
            // console.log(tweets[0].text);
            // console.log(tweets[0].created_at);
            console.log("[------- Showing last 20 tweets --------]")
            for (var tweet of tweets) {
                console.log(tweet.created_at + " -- " + tweet.text);
            }
        }
    });

}

function spotifyThisSong(song) {
    // if no input default to 'The Sign'
    song = song || "The Sign by Ace of Base";
    spotify.search({
        type: 'track',
        query: song
    }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        var songs = data.tracks.items;
        console.log("Artist Name: " + songs[0].artists[0].name);
        console.log("Song Name: " + songs[0].name);
        console.log("Preview: " + songs[0].preview_url);
        console.log("Album: " + songs[0].album.name);
    });
}

function movieThis(movieName) {

    movieName = movieName || "Mr. Nobody";
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";


    request(queryUrl, function(error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            console.log("Movie Title: " + movie.Title);
            console.log("Year Released: " + movie.Year);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Country Produced: " + movie.Country);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Rotten Tomatoes Url: https://www.rottentomatoes.com/m/" + movie.Title.split(" ").join("_"));

        }
    });
}

function doThis() {
    fs.readFile("random.txt", "UTF-8", function(err, data) {

        var split = data.split(",");

        var func = split[0];
        var str = split[1];

        if (func === "spotify-this-song") {
            func = "spotifyThisSong";
        } else if (func === "my-tweets") {
            func = "twitter";
        } else if (func === "movie-this") {
            func = "movie-this";
        }

        eval(func + "(" + str + ")");
    });
}

switch (command) {
    case "my-tweets":
        twitter();
        break;
    case "spotify-this-song":
        spotifyThisSong(myStr);
        break;
    case "movie-this":
        movieThis(myStr);
        break;
    case "do-what-it-says":
        doThis();
        break;
    default:
        console.log("Sorry try again!!");
        console.log("Available commands: my-tweets, spotify-this-song, movie-this, do-what-it-says");
}
