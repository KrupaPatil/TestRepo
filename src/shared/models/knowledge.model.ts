import { BaseModel } from './base.model';

export class KnowledgeModel extends BaseModel {
  ContentId: number;
  Title: string;
  Html: string;
  Url: string;
}
