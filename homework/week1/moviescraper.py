#!/usr/bin/env python
# Name: Rinus van Grunsven
# Student number: 10755373
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    title = []
    rating = []
    release_year = []
    actors = []
    runtime = []

    # divide dom into total_info per movie so you can iterate over each and every single one of them
    total_info = dom.find_all("div", {"class": "lister-item mode-advanced"})

    for title_info in total_info:
        # find class movie title
        title_data = title_info.find("h3", {"class": "lister-item-header"})
        title.append(title_data.find("a").get_text(strip=True))

    for rating_info in total_info:
        # find section about rating
        rating_data = rating_info.find("div", {"class": "inline-block ratings-imdb-rating"})
        # append rating to list Rating
        rating_data = float(rating_data.find("strong").get_text(strip=True))
        if rating_data == []:
            rating.append("N/A")
        else:
            rating.append(rating_data)

    for year_info in total_info:
        # find section about release Year
        year_data = year_info.find("h3", {"class": "lister-item-header"})
        year_data = year_data.find("span", {"class": "lister-item-year text-muted unbold"}).get_text()
        if year_data == []:
            year_data.append("N/A")
        else:
            year_data = int(year_data[-5:-1])
            release_year.append(year_data)

    for actors_info in total_info:
        # find relevant div
        actors_data = actors_info.find("div", {"class": "lister-item-content"})
        # find relevant p tag
        actors_data = actors_data.find_all("p")[2].find_all("a")
        all_actors = []
        for info in actors_data:
            info = info.text.strip()
            stars = re.search(r'(?<=Stars:\n)\w.*', line, re.DOTALL)
            if stars:
                # actors are split into a list which is appended to another list
                actor = stars.group(0).split("\n")
                all_actors.append(actors_data)
        actors.append(all_actors)

    for runtime_info in total_info:
        # runtime_data = runtime_info.find("div", {class="lister-item-content"})
        # time = runtime_data.get_text("p"[0], {class="text-muted"})
        # runtime_data = runtime_info.find("span", {class="runtime"})
        # runtime.append(time)
        # runtime_data = runtime_info.h3.p.("span", {class="runtime"})
        runtime_data = runtime_info.find("span", {"class": "runtime"}).get_text(strip=True)[:3]
        if runtime_data == []:
            runtime.append("N/A")
        else:
            runtime.append(runtime_data)
        # runtime.append(runtime_info.find("span", {"class": "runtime"}).get_text(strip=True)[:3])

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    movies = {'Title': title, 'Rating': rating, 'Year': release_year, 'Actors': actors, 'Runtime': runtime}
    return(movies)   # REPLACE THIS LINE AS WELL IF APPROPRIATE

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK
    all_movies = list(movies.values())
    title = all_movies[0]
    rating = all_movies[1]
    year = all_movies[2]
    actors = all_movies[3]
    runtime = all_movies[4]
    # clean up the actor strings
    for movie in range(len(title)):
        actorstring = str(actors[movie])
        actorstring = actorstring.replace("'", "")
        actorstring = actorstring.replace("[", "")
        actorstring = actorstring.replace("]", "")
        actorstring = actorstring.replace("(", "")
        actorstring = actorstring.replace(")", "")
        # make sure data is correctly filled in
        writer.writerow([title[movie], rating[movie], year[movie], actorstring, runtime[movie]])

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
