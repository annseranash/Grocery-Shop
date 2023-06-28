import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private foodJsonUrl='./assets/food.json';
  constructor(private http:HttpClient){}
  public search=new BehaviorSubject<any>("");
  currentResults=this.search.asObservable();
  
  private showContainer=new BehaviorSubject<boolean>(false);
  currentContainerVisibility=this.showContainer.asObservable();

  updateResults(results:any){
    this.search.next(results);
  }

  updateContainerVisibility(visibility:boolean){
    this.showContainer.next(visibility);
  }

  fetchRecipe(food:string){
    return this.http.get<any[]>(this.foodJsonUrl).pipe(map(data=>{
      const regex=new RegExp(food,'i');
      return data.filter((food)=>regex.test(food.name));
    }))
  }
}


