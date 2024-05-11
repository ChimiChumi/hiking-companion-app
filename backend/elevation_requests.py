import requests
from random import uniform
from dotenv import load_dotenv
from os import getenv
import googlemaps
load_dotenv()

maps_apikey = getenv("MAPS_API")

def getElavation(lon,lat):
  client = googlemaps.Client(maps_apikey)
  result = client.elevation((lat,lon))
  return result[0]['elevation']

if __name__ == "__main__":
  # lon,lat = 33.7449504014,41.8403211637
  lat = 33.744933462
  lon = 41.840311838
  print(getElavation(lon,lat))