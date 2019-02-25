# Rinus van Grunsven
# 10755373

import json
import csv
import pandas as pd
import xlrd

input = "KNMI_20190223.csv"
output = "data_output.json"
data_list = []

def read_csv(filename):
    with open(input, "r") as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if len(row) > 1 and row[0][0] is not '#':
                temp = row[2].strip()
                temp_cleaned = temp.strip(';')
                data_list.append({"Datum" : row[1], "Minimum temperatuur" : temp_cleaned})
    return(data_list)

def make_json(filename):
    with open(output, "w") as jsonfile:
        json.dump(data_list, jsonfile)

if __name__ == "__main__":
    read_csv(input)
    make_json(data_list)


# input_xlsx = "KNMI_20190223.xlsx"
# input_csv = "input.csv"
# output_json = "data_output.json"
#
# def xlsx_to_csv(filename):
#     # read xlsx file
#     xlsx = pd.read_excel(input_xlsx)
#     # convert xlsx to csv
#     data_xls.to_csv(input_csv)
#     # read csv file
#     csv = pd.read_csv(input_csv, sep=",")
#     # make list with details you need
#     details_list = []
#     # we don't need all values
#
#     # iterate over rows in file
#     with open(csv, "r") as csvfile:
#         for row in reader:
#             if len(row) > 0 and row[0][0] is not '#':
#                 data_list.append({"Datum" : row[1], "Minimum temperatuur" : row[2]})
#     return(details_list)
#
# def csv_to_json(filename):
#     with open(output_json, "r") as jsonfile:
#         json.dump(data_list, jsonfile)
#
# if __name__ == "__main__":
#     xlsx_to_csv(input)
#     csv_to_json(data_list)

# input = "KNMI_20190221.csv"
# editedinput = "editedinput.csv"
# output = "data_output.json"
#
# def read_csv(filename):
#     data_list = []
#     with open(input, "r") as file:
#         reader = csv.DictReader(file)
#         for row in reader:
#             if len(row) > 0 and row[0][0] is not '#':
#                 data_list.append({"Datum" : row[1], "Minimum temperatuur" : row[2]})
#     return(data_list)
#
# def write_csv(filename):
#     with open("editedinput.csv", "w") as newfile:
#         fieldnames = ["Datum", "Minimum temperatuur"]
#         # Create an object which operates like a regular writer but maps dictionaries onto output rows
#         writer = csv.DictWriter(newfile, fieldnames)
#         # Write a row with the field names (as specified in the constructor) as header
#         writer.writeheader()
#         for row in details_list:
#             # make rows in new csv document
#             writer.writerow(row)
#
# def data(details):
#     df = pd.read_csv(details)
#     return(df)
#
# def make_json(filename, data_list):
#     with open(output, "w") as jsonfile:
#         json.dump(data_list, jsonfile)
#
# if __name__ == "__main__":
#     read_csv(input)
#     df = data(editedinput)
#     make_json(output, data_list)

# input = "KNMI_20190221.txt.tsv"
# output = "data_output.json"
#
# def read_tsv(filename):
#     data_list = []
#     with open(input, "r") as file:
#         reader = pd.read_table(file, sep="\t")
#         for row in reader:
#             if len(row) > 0 and row[0][0] is not '#':
#                 data_list.append({"Datum" : row[1], "Minimum temperatuur" : row[2]})
#
# def make_json(filename):
#     with open(output, "w") as file:
#         json.dump(data_list, file)
#
# if __name__ == "__main__":
#     read_tsv(input)
#     make_json(output)
