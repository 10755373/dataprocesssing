# Rinus van Grunsven
# 10755373

import json
import csv
import pandas as pd

input = "DP_LIVE_GDP.csv"
output = "DP_LIVE_GDP.json"

def read_csv(filename):
    """
    Read CSV and append a dict to a list
    """
    with open(input, "r") as csvfile:
        # data_dict = {}
        reader = pd.read_csv(csvfile, delimiter=';')
        df = reader[["LOCATION", "TIME", "Value"]]
        df_dict = df.to_dict(orient="split")
        with open(output, "w") as jsonfile:
            json.dump(df_dict, jsonfile)

if __name__ == "__main__":
    read_csv(input)
