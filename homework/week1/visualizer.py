#!/usr/bin/env python
# Name: Rinus van Grunsven
# Student number: 10755373
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

with open(INPUT_CSV, newline="") as file:
    reader = csv.DictReader(file)
    for row in reader:
        data_dict[row["Year"]].append(row["Rating"])

for year in range(START_YEAR, END_YEAR):
    list_ratings = data_dict[str(year)]
    ratings = [float(rating) for rating in list_ratings]
    average_rating = sum(ratings) / float(len(ratings))
    data_dict[str(year)] = average_rating

if __name__ == "__main__":
    list_years = []
    list_averages = []
    for element in range(START_YEAR, END_YEAR):
        list_years.append(element)
        list_averages.append(data_dict[str(element)])
    plt.xlabel('Year')
    plt.ylabel('Average rating')
    plt.title('Average rating between 2008 and 2018')
    plt.plot(list_years, list_averages, linewidth=1.0)
    plt.axis([2007, 2018, 7, 10])
    plt.grid(True)
    plt.show()
