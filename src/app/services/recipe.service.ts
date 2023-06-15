import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
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

  

  
}
