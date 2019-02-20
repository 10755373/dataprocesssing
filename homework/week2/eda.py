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
            # Clean and preprocess all the data we need
            for value in ["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]:
                if row[value] == "unknown":
                    population = row["Population"]
                    populationfl = population.replace(",", ".")
                    area = row["Area (sq. mi.)"]
                    areafl = area.replace(",", ".")
                    density = float(populationfl) / float(areafl)
                    details_dict[value] = float(density)
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
                        if value == "Pop. Density (per sq. mi.)":
                            density = row[value].replace(",", ".")
                            densityfl = float(density)
                            row[value] = densityfl
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
    print("After printing sorted_gdp, I noticed that country 195 (Suriname) was an outlier since it's GDP is $400.000. "
    "Therefore, I've removed it for the remaining of this part in order to secure a decent data")
    # gdp = gdp.drop(index="Suriname", columns="GDP ($ per capita) dollars")
    cleaned_gdp = gdp.drop([193])
    # Calculate the median
    median_gdp = cleaned_gdp.median()
    # Calculate the mean
    mean_gdp = cleaned_gdp.mean()
    # Calculate the mode
    mode_gdp = int(cleaned_gdp.mode())
    # Calculate the standard deviation
    stdev_gdp = cleaned_gdp.std()
    print("Regarding the gdp, the median is {}, the mean is {}, the mode is {} and the standard deviation is {}".format(median_gdp, mean_gdp, mode_gdp, stdev_gdp))
    return(cleaned_gdp)

def mortality_calculator(df):
    """
    Calculate fice number summary (Minimum, First Quartile, Median, Third Quartile and Maximum)
    """
    # Get column with all data
    mortality = df.loc[:, "Infant mortality (per 1000 births)"]
    # Sort values
    sorted_mortality = mortality.sort_values()
    # print first message
    print("After printing sorted_mortality I noticed that country 7 (Angola) was an outliers since it's mortality rate is 191,19. "
    "Therefore, I removed it in the remaining of this part in order to secure a decent data set")
    # Remove the outliers from list
    mortality_cleaned = mortality.drop([5])
    # Calculate Minimum
    min_mortality = mortality_cleaned.min()
    # Calculate First Quartile
    firstq_mortality = mortality_cleaned.quantile(0.25)
    # Calculate Median
    median_mortality = mortality_cleaned.median()
    # Calculate Third Quartile
    thirdq_mortality = mortality_cleaned.quantile(0.75)
    # Calculate Maximum
    max_mortality = mortality_cleaned.max()
    # print the message with all the requested info
    print("Regarding the mortality rate, the minimum is {}, the first quartile is {}, the median is {}, the third quartile is {} and the maximum is {}".format(min_mortality, firstq_mortality,
    median_mortality, thirdq_mortality, max_mortality))
    return(mortality_cleaned)

def visualize(df):
    """
    Visualize all the data in a histogram (for gdp) as well as a boxplot (for mortality)
    """
    # Make a histogram
    plt.hist(gdp_calculator(df), bins=225)
    plt.xlabel('GDP')
    plt.ylabel('Number of countries')
    plt.title('GDP ($ per capita) dollars')
    plt.grid()
    plt.show()
    # Make a boxplot
    boxplot = plt.boxplot(mortality_calculator(df))
    plt.show()

def make_json(details_list):
    """
    Iterate over list with all countries' details and append to a .json file
    """
    # Create a dictionary in which you store as key the name of the country and the details from it as values
    json_dict = {}
    # Iterate over all the data
    for row in details_list:
        country_dict = {}
        country_dict["Region"] = row["Region"]
        country_dict["Pop. Density (per sq. mi.)"] = row["Pop. Density (per sq. mi.)"]
        country_dict["Infant mortality (per 1000 births)"] = row["Infant mortality (per 1000 births)"]
        country_dict["GDP ($ per capita) dollars"] = row["GDP ($ per capita) dollars"]
        # Append data to a dictionary
        json_dict[row["Country"]] = country_dict
        # Create a .json file and append json_dictionary to it
        with open("data.json", "w") as newfile:
            json.dump(json_dict, newfile)

if __name__ == "__main__":
    details_list = load_data(INPUT_CSV)
    save_csv("datainput.csv", details_list)
    df = use_data(EDITED_INPUT_CSV)
    gdp = gdp_calculator(df)
    mortality = mortality_calculator(df)
    make_json(details_list)
    visualize(df)
