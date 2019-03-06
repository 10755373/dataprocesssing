# Rinus van Grunsven
# 10755373

import json
import csv
import pandas as pd

input = "KNMI_20190101.csv"
output = "KNMI_20190101.json"
data_list = []

def read_csv(filename):
    """
    Read CSV and append a dict to a list
    """
    with open(input, "r") as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if len(row) > 1 and row[0][0] is not '#':
                wind = row[2].strip()
                wind_cleaned = wind.strip(';')
                data_list.append({"Datum" : int(row[1]), "Windstoot" : int(wind_cleaned)})
    return(data_list)

def make_json(filename):
    """
    Make a JSON file
    """
    with open(output, "w") as jsonfile:
        json.dump(data_list, jsonfile)

if __name__ == "__main__":
    read_csv(input)
    make_json(data_list)
