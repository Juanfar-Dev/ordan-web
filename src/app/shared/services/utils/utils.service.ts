import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public areObjectsEqual = (obj1: any, obj2: any) => {
      // The key order must be consistent for this to work correctly.
      const json1 = JSON.stringify(obj1);
      const json2 = JSON.stringify(obj2);
      return json1 === json2;
    };
}
