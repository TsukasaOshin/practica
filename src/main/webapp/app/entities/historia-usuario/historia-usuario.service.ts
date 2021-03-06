import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IHistoriaUsuario } from 'app/shared/model/historia-usuario.model';

type EntityResponseType = HttpResponse<IHistoriaUsuario>;
type EntityArrayResponseType = HttpResponse<IHistoriaUsuario[]>;

@Injectable({ providedIn: 'root' })
export class HistoriaUsuarioService {
  public resourceUrl = SERVER_API_URL + 'api/historia-usuarios';

  constructor(protected http: HttpClient) {}

  create(historiaUsuario: IHistoriaUsuario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiaUsuario);
    return this.http
      .post<IHistoriaUsuario>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(historiaUsuario: IHistoriaUsuario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiaUsuario);
    return this.http
      .put<IHistoriaUsuario>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IHistoriaUsuario>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHistoriaUsuario[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(historiaUsuario: IHistoriaUsuario): IHistoriaUsuario {
    const copy: IHistoriaUsuario = Object.assign({}, historiaUsuario, {
      fecha: historiaUsuario.fecha && historiaUsuario.fecha.isValid() ? historiaUsuario.fecha.format(DATE_FORMAT) : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fecha = res.body.fecha ? moment(res.body.fecha) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((historiaUsuario: IHistoriaUsuario) => {
        historiaUsuario.fecha = historiaUsuario.fecha ? moment(historiaUsuario.fecha) : undefined;
      });
    }
    return res;
  }
}
