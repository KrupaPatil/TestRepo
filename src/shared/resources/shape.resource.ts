import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { ShapeModel } from '../models/shape.model';

@Injectable()
export class ShapeResource {

  private list = [
    new ShapeModel({
      "Id": 1,
      "Name": "Cigarillos",
      "Desc": "The classic cigarillo is 4 inch by 26 ring but can be anywhere under 6 inches and 29 ring.",
      "Width": 237,
      "Height": 18
    }),
    new ShapeModel({
      "Id": 2,
      "Name": "Small Panatela",
      "Desc": "Traditionally, the small panatela is 5 inch by 33 ring but can go from 4 to 5 inches by 30 to 34 ring.",
      "Width": 216,
      "Height": 25
    }),
    new ShapeModel({
      "Id": 3,
      "Name": "Slim Panatela",
      "Desc": "Traditionally, the slim panatela is 6 inch by 34 ring but can go from 5 to more inches by 30 to 44 ring.",
      "Width": 234,
      "Height": 25
    }),
    new ShapeModel({
      "Id": 4,
      "Name": "Short Panatela",
      "Desc": "The standard Short Panatela  is 5 inch by 38 ring but can go from 4 to 5 3/8 inches by 35 to 39 ring.",
      "Width": 232,
      "Height": 29
    }),
    new ShapeModel({
      "Id": 5,
      "Name": "Panatela",
      "Desc": "This once very popular thin format can go from 5 1/2 to 6 7/8 inches long by 35 to 39 ring gauge.",
      "Width": 297,
      "Height": 29
    }),
    new ShapeModel({
      "Id": 6,
      "Name": "Long Panatela",
      "Desc": "The classic Long Panatela is 7 1/2 inch by 38 ring but can go from 7 and up inches by  35 to 39 ring.",
      "Width": 329,
      "Height": 29
    }),
    new ShapeModel({
      "Id": 7,
      "Name": "Petit Corona",
      "Desc": "The classic size of this short corona is 5 inches by a 40 to 44 ring gauge, but it can be as short as 4 inches.",
      "Width": 215,
      "Height": 33
    })
    ,new ShapeModel({
      "Id": 8,
      "Name": "Corona",
      "Desc": "The corona size is typically 5.5 inches with a ring gauge of 40 to 44.",
      "Width": 249,
      "Height": 32
    }),
    new ShapeModel({
      "Id": 9,
      "Name": "Long Corona",
      "Desc": "The classic Long Corona is 6 inch by 42 ring but can go from 5 7/8 to 6 3/8 inches by 40 to 44 ring.",
      "Width": 274,
      "Height": 33
    }),
    new ShapeModel({
      "Id": 10,
      "Name": "Lonsdale",
      "Desc": "The standard Lonsdale is 6.5 inches long by a 40 to 44 ring.",
      "Width": 313,
      "Height": 33
    }),
    new ShapeModel({
      "Id": 11,
      "Name": "Giant Corona",
      "Desc": "A Giant Corona typically is 7.5 inches and up by 42 to 45 ring.",
      "Width": 343,
      "Height": 33
    }),
    new ShapeModel({
      "Id": 12,
      "Name": "Corona Extra",
      "Desc": "A Corona Extra (traditionally a 5 1/2 inch by 46 ring gauge) can range from 4 1/2 to 5 1/2 inches by a 45 to 47 ring gauge.",
      "Width": 232,
      "Height": 35
    }),
    new ShapeModel({
      "Id": 13,
      "Name": "Grand Corona",
      "Desc": "The classic Grand Corona size is 6 1/2 inches by 46.",
      "Width": 285,
      "Height": 34
    }),
    new ShapeModel({
      "Id": 14,
      "Name": "Robusto",
      "Desc": "The Robusto is a short Churchill size, traditionally 5 to 5.5 inches by a 50 ring gauge.",
      "Width": 230,
      "Height": 39
    }),
    new ShapeModel({
      "Id": 15,
      "Name": "Toro",
      "Desc": "The standard Toro shape is 6 inches by 50 ring.",
      "Width": 285,
      "Height": 39
    }),
    new ShapeModel({
      "Id": 16,
      "Name": "Churchill",
      "Desc": "This large corona is traditionally 7 inches by 48 ring. Length can vary from 6 3/4 to 7 7/8 in length by 46 to 50 ring.",
      "Width": 346,
      "Height": 37
    }),
    new ShapeModel({
      "Id": 17,
      "Name": "Double Corona",
      "Desc": "Double Coronas are usually 6.75 to 8 inches long by a 49 to 54 ring.",
      "Width": 349,
      "Height": 40
    }),
    new ShapeModel({
      "Id": 18,
      "Name": "Giant",
      "Desc": "The Giant was tipically a 9 inch by 52 cigar. Today, it is every cigar 8 inches and up with a ring gauge of 50 and up.",
      "Width": 357,
      "Height": 52
    }),
    new ShapeModel({
      "Id": 19,
      "Name": "Torpedo",
      "Desc": "The Torpedo was traditionally a fat cigar with two closed, tapered ends. Today, it is any cigar with a cut foot and straight body which tapers to a closed, pointed head.",
      "Width": 298,
      "Height": 36
    }),
    new ShapeModel({
      "Id": 20,
      "Name": "Pyramid",
      "Desc": "The Pyramid differs from the Torpedo in that it flares continuously from the head to the foot in a triangle shape.",
      "Width": 302,
      "Height": 38
    }),
    new ShapeModel({
      "Id": 21,
      "Name": "Perfecto",
      "Desc": "The Perfecto shape has two tapered, closed ends with a rounded head, a closed foot, and a bulge in the middle. They can vary in length and ring gauge.",
      "Width": 272,
      "Height": 41
    })
  ];

  constructor() {
  }

  public getList() {
    return new Observable((o: Observer<ShapeModel[]>) => {
      o.next(this.list);
      return o.complete();
    });
  }

  public get(id) {
    return new Observable((o: Observer<ShapeModel>) => {
      o.next(_.find(this.list, {Id: parseInt(id)}));
      return o.complete();
    });
  }
}
