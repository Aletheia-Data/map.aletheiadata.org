// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

//"dataId": "provinces",
//"label": "Provincias",
            
const config = {
  "version": "v1",
  "config": {
    "visState": {
      "filters": [],
      "layers": [
        {
          "id": "e2isjje",
          "type": "geojson",
          "config": {
            "dataId": "provinces",
            "label": "Provincias",
            "color": [
              255,
              203,
              153
            ],
            "columns": {
              "geojson": "_geojson"
            },
            "isVisible": true,
            "visConfig": {
              "opacity": 0.3,
              "strokeOpacity": 0.8,
              "thickness": 0.5,
              "strokeColor": [
                248,
                149,
                112
              ],
              "colorRange": {
                "name": "Uber Viz Diverging 3.5",
                "type": "diverging",
                "category": "Uber",
                "colors": [
                  "#00939C",
                  "#2FA7AE",
                  "#5DBABF",
                  "#8CCED1",
                  "#BAE1E2",
                  "#F8C0AA",
                  "#EB9C80",
                  "#DD7755",
                  "#D0532B",
                  "#C22E00"
                ]
              },
              "strokeColorRange": {
                "name": "Global Warming",
                "type": "sequential",
                "category": "Uber",
                "colors": [
                  "#5A1846",
                  "#900C3F",
                  "#C70039",
                  "#E3611C",
                  "#F1920E",
                  "#FFC300"
                ]
              },
              "radius": 10,
              "sizeRange": [
                0,
                10
              ],
              "radiusRange": [
                0,
                50
              ],
              "heightRange": [
                0,
                500
              ],
              "elevationScale": 1,
              "stroked": false,
              "filled": true,
              "enable3d": true,
              "wireframe": false
            },
            "hidden": false,
            "textLabel": [
              {
                "field": null,
                "color": [
                  255,
                  255,
                  255
                ],
                "size": 18,
                "offset": [
                  0,
                  0
                ],
                "anchor": "start",
                "alignment": "center"
              }
            ]
          },
          "visualChannels": {
            "colorField": {
              "name": "ADM2_ES",
              "type": "string"
            },
            "colorScale": "ordinal",
            "sizeField": null,
            "sizeScale": "linear",
            "strokeColorField": null,
            "strokeColorScale": "quantile",
            "heightField": null,
            "heightScale": "linear",
            "radiusField": null,
            "radiusScale": "linear"
          }
        }
      ],
      "interactionConfig": {
        "tooltip": {
          "fieldsToShow": {
            "9fooc2awp": [
              {
                "name": "Name",
                "format": null
              },
              {
                "name": "description",
                "format": null
              },
              {
                "name": "FID",
                "format": null
              },
              {
                "name": "ADM0_EN",
                "format": null
              },
              {
                "name": "ADM0_ES",
                "format": null
              }
            ]
          },
          "compareMode": false,
          "compareType": "absolute",
          "enabled": true
        },
        "brush": {
          "size": 0.5,
          "enabled": false
        },
        "geocoder": {
          "enabled": false
        },
        "coordinate": {
          "enabled": false
        }
      },
      "layerBlending": "normal",
      "splitMaps": [],
      "animationConfig": {
        "currentTime": null,
        "speed": 1
      }
    },
    "mapState": {
      "bearing": 0,
      "dragRotate": false,
      "latitude": 18.701144398000054,
      "longitude": -70.16721579749998,
      "pitch": 0,
      "zoom": 8,
      "isSplit": false
    },
    "mapStyle": {
      "styleType": "light",
      "topLayerGroups": {},
      "visibleLayerGroups": {
        "label": true,
        "road": true,
        "border": false,
        "building": true,
        "water": true,
        "land": true,
        "3d building": false
      },
      "threeDBuildingColor": [
        218.82023004728686,
        223.47597962276103,
        223.47597962276103
      ],
      "mapStyles": {}
    }
  }
};

export default config;
