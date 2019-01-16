import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { ApiService } from '../../services/api.service';
import { ProductModel } from '../../models/product.model';
import { SearchableResourceInterface } from '../searchable-resource.interface';
import { Observable } from 'rxjs/Observable';
import { ProductNoteModel } from '../../models/product-note.model';
import { ManualCigarEntryModel } from '../../models/manual-cigar-entry.model';

@Injectable()
export class ProductApiResource extends BaseApiResource implements ApiResourceInterface, SearchableResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  public get(id) {
    let params = ProductModel.decomposeId(id);

    return this.apiService.get('cigars/' + params.type + '/' + params.id)
      .map(res => new ProductModel(res.json()));
  }

  getList(ids) {
    let params = ProductModel.decomposeId(ids[0]);
    let key = params.type === 'lines' ? 'LineIds' : 'ProductIds';
    let queryParams = ids.map(id => key +'=' + id.slice(2)).join('&');

    return this.apiService.get('cigars/' + params.type + '?' + queryParams)
      .map(res => this._mapCollection(ProductModel, res.json()));
  }

  createCustom(cigar: ManualCigarEntryModel) {
    return this.apiService.post(
      'cigars/custom/product',
      {
        Name: cigar.Name,
        Description: cigar.Description
      }
    ).map(res => new ProductModel(res.json()));
  }

  updateCustom(product: ProductModel) {
    return this.apiService.put(
      'cigars/custom/product/' + product.ProductId,
      {
        Name: product.Name,
        Description: product.Description
      }
    ).map(res => new ProductModel(res.json()));
  }

  public search(term, skip, take, list?) {
    return this.apiService
      .post('cigars/search/light', {
        'SearchString': term,
        'ListId': list,
        'Take': take,
        'Skip': skip
      })
      .map(res => this._mapCollection(ProductModel, res.json()));
  }

  public saveNote(product: ProductModel): Observable<ProductModel> {
    let params = ProductModel.decomposeId(product.Id);

    return this.apiService.post(
      'cigars/' + params.type + '/' + params.id + '/note',
      this._prepareStringAsPayload(product.MyNote.Note)
    ).map(res => {
      product.MyNote = new ProductNoteModel(res.json());
      return product;
    });
  }

}
