import { HttpClient } from '@angular/common/http';
import {Component} from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent {
  searchResults:any[]=[];
  ingredient:any;
  showContainer:boolean=false;  
  selectedButton:string='';
  constructor(
    private recipeService:RecipeService,
    private http:HttpClient){}
  ngOnInit(){
    this.recipeService.currentResults.subscribe((results:any[])=>{
      this.searchResults=results;
      console.log(this.searchResults,"results from food.json");
    })
    this.recipeService.currentContainerVisibility.subscribe((visibility)=>{
      this.showContainer=visibility;
    })    
  }
  searchFood(ingredient:string){
    this.selectedButton=ingredient;
    this.searchResults=[];
    this.recipeService.fetchRecipe(ingredient).subscribe((data)=>{
      let foodData=data;
      this.searchResults=[...this.searchResults,...foodData]
      console.log(this.searchResults);
      this.recipeService.updateContainerVisibility(true);
    },
    (error)=>{
      console.log('Error in loading/parsing the JSON file:',error);
    })    
  }
  handleSearch(isSearchTouched:boolean){
    this.selectedButton='';
    console.log("search triggered");
  }

}
