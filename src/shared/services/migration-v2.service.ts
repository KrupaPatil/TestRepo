import { Injectable } from '@angular/core';

@Injectable()
export class MigrationV2Service {

  constructor() {
  }

  /**
   * Initializes v1 app user data in localstorage to be compatible to v2 app.
   * Code below is copied from v2 app with small changes.
   * When changing this code consider v2 app for reference.
   */
  public getOldUserData() {
    let user;

    try {
      user = JSON.parse(window.localStorage.getItem('user'));
    } catch(e) {
      console.error(e);
      return;
    }

    if (!user) {
      // don't create new user
      return;
    }

    if (user.lines && (!user.cigars || !user.cigars.length)) {
      user.cigars = user.lines;
    }

    if (user.lines && user.lines.length) {
      return this.mergeCigars(user, user.lines);
    } else {
      return user;
    }
  }

  private mergeCigars(user, newCigar) {
    newCigar.forEach(function (newC) {
      let oldVersion, index = 0;
      // look for the line with the same ID
      user.cigars.forEach(function (el, idx, arr) {
        if ((el.id && el.id == newC.id && (!el.type || el.type == newC.type)) // line
          || ((el.result && newC.id == el.result.substr(2) || (newC.id && newC.id == el.id))
            && (!el.type || el.type == newC.type)) // product
          || (el.name == newC.name) // manually created cigar
          || (el.name == newC.manualUserInput)
        ) {
          oldVersion = el;
          index = idx;
          user.cigars.splice(idx, 1);
        }
      });

      try {
        // we 'extend' the new values we received
        // into the old object to preserve the custom data
        if (oldVersion) {
          oldVersion = this.copyCigar(newC, oldVersion);
        }
        else {
          oldVersion = newC;
        }
        user.cigars.splice(index, 0, oldVersion);
      }
      catch (err) {
        newC.createdOn = new Date();
        user.cigars.unshift(newC);
      }
    });

    return user;
  }

  private copyCigar(newC, oldC) {
    var userData = this.getUserData(oldC);
    newC = this.mergeObj(newC, userData);
    return newC;
  }

  private mergeObj(n, o) {
    for (var propertyName in o) {
      if (this.isObject(o[propertyName])) {
        n[propertyName] = this.mergeObj(n[propertyName] || {}, o[propertyName]);
      }
      else {
        n[propertyName] = n[propertyName] || o[propertyName]
      }
    }
    return n;
  }

  private isObject(a) {
    return a === Object(a);
  }

  private getUserData(cigar) {
    var userData: any = {};
    userData.list = this.getListObj(cigar);

    if (cigar.userNote) {
      userData.userNote = cigar.userNote;
    }
    else if (cigar.note) {
      userData.userNote = cigar.note;
    }
    if (cigar.userRatingComment) {
      userData.userRatingComment = cigar.userRatingComment;
    }
    else if (cigar.review) {
      userData.userRatingComment = cigar.review;
    }
    if (cigar.userRatingId) {
      userData.userRatingId = cigar.userRatingId
    }
    if (cigar.userRating) {
      userData.userRating = cigar.userRating
    }
    else if (cigar.myRating) {
      userData.userRating = cigar.myRating;
    }
    else if (cigar.result && cigar.result.indexOf("PR") == 0 && Array.isArray(cigar.products)) {
      cigar.products.forEach(function (prod) {
        if (prod.productId == cigar.result.substring(2) && prod.myRating) {
          userData.userRating = prod.myRating;
        }
      })
    }

    return userData;
  }

  private getListObj(line) {
    var list: any = {};
    if (line) {
      if (line.list) {
        return line.list;
      }
      if (line.visible) {
        list.favorite = line.createdOn ? new Date(line.createdOn) : new Date();
      }

      if (!!line.visibleInScans  // if visibleInScans is true
        || (
          line.visibleInScans === undefined // or if it is not defined but (&&) we have all the info to compute it
          && (
            (line.name && !line.id && !line.masterLine && line.result != 'top')
            || (!line.result || line.result == "line")
            || (line.result.indexOf("PR") == 0)
          )
        )
      ) {
        list.history = line.createdOn ? new Date(line.createdOn) : new Date();
      }
    }

    return list;
  }
}
