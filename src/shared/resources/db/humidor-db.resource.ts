import { Injectable } from '@angular/core';
import { CollectionDbResource } from './collection-db.resource';
import { DbResourceInterface } from './db-resource.interface';
import { HumidorModel } from '../../models/humidor.model';
import { StorageService } from '../../services/storage.service';
import { SubmodelMapperService } from "./submodel-mapper.service";
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { ProductModel } from "../../models/product.model";

@Injectable()
export class HumidorDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'humidors', HumidorModel, submodelMapperService, [
      {
        get: (humidorObj) => {
          let products = [];

          _.each(humidorObj.Cigars, (cigar) => {
            products.push(cigar.Product);
          });

          return products;
        },
        set: (humidorObj, products) => {
          _.each(humidorObj.Cigars, (cigar) => {
            let product = _.find(products, {'Id': cigar.ProductId});
            if (product) {
              cigar.Product = product;
            }
          });
        },
        dbResource: 'ProductDbResource',
        resource: 'ProductResource',
        isCollection: true,
      }
    ]);
  }

  deleteCigar(product: ProductModel) {
    return () => {
      return new Observable((o: Observer<any>) => {
        return this.get()
          .subscribe(
            (collection: [any]) => {
              _.each(collection, humidor => {
                let existingProduct = _.find(humidor.Cigars, {ProductId: product.Id});

                if (existingProduct) {
                  _.remove(humidor.Cigars, {ProductId: product.Id});

                  let submodels = _.find(humidor._submodels, {resource: 'ProductResource'} as any) as any;
                  if (submodels) {
                    const i = submodels.data.indexOf(product.Id);
                    if (i !== -1) {
                      submodels.data.splice(i, 1);
                    }
                  }
                }
              });

              this.update(collection)
                .subscribe(
                  () => {
                    o.next(collection);
                    return o.complete();
                  },
                  (err) => {
                    return o.error(err);
                  }
                );
            },
            (err) => {
              return o.error(err);
            }
          );
      });
    };
  }

}
