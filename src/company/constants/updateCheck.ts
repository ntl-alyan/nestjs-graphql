/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-const */
export async function shallowEqual(object1: any, object2: any) {
    delete object1.MODIFIED_BY;
    delete object2.MODIFIED_BY as any;
  
    const object3 = Object.keys(object2)
      .filter((key) => Object.keys(object1).includes(key))
      .reduce((obj, key) => {
        obj[key] = object2[key];
        return obj;
      }, {});
  
    if (
      Object.entries(object1).toString() === Object.entries(object3).toString()
    ) {
  
      return false;
    } else {
      
      return true;
    }
  }
  