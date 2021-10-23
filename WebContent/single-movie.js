/**
 * This example is following frontend and backend separation.
 *
 * Before this .js is loaded, the html skeleton is created.
 *
 * This .js performs three steps:
 *      1. Get parameter from request URL so it know which id to look for
 *      2. Use jQuery to talk to backend API to get the json data.
 *      3. Populate the data to correct html elements.
 */


/**
 * Retrieve parameter from request URL, matching by parameter name
 * @param target String
 * @returns {*}
 */
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

function handleResult(resultData) {

    console.log("handleResult: populating movie info from resultData");
    console.log(resultData);

    // populate the star info h3
    // find the empty h3 body by id "star_info"
    let movieInfoElement = jQuery("#movie_info");

    // append two html <p> created to the h3 body, which will refresh the page
    movieInfoElement.append("<p>Movie Title: " + resultData[0]["movie_title"] + "</p>" +
        "<p>Release Year: " + resultData[0]["movie_year"] + "</p>" +
        "<p>Director: " + resultData[0]["movie_director"] + "</p>" +
        "<p>Rating: " + resultData[0]["movie_rating"] + "</p>");

    console.log("handleResult: populating movie table from resultData");

    // Populate the star table
    // Find the empty table body by id "movie_table_body"
    let starTableBodyElement = jQuery("#star_table_body");

    let genreTableBodyElement = jQuery("#genre_table_body");

    let star_dup = []; // hold star
    let genre_dup = [];


    // Concatenate the html tags with resultData jsonObject to create table rows
    for (let i = 0; i < resultData.length; i++) {
        let rowHTML = "";
        rowHTML += "<tr>";
        if (!star_dup.includes(resultData[i]["movie_stars"]))
        {

            rowHTML +=
                "<th>" +
                // Add a link to single-movie.html with id passed with GET url parameter
                '<a href="single-star.html?id=' + resultData[i]['star_id'] + '">'
                + resultData[i]["movie_stars"] +
                '</a>' +
                "</th>";

            star_dup.push(resultData[i]["movie_stars"]);
        }
        rowHTML += "</tr>";
        // Append the row created to the table body, which will refresh the page
        starTableBodyElement.append(rowHTML);

        rowHTML = "";
        rowHTML += "<tr>";

        if (!genre_dup.includes(resultData[i]["movie_genre"]))
        {

            rowHTML += "<th>" + '<a href="movie-list.html?genre=' + resultData[i]['movie_genre'] + '">'
                + resultData[i]['movie_genre'] + '</a>' + "</th>";

            genre_dup.push(resultData[i]["movie_genre"]);
        }

        rowHTML += "</tr>";
        // Append the row created to the table body, which will refresh the page
        genreTableBodyElement.append(rowHTML);



    }





}

/**
 * Once this .js is loaded, following scripts will be executed by the browser\
 */

// Get id from URL
let movieId = getParameterByName('id');

// Makes the HTTP GET request and registers on success callback function handleResult
jQuery.ajax({
    dataType: "json",  // Setting return data type
    method: "GET",// Setting request method
    url: "api/single-movie?id=" + movieId, // Setting request url, which is mapped by StarsServlet in Stars.java
    success: (resultData) => handleResult(resultData) // Setting callback function to handle data returned successfully by the SingleStarServlet
});