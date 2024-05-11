import json
from models import Route
def get_json_dic(file_name):
  with open(file_name, encoding='utf-8') as f:
    data =json.load(f)
    return data


def getRouteFeatures(file_name):
  data = get_json_dic(file_name)

  route = Route(data['name'],data['description'],data['tags'], [], 0 )
  features = data['features']

  return route,features

def main(file_name):
  data = get_json_dic(file_name)
  print(data.keys(), "\n\n")

  features =  data['features']
  features[0]['routeId']='hello'
  return features[0]

if __name__ == '__main__':
  file_name = "inebolu_ersizler_ipsinne_kanyon_kastamonu.json"
  getRouteFeatures(file_name)
