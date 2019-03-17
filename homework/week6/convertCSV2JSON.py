# Rinus van Grunsven
# 10755373

import json
import csv
import pandas as pd

input = "DP_LIVE_17032019174948957.csv"
output = "DP_LIVE_17032019174948957.json"
data_list = []

def read_csv(filename):
    """
    Read CSV and append a dict to a list
    """
    # df = pd.read_csv(filename)
    # df = df[["LOCATION", "TIME", "VALUE"]]
    # print(df)


    with open(input, "r") as csvfile:
        # data_dict = {}
        reader = csv.reader(csvfile, delimiter=';')
        for row in reader:
            if row[0] is not "LOCATION":
                country = row[0].strip('""')
                year = row[5].strip('""')
                value = row[6].strip('""')
                data_list.append({"Country" : country, "Year" : int(year), "Value" : int(value)})
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
