import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(ArrayList: any, term: any): any {
    // check if search term is undefined
    console.log("arraylist" + ArrayList);
    console.log("inside transform");
    if (term === undefined) return ArrayList;
    //return updated subTypes
    term = term.toLowerCase();
    console.log("term" + term);

    return ArrayList.filter((item: any) => {
      console.log("item" + item);
      console.log("first item " + item[0]);
      if (item[0].toString().match(term) != null) {
        return item[0];
      }
    });
  }

  transformFiles(ArrayList: any, term: any): any {
    console.log("arraylist" + ArrayList);
    console.log("inside transformFiles");
    if (term === undefined) return ArrayList;
    //return updated subTypes
    term = term.toLowerCase();
    console.log("term " + term);

    return ArrayList.filter((item: any) => {
      console.log("item " + item);
      if (item.match(term) != null) {
        return item;
      }

    });

  }


  transformFlow(ArrayList: any, term: any): any {
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

  filterComments(jsonArray: any, filterKey: any): any {
    if (filterKey === undefined) return jsonArray;
    filterKey = filterKey.toLowerCase();
    return jsonArray.filter((eachJson: any) => {
      if (eachJson.tableComments != null) {
        return eachJson.tableComments.toLowerCase().includes(filterKey);
      }
    });
  }

  filterDates(jsonArray: any, filterKey: any): any {
    if (filterKey === undefined) return jsonArray;
    filterKey = filterKey.toLowerCase();
    return jsonArray.filter((eachJson: any) => {
      if (eachJson.createdDate != null) {
        return eachJson.createdDate.toLowerCase().includes(filterKey);
      }
    });
  }


}

