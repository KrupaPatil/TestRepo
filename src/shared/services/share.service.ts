import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ImageSourceService } from './image-source.service';

@Injectable()
export class ShareService {

  constructor(private imageSourceService: ImageSourceService,
              private socialSharing: SocialSharing) {
  }

  shareProduct(product, imageSrc) {
    let hashTagName = this.hashTag(product.Name);
    let hashTagManufacturer = this.hashTag(product.Attributes.Manufacturer);
    let image = this.imageSourceService.createSrc(imageSrc);
    this.socialSharing.shareWithOptions({
      message: "Enjoying a " + product.Name + " cigar! #CigarScanner " + hashTagName + hashTagManufacturer,
      subject: "Enjoying a " + product.Name + " cigar!",
      files: [image]
    }).then(() => {
    })
      .catch((err) => {
        console.log(err);
      });
  }

  hashTag(words) {
    if (words && typeof words == "string") {
      words = words.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) {
          return "";
        }
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
      });
      return "#" + words.charAt(0).toUpperCase() + words.slice(1) + " ";
    }
    else return "";
  }
}
