# Rinus van Grunsven
# 10755373

import pandas as pd
import math
import sys
import csv
import json
import matplotlib.pyplot as plt
import numpy as np
import statistics

INPUT_CSV = "datainput.csv"
EDITED_INPUT_CSV = "editedinput.csv"


def load_data(filename):
    """
    Load data and adjust if needed.
    Returns a list.
    """
    details_list = []
    with open(filename, "r") as file:
        # read document and append to dictionary
        reader = csv.DictReader(file)
        for row in reader:
            details_dict = {}
            for value in ["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]:
                if row[value] == "unknown":
                    population = row["Population"]
                    area = row["Area (sq. mi.)"]
                    density = int(population) / int(area)
                    density_rounded = round(density)
                    # details_dict[value] = density_rounded
                    details_dict[value] = density_rounded
                elif row[value]:
                        if type(row[value]) is str:
                            row[value] = row[value].strip()
                        if value == "GDP ($ per capita) dollars":
                            gdp_splitted = row[value].split()
                            row[value] = int(gdp_splitted[0])
                        if value == "Infant mortality (per 1000 births)":
                            mortality = row[value].replace(",", ".")
                            mortality_replaced = float(mortality)
                            row[value] = mortality_replaced
                        details_dict[value] = row[value]
                else:
                    details_dict[value] = 0
            details_list.append(details_dict)
    return(details_list)

def save_csv(filename, details_list):
    """
    Write new file in which all the dictionaries are stored
    """
    # make new file in which you store data
    with open("editedinput.csv", "w") as csvfile:
        # specify fieldnames
        fieldnames = ["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]
        # Create an object which operates like a regular writer but maps dictionaries onto output rows
        writer = csv.DictWriter(csvfile, fieldnames)
        # Write a row with the field names (as specified in the constructor) as header
        writer.writeheader()
        for row in details_list:
            # make rows in new csv document
            writer.writerow(row)

def use_data(details):
    """
    Read CSV into DataFrame
    """
    # Read a comma-separated values (csv) file into DataFrame.
    df = pd.read_csv(details)
    return(df)

def gdp_calculator(df):
    """
    Calculate gdp's median, mean, mode and standard deviation
    """
    # get all gdp's
    gdp = df.loc[:, "GDP ($ per capita) dollars"]
    # sort values
    sorted_gdp = gdp.sort_values()
    print("After printing sorted_gdp you'll notice that 193 is an outlier"
    "and should, therefore, be removed for the remaining of this part in order to secure decent data")
    # gdp = gdp.drop(index="Suriname", columns="GDP ($ per capita) dollars")
    # median_gdp = round(sorted_gdp.median())
    median_gdp = gdp.median()
    # mean = sum(sorted) / len(sorted)
    mean_gdp = gdp.mean()
    # mode
    mode_gdp = gdp.mode()
    # standard deviation
    stdev_gdp = gdp.std()

def mortality_calculator(df):
    """
    Calculate fice number summary (Minimum, First Quartile, Median, Third Quartile and Maximum)
    """
    # Get column with all data
    mortality = df.loc[:, "Infant mortality (per 1000 births)"]
    # Sort values
    sorted_mortality = mortality.sort_values()
    print("After printing sorted_mortality you'll notice that 47, 221 and 223 are outliers"
    "and should, therefore, be removed for the remaining of this part in order to secure decent data")

    # Calculate Minimum
    min_mortality = mortality.min()
    # Calculate First Quartile
    # firstq_mortality = np.percentile(df.mortality, 25)
    firstq_mortality = mortality.quantile(0.25)
    # Calculate Median
    median_mortality = mortality.median()
    # Calculate Third Quartile
    # thirdq_mortality = np.percentile(df.mortality, 75)
    thirdq_mortality = mortality.quantile(0.75)
    # Calculate Maximum
    max_mortality = mortality.max()

def visualize(df):
    """
    Visualize all the data in a histogram (for gdp) as well as a boxplot (for mortality)
    """
    # Make a histogram
    plt.hist(gdp)
    plt.xlabel('Year')
    plt.ylabel('Average rating')
    plt.title('GDP ($ per capita) dollars')
    plt.plot(list_years, list_averages, linewidth=1.0)
    plt.axis([2007, 2018, 7, 10])
    plt.grid(True)
    plt.show()

    # Make a boxplot
    boxplot = plt.boxplot(mortality)
    plt.show()



# def countries_unique(filename):
#     """
#     Get one of every country and remove Suriname (since it's an outlier)
#     """
#     unique_countries = []
#     # gather all values from the column "Country"
#     countries = df.loc[:, "Country"]
#     # remove any duplicates
#     clean_countries = countries.drop_duplicates(keep='first')
#     # loop over the countries and add them to a list
#     for country in clean_countries:
#         unique_countries.append(country)
#     return(unique_countries)

if __name__ == "__main__":
    details_list = load_data(INPUT_CSV)
    save_csv("datainput.csv", details_list)
    df = use_data(EDITED_INPUT_CSV)
    # countries_unique(EDITED_INPUT_CSV)
    gdp = gdp_calculator(df)
    mortality = mortality_calculator(df)
