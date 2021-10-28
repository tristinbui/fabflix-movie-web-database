/**
 * This example is following frontend and backend separation.
 *
 * Before this .js is loaded, the html skeleton is created.
 *
 * This .js performs two steps:
 *      1. Use jQuery to talk to backend API to get the json data.
 *      2. Populate the data to correct html elements.
 */
function getSelectedPagination(){

    jQuery("#pagination a"). on("click", function (){
        maxPgCount = $(this).text();
        console.log("selected:" + maxPgCount);
        $("#max-results").text(maxPgCount);
    })

    let reload= new URL(window.location);
    reload.searchParams.set("mvct", maxPgCount);
    console.log(reload);
    window.location.assign(reload);
}

function incrementPage(){

    let page = parseInt($("#page-num").text());
    page++; // increment page
    let reload= new URL(window.location);
    reload.searchParams.set("page", page.toString());
    window.location.assign(reload);
}

function decrementPage(){
    let page = parseInt($("#page-num").text());
    if (page > 1){
        page--; // increment page
        let reload= new URL(window.location);
        reload.searchParams.set("page", page.toString());
        window.location.assign(reload);
    }

}

function handleCartInfo(movieId){

    $.ajax("api/movies", {
        dataType: "json",
        method: "POST",
        data: { movieId: movieId},
        success: resultDataString => { alert(`Added to cart.`); },
        error: resultDataString => { alert(`Could not add to cart.`); }
    });
}



function getParameterByName(target) {
    // Get request URL
    let url = window.location.href;
    // Encode target parameter name to url encoding
    target = target.replace(/[\[\]]/g, "\\$&");

    // Ues regular expression to find matched parameter value
    let regex = new RegExp("[?&]" + target + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    // Return the decoded parameter value
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


/**
 * Handles the data returned by the API, read the jsonObject and populate data into html elements
 * @param resultData jsonObject
 */
function handleMovieResult(resultData) {
    console.log("handleMovieResult: populating star table from resultData");

    // testing purposes
    console.log(window.location.href);
    console.log(resultData);

    // Populate the star table
    // Find the empty table body by id "movie_table_body"
    let movieTableBodyElement = jQuery("#movie_table_body");

    // let movie_dup = "";

    let count = resultData[0]["count"]; //default


    for (let i = 0; i < Math.min(count, resultData.length); i++) {
        let rowHTML = "";

        if (count > 0)
        {
            rowHTML += "<tr>";

            rowHTML += "<th>" + '<button onclick="handleCartInfo(\'' + resultData[i]['movie_id'] + '\')">' + "Add to Cart" +  // display star_name for the link text
            '</button>' + "</th>";
            rowHTML +=
                "<th>" +
                // Add a link to single-movie.html with id passed with GET url parameter
                '<a href="single-movie.html?id=' + resultData[i]['movie_id'] + '">'
                + resultData[i]["movie_title"] +     // display star_name for the link text
                '</a>' +
                "</th>";

            // movie_dup = resultData[i]["movie_title"];

            rowHTML += "<th>" + resultData[i]["movie_year"] + "</th>";
            rowHTML += "<th>" + resultData[i]["movie_director"] + "</th>";
            rowHTML += "<th>" + resultData[i]["movie_ratings"] + "</th>";
            let genres = [];
            for (let j = 0; j < Math.min(3,resultData[i]['movie_genres'].length); j++){
                genres.push('<a href="movie-list.html?genre=' + resultData[i]['movie_genres'][j] + '">'
                    + resultData[i]['movie_genres'][j] + '</a>');
            }
            rowHTML += "<th>" + genres.join(", ") + "</th>";
            let stars = [];
            for (let j = 0; j < Math.min(3,resultData[i]['movie_stars'].length); j++){
                // Add a link to single-star.html with id passed with GET url parameter
                stars.push('<a href="single-star.html?id=' + resultData[i]['movie_stars'][j]['star_id'] + '">'
                    + resultData[i]["movie_stars"][j]['star'] +
                    '</a>')
            }
            rowHTML += "<th>" + stars.join(", ") + "</th>";

            rowHTML += "</tr>";
            movieTableBodyElement.append(rowHTML)

        }

        else
        {
            break;
        }
        }
}


/**
 * Once this .js is loaded, following scripts will be executed by the browser
 */

// let mvListURL = buildURLQuery();
// console.log(mvListURL);

let movieGenre = getParameterByName('genre');
let searchChar = getParameterByName('char');
let searchTitle = getParameterByName('search_title');
let searchYear = getParameterByName('search_year');
let searchDirector = getParameterByName('search_director');
let searchStar = getParameterByName('search_star');
let mvCount = getParameterByName('mvct') || 10;
let page = getParameterByName('page') || 1;

let query = "genre=" + movieGenre + "&";
query += "char=" + searchChar + "&";
query += "search_title=" + searchTitle + "&";
query += "search_year=" + searchYear + "&";
query += "search_director=" + searchDirector + "&";
query += "search_star=" + searchStar + "&";
query += "mvct=" + mvCount + "&";
query += "page=" + page; // starting item on page

let maxPgCount;
// get user selected pagination
jQuery("#pagination a"). on("click", function (){
    maxPgCount = $(this).text();
})
jQuery("#max-results").text(mvCount);

jQuery("#prev-btn").on("click", function(){
    $(this).text();
});
jQuery("#page-num").text(page);

// Makes the HTTP GET request and registers on success callback function handleStarResult
jQuery.ajax({
    dataType: "json", // Setting return data type
    method: "GET", // Setting request method
    url: "api/movies?" + query, // Setting request url, which is mapped by StarsServlet in Stars.java
    success: (resultData) => handleMovieResult(resultData) // Setting callback function to handle data returned successfully by the StarsServlet
}); 