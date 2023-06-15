import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environment';
import { GroceryItem } from '../data.interface';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
 constructor(private http:HttpClient){}
  getProducts(sortOrder?:'asc'|'desc'):Observable<GroceryItem[]>{
    if(sortOrder){
      environment.getProducts+=`?sort=price&order=${sortOrder}`
    }
    return this.http.get<any>(`${environment.getProducts}`)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
 
}

