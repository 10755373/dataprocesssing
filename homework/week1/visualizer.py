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

for year in range(START_YEAR, END_YEAR):
    years = data_dict[str(year)]
    ratings = [float(rating) for rating in years]
    average = ((sum(ratings)) / float(len(ratings)))
    data_dict[str(year)] = average

if __name__ == "__main__":
    print(data_dict)
    plt.xlabel('')
    plt.ylabel('')
    plt.title('')
    
