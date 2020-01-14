import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(ArrayList: any, term: any): any {
    // check if search term is undefined

    if (term === undefined) return ArrayList;
    //return updated subTypes
    term = term.toLowerCase();
    return ArrayList.filter((item: any) => {
      if(item.name !=null){
      return item.name.toLowerCase().includes(term);
      }
    });

  }

  Tabletransform(ArrayList: any, term: any): any {
    // check if search term is undefined

    if (term === undefined) return ArrayList;
    //return updated subTypes
    term = term.toLowerCase();
    return ArrayList.filter((item: any) => {
        return item.entityName.toLowerCase().includes(term);
    });

}
}

export class SchedulerFilterPipe implements PipeTransform {

  transform(ArrayList: any, term: any): any {
    // check if search term is undefined

    if (term === undefined) return ArrayList;
    //return updated subTypes
    term = term.toLowerCase();
    return ArrayList.filter((item: any) => {
      return item.coordxmlname.toLowerCase().includes(term);
    });

  }
}
