# Rinus van Grunsven
# 10755373

import pandas as pd
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
    # Read a comma-separated values (csv) file into DataFrame.
    df = pd.read_csv(details)
    return(df)

def gdp_calculator(df):
    # get all gdp's
    gdp = df.loc[:, "GDP ($ per capita) dollars"]
    # sort values
    sorted_gdp = gdp.sort_values()
    # median_gdp = round(sorted_gdp.median())
    median_gdp = sorted_gdp.median()
    # mean = sum(sorted) / len(sorted)
    mean_gdp = sorted_gdp.mean()

    # mode

def countries_unique(filename):
    unique_countries = []
    # gather all values from the column "Country"
    countries = df.loc[:, "Country"]
    # remove any duplicates
    clean_countries = countries.drop_duplicates(keep='first')
    # loop over the countries and add them to a list
    for country in clean_countries:
        unique_countries.append(country)
    return(unique_countries)

if __name__ == "__main__":
    details_list = load_data(INPUT_CSV)
    save_csv("datainput.csv", details_list)
    df = use_data(EDITED_INPUT_CSV)
    # countries_unique(EDITED_INPUT_CSV)
    gdp = gdp_calculator(df)
